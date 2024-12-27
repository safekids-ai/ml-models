import { FilteredProcessService } from './../../filtered-process/filtered-process.service';
import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { ACCOUNT_REPOSITORY, PLAN_REPOSITORY, SEQUELIZE, USER_REPOSITORY } from '../../constants';
import { v4 as uuidv4 } from 'uuid';
import { User, UserCreationAttributes } from '../../user/entities/user.entity';
import { KidDto } from './dto/kid.dto';
import { UserRoles } from '../../user/user.roles';
import { Statuses } from '../../status/default-status';
import { CommonUtils } from '../../utils/commonUtils';
import { CreateOrgUnitDto } from '../../org-unit/dto/create-org-unit.dto';
import { OrgUnitService } from '../../org-unit/org-unit.service';
import { ActivityService } from '../../activity/activity.service';
import { DeviceService } from '../../device/device.service';
import { UserDeviceLinkService } from '../../user-device-link/user-device-link.service';
import { FilteredUrlService } from '../../filtered-url/filtered-url.service';
import { FilteredCategoryService } from '../../filtered-category/filtered-category.service';
import { QueryException } from '../../error/common.exception';
import { LoggingService } from '../../logger/logging.service';
import { Sequelize } from 'sequelize-typescript';
import { KidConfigService } from '../../kid-config/kid-config.service';
import { KidRequestService } from '../../kid-request/kid-request.service';
import { Account } from '../../accounts/entities/account.entity';
import { ParentConsentService } from '../parent-consent/parent-consent.service';
import { SubscriptionService } from '../../billing/subscription/subscription.service';
import { PaymentService } from '../../billing/payment/payment.service';
import { SubscriptionFeedbackService } from '../../billing/subscription-feedback/subscription-feedback.service';
import { InvoiceService } from '../../billing/invoice/invoice.service';
import { PromoCodeService } from '../../billing/promo-code/promo-code.service';
import { Plan } from '../../billing/plan/entities/plan.entity';
import { QueryTypes } from 'sequelize';

@Injectable()
export class ConsumerUserService {
    private readonly sequelize: Sequelize;
    private readonly TIME_DIFF: number;

    constructor(
        @Inject(SEQUELIZE) sequelize: Sequelize,
        @Inject(USER_REPOSITORY) private readonly repository: typeof User,
        @Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: typeof Account,
        private readonly orgUnitService: OrgUnitService,
        private readonly activityService: ActivityService,
        private readonly deviceService: DeviceService,
        private readonly userDeviceLinkService: UserDeviceLinkService,
        private readonly filteredUrlService: FilteredUrlService,
        private readonly filteredCategoryService: FilteredCategoryService,
        private readonly log: LoggingService,
        private readonly kidConfigService: KidConfigService,
        private readonly kidRequestService: KidRequestService,
        private readonly parentConsentService: ParentConsentService,
        private readonly subscriptionService: SubscriptionService,
        private readonly subscriptionFeedbackService: SubscriptionFeedbackService,
        private readonly paymentService: PaymentService,
        private readonly invoiceService: InvoiceService,
        private readonly promoCode: PromoCodeService,
        private readonly filteredProcessService: FilteredProcessService,
        @Inject(PLAN_REPOSITORY) private readonly planRepository: typeof Plan
    ) {
        this.sequelize = sequelize;
        this.log.className(ConsumerUserService.name);
        this.TIME_DIFF = 30;
    }

    /**
     * Create user
     * @param dto create user request
     * @returns void
     */
    async create(dto: UserCreationAttributes): Promise<User> {
        try {
            dto.id = uuidv4();
            return await this.repository.create(dto);
        } catch (error) {
            this.log.error(QueryException.save(error));
            throw new QueryException(QueryException.save());
        }
    }

    /**
     * Find user by email
     * @param email
     * @returns User
     */
    async findOneByEmail(email: string): Promise<User> {
        return await this.repository.findOne({ where: { email } });
    }

