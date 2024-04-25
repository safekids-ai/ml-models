import { Injectable } from '@nestjs/common';
import { GoogleApiService } from '../google-apis/google.apis.service';
import { QueryException } from '../error/common.exception';
import { OrgUnitService } from '../org-unit/org-unit.service';
import { LoggingService } from '../logger/logging.service';
import { CreateOrgUnitDto } from '../org-unit/dto/create-org-unit.dto';
import { OrgUnit } from '../org-unit/entities/org-unit.entity';
import { UserService } from '../user/user.service';
import { User, UserCreationAttributes } from '../user/entities/user.entity';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { uuid } from 'uuidv4';
import { FilteredCategoryService } from '../filtered-category/filtered-category.service';
import { FilteredUrlService } from '../filtered-url/filtered-url.service';
import { WebTimeService } from '../web-time/web-time.service';
import { ActivityService } from '../activity/activity.service';
import { DeviceService } from '../device/device.service';
import { UserDeviceLinkService } from '../user-device-link/user-device-link.service';
import { AuthToken } from '../auth-token/entities/auth-token.entity';
import { Statuses } from '../status/default-status';
import { Status } from '../status/entities/status.entity';

@Injectable()
export class DirectoryService {
    constructor(
        private readonly googleApiService: GoogleApiService,
        private readonly orgUnitService: OrgUnitService,
        private readonly filteredCategoryService: FilteredCategoryService,
        private readonly filteredUrlService: FilteredUrlService,
        private readonly webTimeService: WebTimeService,
        private readonly userService: UserService,
        private readonly deviceService: DeviceService,
        private readonly userDeviceLinkService: UserDeviceLinkService,
        private readonly activityService: ActivityService,
        private readonly authTokenService: AuthTokenService,
        private readonly log: LoggingService
    ) {}

    /** Populate organizational units
     * @param accountId
     * @param userId
     * @returns void
     */
    async populateOrgUnits(accountId: string, userId: string): Promise<void> {
        const tokenInfo = await this.authTokenService.findByUserIdDecrypted(userId);

        const apiUnits = await this.googleApiService.fetchOrgUnits(tokenInfo);
        apiUnits.forEach((unit) => {
            unit.accountId = accountId;
        });
        const dbUnits = await this.orgUnitService.findAllByAccountId(accountId);
        await this.addOrgUnits(apiUnits, dbUnits);
        await this.deleteOrgUnits(apiUnits, dbUnits);
        await this.updateOrgUnits(apiUnits, dbUnits);
    }

    private async addOrgUnits(apiUnits: CreateOrgUnitDto[], dbUnits: OrgUnit[]) {
        const dbUnitIds = dbUnits.map((unit) => unit.googleOrgUnitId);
        const unitsToAdd = apiUnits.filter((unit) => !dbUnitIds.includes(unit.googleOrgUnitId));
        if (unitsToAdd.length > 0) {
            try {
                unitsToAdd.forEach((unit) => {
                    unit.id = uuid();
                });
                await this.orgUnitService.bulkCreate(unitsToAdd);
            } catch (e) {
                this.log.error(QueryException.save(e));
                throw new QueryException(QueryException.save());
            }
        }
    }

    private async deleteOrgUnits(apiUnits: CreateOrgUnitDto[], dbUnits: OrgUnit[]) {
        const apiUnitIds = apiUnits.map((unit) => unit.googleOrgUnitId);
        const unitsToDelete = dbUnits.filter((unit) => !apiUnitIds.includes(unit.googleOrgUnitId)).map((unit) => unit.id);

        if (unitsToDelete.length > 0) {
            try {
                const devices = await this.deviceService.findAllByOrgUnits(unitsToDelete);
                const deviceIds = devices.map((device) => device.id);
                await this.userDeviceLinkService.deleteAll(deviceIds);
                await this.deviceService.deleteAll(unitsToDelete);
                await this.userService.deleteAllOrgUnits(unitsToDelete);
                await this.activityService.deleteAll(unitsToDelete);
                await this.webTimeService.deleteAll(unitsToDelete);
                await this.filteredUrlService.deleteAll(unitsToDelete);
                await this.filteredCategoryService.deleteAll(unitsToDelete);
                await this.orgUnitService.deleteAll(unitsToDelete);
            } catch (e) {
                this.log.error(QueryException.delete(e));
                throw new QueryException(QueryException.delete());
            }
        }
    }

