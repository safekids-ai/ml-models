import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserAttributes, UserCreationAttributes } from './entities/user.entity';
import { SEQUELIZE, USER_REPOSITORY } from '../constants';
import { CountOptions, Op } from 'sequelize';
import { GoogleApiService } from '../google-apis/google.apis.service';
import { getPagination, getPagingData } from '../paging/paging.util';
import { uuid } from 'uuidv4';
import { LoggingService } from '../logger/logging.service';
import { QueryException } from '../error/common.exception';
import { Sequelize } from 'sequelize-typescript';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { OrgUnitService } from '../org-unit/org-unit.service';
import { UserRoles } from './user.roles';
import { GoogleApisErrors } from '../google-apis/google-apis.errors';
import { Statuses } from '../status/default-status';
import { Account } from '../accounts/entities/account.entity';
import { AccountTypes } from '../account-type/account-type.enum';
import { admin_directory_v1 } from 'googleapis';

@Injectable()
export class UserService {
    private readonly sequelize: Sequelize;
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        private readonly googleApiService: GoogleApiService,
        private readonly authTokenService: AuthTokenService,
        private readonly log: LoggingService,
        private readonly orgUnitService: OrgUnitService,
        @Inject(SEQUELIZE) sequelize: Sequelize
    ) {
        this.sequelize = sequelize;
    }

    /**
     * Create user
     * @param dto create user request
     * @returns void
     */
    async create(dto: UserCreationAttributes): Promise<User> {
        if (!dto.id) {
            dto.id = uuid();
        }
        return await this.userRepository.create(dto);
    }

    update(id: string, updateUserDto: Partial<UserAttributes>) {
        return this.userRepository.update(updateUserDto, { where: { id: id } });
    }

    /**
     * Create user
     * @param dto create user request
     * @returns void
     */
    async findAll(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    remove(id: string) {
        return this.userRepository.destroy({ where: { id: id } });
    }

    /**
     * creates users in bulk
     * @param createUserDtos
     */
    async bulkCreate(createUserDTOs: UserCreationAttributes[]) {
        await this.userRepository.bulkCreate(createUserDTOs);
    }

    async countByAccount(options: CountOptions) {
        await this.userRepository.count(options);
    }

    patch(userId: string, updateUserDto: Partial<UserAttributes>) {
        return this.userRepository.update(updateUserDto, { where: { id: userId } });
    }

    async makeAdmin(userId: string, updateUserDto: Partial<UserAttributes>): Promise<any> {
        return await User.update({ isAdmin: updateUserDto.isAdmin }, { where: { id: userId } });
    }

    updateStatus(userId: string, updateUserDto: Partial<UserAttributes>) {
        return this.userRepository.update({ statusId: updateUserDto.statusId }, { where: { id: userId } });
    }

    async limitAccess(kidId: string, limitAccess: boolean): Promise<void> {
        await this.userRepository.update({ accessLimited: limitAccess }, { where: { id: kidId } });
    }

    getUserGroups(userId: string) {
        return undefined;
    }

    async makeTeacher(email: string, loggedInUserId: string, accountId: string): Promise<void> {
        const user = await this.findOneByEmail(email);
        if (user) {
            await this.userRepository.update({ role: UserRoles.DISTRICT_USER, statusId: Statuses.ACTIVE }, { where: { id: user.id } });
            return;
        }
        this.log.debug(`User not found by email ${email}. Fetching user from google apis.`);
        const authToken = await this.authTokenService.findByUserIdDecrypted(loggedInUserId);
        const apiUser : admin_directory_v1.Schema$User = await this.googleApiService.getUser(email, authToken);
        if (!apiUser) {
            this.log.error(GoogleApisErrors.emailNotExists(email));
            throw new NotFoundException(GoogleApisErrors.emailNotExists(email));
        }
        const unit = await this.orgUnitService.findOneByOrgUnitPath(apiUser.orgUnitPath, accountId);
        const orgUnitId = unit ? unit.id : (await this.orgUnitService.findOneByOrgUnitPath('/', accountId)).id;
        const registeredUser = await this.registerChromeUser(accountId, apiUser, orgUnitId);
        await this.userRepository.update({ role: UserRoles.DISTRICT_USER, statusId: Statuses.ACTIVE }, { where: { id: registeredUser.id } });
    }

    /**
     * Find user by email
     * @param email
     * @returns User
     */
    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ where: { email: email } });
    }

    /**
     * find user by id
     * @param id
     */
    async findOneById(id: string): Promise<User> {
        return this.userRepository.findOne<User>({ where: { id: id } });
    }

    async findAllByOrgUnitId(orgUnitId: string): Promise<User[]> {
        return this.userRepository.findAll<User>({ where: { orgUnitId: orgUnitId } });
    }

    async findAllByAccountId(accountId: string): Promise<User[]> {
        return this.userRepository.findAll<User>({ where: { accountId } });
    }

    removeBySourceId(sourceId: string) {
        return this.userRepository.destroy({ where: { sourceId: sourceId } });
    }

    async deleteAll(ids: string[]): Promise<void> {
        await this.userRepository.destroy({ where: { id: ids } });
    }

    async deleteAllOrgUnits(ids: string[]): Promise<void> {
        await this.userRepository.destroy({ where: { orgUnitId: ids } });
    }

    async findOneAndUpdate(email: string, objectToUpdate = {}): Promise<void> {
        await this.userRepository.update(objectToUpdate, { where: { email } });
    }

    async upsert(dto: UserCreationAttributes): Promise<User> {
        try {
            const found = await this.userRepository.findOne({ where: { email: dto.email } });
            if (found) {
                await this.userRepository.update(dto, { where: { email: dto.email } });
            } else {
                dto.id = uuid().replace(/-/g, '');
                await this.userRepository.create(dto);
            }
            return await this.userRepository.findOne({ where: { email: dto.email } });
        } catch (e) {
            this.log.error(QueryException.upsert(e));
            throw new QueryException(QueryException.upsert());
        }
    }

    async findAllUsersWithAccessLimited(page, size, accountId, start: Date, end: Date, orgUnitPath: string) {
        const { limit, offset } = getPagination(page, size);

        const result = await this.userRepository.findAndCountAll({
            attributes: ['id', 'primary_email', 'firstName', 'lastName', 'schoolName'],
            where: {
                accountId,
                accessLimited: true,
            },
            limit,
            offset,
            order: [['primary_email', 'ASC']],
        });

        return getPagingData(result, page, limit);
    }

    async registerChromeUser(accountId: string, apiUser : admin_directory_v1.Schema$User, orgUnitId: string) {
        const userDTO : UserCreationAttributes = {
            id: uuid().replace(/-/g, ''),
            firstName: apiUser.name.givenName,
            lastName: apiUser.name.familyName,
            email: apiUser.primaryEmail,
            recoveryEmail: apiUser.recoveryEmail,
            accountId: accountId,
            orgUnitId: orgUnitId,
            orgUnitPath: apiUser.orgUnitPath,
            isAdmin: apiUser.isAdmin ? 1 : 0,
            password: apiUser.password,
            accessCode: null,
            accessLimited: false,
        };
        try {
            await this.userRepository.create(userDTO);
        } catch (e) {
            this.log.debug(QueryException.save(JSON.stringify(e)));
            throw new QueryException(QueryException.save());
        }
        return await this.findOneByEmail(apiUser.primaryEmail);
    }

    async findOneByAccountId(accountId: string, userId: string) {
        return this.userRepository.findOne<User>({ where: { id: userId, accountId } });
    }

    async findTeachersForAccount(accountId: string) {
        const result = await this.userRepository.findAll({
            attributes: ['id', ['primary_email', 'email'], ['thumbnail_photo_url', 'avatar'], 'firstName', 'lastName'],
            where: {
                accountId,
                statusId: Statuses.ACTIVE,
                [Op.or]: [{ role: UserRoles.DISTRICT_USER }, { isAdmin: true }],
            },
            order: [['primary_email', 'ASC']],
        });
        return result;
    }

    /**
     * find user by access code
     * @param accessCode
     */
    async findUserByAccessCode(accessCode: string): Promise<User> {
        return this.userRepository.findOne<User>({ where: { accessCode }, include: { model: Account } });
    }

    async findParentAccount(accountId: string): Promise<User> {
        return await this.userRepository.findOne({
            attributes: ['id', ['primary_email', 'email'], ['thumbnail_photo_url', 'avatar'], 'firstName', 'lastName'],
            include: [
                {
                    model: Account,
                    required: true,
                },
            ],
            where: {
                accountId,
                '$account.account_type_id$': AccountTypes.CONSUMER,
                statusId: Statuses.ACTIVE,
                [Op.or]: [{ role: 'PARENT' }],
            },
        });
    }
}