    /**
     * Find user by id
     * @param id
     * @returns User
     */
    async findOneById(id: string): Promise<User> {
        return await this.repository.findOne({ where: { id } });
    }

    /**
     * Update user
     * @param id user id
     * @param objToUpdate
     * @returns void
     */
    async update(id: string, objToUpdate: Partial<UserCreationAttributes>): Promise<void> {
        try {
            await this.repository.update(objToUpdate, { where: { id } });
        } catch (error) {
            this.log.error(QueryException.update(error));
            throw new QueryException(QueryException.update());
        }
    }

    /**
     * Create kids in bulk
     * @param userId
     * @param accountId
     * @param inputKids create kids request
     * @returns void
     */
    async syncKids(userId: string, accountId: string, inputKids: KidDto[]): Promise<void> {
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            const parentUser = await this.findOneById(userId);
            const existingKids = await this.repository.findAll<User>({ where: { accountId, role: UserRoles.KID } });
            const planType = await this.getPlanType(accountId);
            await this.addKids(inputKids, accountId, parentUser, planType);
            await this.updateKids(inputKids, parentUser);
            await this.deleteKids(existingKids, inputKids);
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
    }

    /**
     * Find user by Access Code
     * @param accessCode
     * @returns User
     */
    async findUserByAccessCode(accessCode: string): Promise<User> {
        return await this.repository.findOne({ where: { accessCode } });
    }