    private async updateOrgUnits(apiUnits: CreateOrgUnitDto[], dbUnits: OrgUnit[]) {
        for (const unit of apiUnits) {
            const dbUnitIds = dbUnits.map((unit) => unit.googleOrgUnitId);
            if (dbUnitIds.includes(unit.googleOrgUnitId)) {
                try {
                    await this.orgUnitService.findOneAndUpdate(unit.googleOrgUnitId, unit);
                } catch (e) {
                    this.log.error(QueryException.save(e));
                    throw new QueryException(QueryException.save());
                }
            }
        }
    }

    /** Populate users
     *@param accountId
     *@param tokenInfo
     *@returns void
     */
    async syncUsers(accountId: string, tokenInfo: AuthToken): Promise<void> {
        const apiUsers = await this.googleApiService.fetchUsers(tokenInfo);
        this.log.info(`${apiUsers.length} users returned from google admin apis for account ${accountId}`);
        const dbUsers = await this.userService.findAllByAccountId(accountId);
        await this.addUsers(apiUsers, dbUsers, accountId);
        await this.updateUsers(apiUsers, dbUsers, accountId);
        //commenting out as this will delete SIS(ONE ROSTER) users
        // await this.deleteUsers(apiUsers, dbUsers);
    }

    private async addUsers(apiUsers: any[], dbUsers: User[], accountId: string) {
        const dbUserEmails = dbUsers.map((user) => user.email);
        const usersToAdd = await Promise.all(
            apiUsers
                .filter((user) => !dbUserEmails.includes(user.primaryEmail))
                .map(async (user) => {
                    const unit = await this.orgUnitService.findOneByOrgUnitPath(user.orgUnitPath, accountId);
                    const orgUnitId = unit ? unit.id : (await this.orgUnitService.findOneByOrgUnitPath('/', accountId)).id;
                    const userCreationObject : UserCreationAttributes = {
                        id: uuid().replace(/-/g, ''),
                        firstName: user.name.givenName,
                        lastName: user.name.familyName,
                        email: user.primaryEmail,
                        recoveryEmail: user.recoveryEmail,
                        accountId: accountId,
                        orgUnitId: orgUnitId,
                        orgUnitPath: user.orgUnitPath,
                        isAdmin: user.isAdmin,
                        statusId: Statuses.ACTIVE,
                        googleUserId: user.id,
                        password: user.password, // FIXME: verify if password is needed in bulk create and this is the relevant field
                        accessCode: null,
                        accessLimited: false,
                    };
                    return userCreationObject;
                })
        );

        if (usersToAdd.length > 0) {
            try {
                await this.userService.bulkCreate(usersToAdd);
            } catch (e) {
                this.log.error(QueryException.save(e));
                throw new QueryException(QueryException.save());
            }
        }
    }

    private async deleteUsers(apiUsers: any[], dbUsers: User[]) {
        const apiUserEmails = apiUsers.map((user) => user.primaryEmail);
        const usersToDelete = dbUsers.filter((user) => !apiUserEmails.includes(user.email)).map((user) => user.id);

        if (usersToDelete.length > 0) {
            try {
                await this.authTokenService.deleteAll(usersToDelete);
                await this.userService.deleteAll(usersToDelete);
            } catch (e) {
                this.log.error(QueryException.delete(e));
                throw new QueryException(QueryException.delete());
            }
        }
    }

    private async updateUsers(apiUsers: any[], dbUsers: User[], accountId: string) {
        for (const user of apiUsers) {
            const dbUserEmails = dbUsers.map((user) => user.email);
            if (dbUserEmails.includes(user.primaryEmail)) {
                const unit = await this.orgUnitService.findOneByOrgUnitPath(user.orgUnitPath, accountId);
                const orgUnitId = unit ? unit.id : (await this.orgUnitService.findOneByOrgUnitPath('/', accountId)).id;
                const objectToUpdate : Partial<UserCreationAttributes> = {
                    firstName: user.name.givenName,
                    lastName: user.name.familyName,
                    email: user.primaryEmail,
                    recoveryEmail: user.recoveryEmail,
                    accountId: accountId,
                    orgUnitId: orgUnitId,
                    isAdmin: user.isAdmin,
                    statusId: Statuses.ACTIVE,
                    googleUserId: user.id,
                };
                try {
                    await this.userService.findOneAndUpdate(user.primaryEmail, objectToUpdate);
                } catch (e) {
                    this.log.error(QueryException.save(e));
                    throw new QueryException(QueryException.save());
                }
            }
        }
    }

    async fetchUser(email: string, authToken: AuthToken) {
        return await this.googleApiService.getUser(email, authToken);
    }
}