    /**
     * Find kids by accountId
     * @param accountId
     * @param role
     * @returns UserDto[]
     */
    async findUsersByAccountId(accountId: string, role: UserRoles): Promise<UserDto[]> {
        try {
            const users = await this.repository.findAll({
                attributes: ['id', 'firstName', 'lastName', 'accessCode', 'statusId', 'yearOfBirth'],
                where: { accountId, role },
            });
            const userDTOs = [];
            for (const user of users) {
                const userDTO = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    accessCode: user.accessCode,
                    yearOfBirth: user.yearOfBirth,
                } as UserDto;
                if (user.statusId === Statuses.ACTIVE && (await this.checkLastActivity(user))) {
                    userDTO.status = Statuses.CONNECTED;
                    userDTOs.push(userDTO);
                } else {
                    userDTO.status = Statuses[user.statusId];
                    userDTOs.push(userDTO);
                }
            }
            return userDTOs;
        } catch (e) {
            this.log.error(QueryException.fetch(e));
            throw new QueryException(QueryException.fetch());
        }
    }

    /**
     * Find consumer kids
     * @param accountId
     * @param start
     * @param end
     * @returns UserDto[]
     */
    async findConsumerKids(accountId: string, start: Date, end: Date): Promise<UserDto[]> {
        const users = await this.repository.findAll({
            attributes: ['id', 'firstName', 'lastName', 'accessCode', 'statusId', 'yearOfBirth', 'accessLimited'],
            where: { accountId, role: UserRoles.KID },
        });
        const userDTOs = [];
        for (const user of users) {
            const userDTO = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                accessCode: user.accessCode,
                yearOfBirth: user.yearOfBirth,
                accessLimited: user.accessLimited,
            } as UserDto;
            if (user.statusId === Statuses.ACTIVE && (await this.checkLastActivity(user))) {
                userDTO.status = Statuses.CONNECTED;
            } else {
                userDTO.status = Statuses.NOT_CONNECTED;
            }
            userDTO.topCategories = await this.activityService.findTopCategoriesByUser(user.id, start, end);
            userDTO.kidRequests = await this.kidRequestService.findAskRequests(user.id);
            userDTO.activity = await this.activityService.findAllPrrLevelsCount(user.id, start, end);
            userDTOs.push(userDTO);
        }
        return userDTOs;
    }

    private async checkLastActivity(user: User): Promise<boolean> {
        const activityTime = await this.activityService.findUserLastActivity(user.id);
        if (!activityTime) {
            return false;
        }
        return new Date().getTime() - new Date(activityTime).getTime() < this.TIME_DIFF * 60 * 1000;
    }

    private async createKidOrgUnit(fullName: string, accessCode: string, accountId: string, parentEmail: string) {
        const orgUnitDTO = {
            name: fullName,
            googleOrgUnitId: ConsumerUserService.buildGoogleOrgUnitId(accessCode),
            accountId: accountId,
            orgUnitPath: '/' + fullName,
            parent: '/',
            parentOuId: 'id:' + parentEmail,
        } as CreateOrgUnitDto;
        return await this.orgUnitService.create(orgUnitDTO);
    }

    private static buildGoogleOrgUnitId(accessCode: string): string {
        return 'id:' + accessCode;
    }

    private async updateKidOrgUnit(fullName: string, accessCode: string) {
        const googleOrgUnitId = 'id:' + accessCode;
        const objToUpdate = {
            name: fullName,
            orgUnitPath: '/' + fullName,
        } as CreateOrgUnitDto;
        return await this.orgUnitService.findOneAndUpdate(googleOrgUnitId, objToUpdate);
    }

    private async generateUniqueAccessCode() {
        let isUniqueCode = false;
        let accessCode = '';
        while (!isUniqueCode) {
            accessCode = await CommonUtils.generate6DigitAlphanumericCode();

            const accessCodeExists = await this.findUserByAccessCode(accessCode);
            if (!accessCodeExists) {
                isUniqueCode = true;
            }
        }
        return accessCode;
    }

    private async addKids(inputKids: KidDto[], accountId: string, parentUser: User, planType: string) {
        const kidsToAdd = inputKids.filter((kid) => !kid.id);
        for (const kid of kidsToAdd) {
            const fullName = kid.firstName + ' ' + kid.lastName;
            const kidEmail = ConsumerUserService.buildKidEmail(kid.firstName, kid.lastName, parentUser.email);
            const accessCode = await this.generateUniqueAccessCode();
            const kidOrgUnit = await this.createKidOrgUnit(fullName, accessCode, accountId, parentUser.email);
            await this.filteredCategoryService.saveDefaultCategoriesForOrgUnit(accountId, kidOrgUnit.id, planType);

            const userDTO : UserCreationAttributes = {
                firstName: kid.firstName,
                lastName: kid.lastName,
                email: kidEmail,
                yearOfBirth: kid.yearOfBirth,
                accessCode,
                accountId,
                orgUnitId: kidOrgUnit.id,
                role: UserRoles.KID,
                password: null,
                statusId: Statuses.INACTIVE,
                accessLimited: false,
            };
            const user = await this.create(userDTO);
            await this.kidConfigService.create(user.id);
        }
    }

    private async updateKids(inputKids: KidDto[], parentUser: User) {
        const kidsToUpdate = inputKids.filter((kid) => kid.id);
        for (const kid of kidsToUpdate) {
            const fullName = kid.firstName + ' ' + kid.lastName;
            const kidEmail = ConsumerUserService.buildKidEmail(kid.firstName, kid.lastName, parentUser.email);
            const dbKid = await this.findOneById(kid.id);
            await this.updateKidOrgUnit(fullName, dbKid.accessCode);

            const userDTO : Partial<UserCreationAttributes> = {
                firstName: kid.firstName,
                lastName: kid.lastName,
                email: kidEmail,
                yearOfBirth: kid.yearOfBirth,
            };
            await this.update(kid.id, userDTO);
        }
    }

    private async deleteKids(existingKids: User[], inputKids: KidDto[]) {
        try {
            const inputKidIds = inputKids.filter((kid) => kid.id).map((kid) => kid.id);
            const kidsToDelete = existingKids.filter((kid) => !inputKidIds.includes(kid.id)).map((kid) => kid.id);
            if (kidsToDelete && kidsToDelete.length > 0) {
                const users = await this.repository.findAll({
                    attributes: ['id', 'accessCode'],
                    where: { id: kidsToDelete },
                });
                const accessCodeMap = new Map(
                    users.map((user) => {
                        return [user.id, user.accessCode];
                    })
                );

                const googleOrgUnitIds = kidsToDelete.map((kidId) => ConsumerUserService.buildGoogleOrgUnitId(accessCodeMap.get(kidId)));
                const unitsToDelete = (await this.orgUnitService.findAllByGoogleOrgUnitId(googleOrgUnitIds)).map((unit) => unit.id);
                const deviceIds = (await this.deviceService.findAllByOrgUnits(unitsToDelete)).map((device) => device.id);

                await this.userDeviceLinkService.deleteAll(deviceIds);
                await this.deviceService.deleteAll(unitsToDelete);
                await this.kidConfigService.deleteByUserIds(kidsToDelete);
                await this.kidRequestService.deleteByKidIds(kidsToDelete);
                await this.deleteByIds(kidsToDelete);
                await this.activityService.deleteAll(unitsToDelete);
                await this.filteredUrlService.deleteAll(unitsToDelete);
                await this.filteredCategoryService.deleteAll(unitsToDelete);
                await this.orgUnitService.deleteAll(unitsToDelete);
                await this.filteredProcessService.deleteAll(unitsToDelete);
            }
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    private async deleteByIds(kidsToDelete: string[]) {
        try {
            await this.repository.destroy({ where: { id: kidsToDelete }, force: true });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    static buildKidEmail(firstName: string, lastName: string, parentEmail: string): string {
        return firstName + '_' + lastName + ':' + parentEmail;
    }

    //test api
    async deleteAccount(userId: string, accountId: string, dto: { email: string }) {
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            const account = await this.accountRepository.findOne<Account>({
                where: { primaryDomain: dto.email },
                attributes: ['id'],
            });
            if (account && account.id) {
                const users = await this.repository.findAll({
                    attributes: ['id', 'accessCode'],
                    where: { accountId },
                });
                const kidsToDelete = users.map((user) => user.id);
                const unitsToDelete = (await this.orgUnitService.findAllByAccountId(accountId)).map((unit) => unit.id);
                const deviceIds = (await this.deviceService.findAllByOrgUnits(unitsToDelete)).map((device) => device.id);

                await this.userDeviceLinkService.deleteAll(deviceIds);
                await this.deviceService.deleteAll(unitsToDelete);
                await this.kidConfigService.deleteByUserIds(kidsToDelete);
                await this.kidRequestService.deleteByKidIds(kidsToDelete);
                await this.parentConsentService.delete(accountId);
                await this.deleteByIds(kidsToDelete);
                await this.activityService.deleteAll(unitsToDelete);
                await this.filteredUrlService.deleteAll(unitsToDelete);
                await this.filteredCategoryService.deleteAll(unitsToDelete);
                await this.orgUnitService.deleteAll(unitsToDelete);
                await this.invoiceService.delete(accountId);
                await this.subscriptionService.delete(accountId);
                await this.paymentService.deleteAll(accountId);
                await this.subscriptionFeedbackService.delete(accountId, false);
                await this.promoCode.delete(accountId);
                await this.filteredProcessService.deleteAccount(accountId);
                await this.accountRepository.destroy({ where: { id: accountId }, force: true });
                await transaction.commit();
            }
        } catch (e) {
            await transaction.rollback();
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
    }

    private async getPlanType(accountId: string) {
        const query =
            'select ' + 'p.plan_type  ' + 'from ' + 'subscription s ' + 'inner join plan p on ' + 's.plan_id = p.id ' + 'where ' + 's.account_id = :accountId;';

        const plan = await this.planRepository.sequelize.query(query, {
            replacements: { accountId },
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: Plan,
        });

        return plan[0] && plan[0].planType ? plan[0].planType : null;
    }
}
