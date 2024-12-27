import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDeviceLink, UserDeviceLinkCreationAttributes } from './entities/user-device-link.entity';
import { USER_DEVICE_LINK_REPOSITORY } from '../constants';
import { AccountService } from '../accounts/account.service';
import { UserService } from '../user/user.service';
import { DeviceService } from '../device/device.service';
import { OrgUnitService } from '../org-unit/org-unit.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { GoogleApiService } from '../google-apis/google.apis.service';
import { UserErrors } from '../error/users.errors';
import { GoogleApisErrors } from '../google-apis/google-apis.errors';
import { LoggingService } from '../logger/logging.service';
import { AccountErrors } from '../accounts/account.errors';
import { Statuses } from '../status/default-status';
import { QueryException } from '../error/common.exception';
import { UserDeviceLoginDTO } from '../auth/auth.dto';
import { ChromeDeviceDTO } from '../device/dto/create-device.dto';
import { UserDeviceLinkErrors } from './user-device-link.errors';
import { UserCreationAttributes } from '../user/entities/user.entity';

export class UserDeviceDto {
    deviceLinkId: string;
    email: string;
    userId: string;
    deviceId: string;
    accountId: string;
    googleUserId?: string;
}

@Injectable()
export class UserDeviceLinkService {
    constructor(
        @Inject(USER_DEVICE_LINK_REPOSITORY) private readonly repository: typeof UserDeviceLink,
        private accountService: AccountService,
        private userService: UserService,
        private deviceService: DeviceService,
        private readonly authTokenService: AuthTokenService,
        private readonly googleApiService: GoogleApiService,
        private readonly orgUnitService: OrgUnitService,
        private readonly log: LoggingService
    ) {
        this.log.className(UserDeviceLinkService.name);
    }

    create(createUserDeviceDto: UserDeviceLinkCreationAttributes) {
        createUserDeviceDto.id = uuidv4();
        return this.repository.create(createUserDeviceDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    findById(type: string): Promise<UserDeviceLink> {
        return this.repository.findOne({ where: { id: type } });
    }

    update(id: string, updateUserDeviceDto: Partial<UserDeviceLinkCreationAttributes>) {
        return this.repository.update(updateUserDeviceDto, { where: { id } });
    }

    remove(id: string) {
        return this.repository.destroy({ where: { id } });
    }

    async deleteAll(ids: string[]): Promise<void> {
        try {
            await this.repository.destroy({ where: { deviceId: ids }, force: true });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    /**
     * register user device link. Create account, user, orgUnit and device if not available
     * @param loginDTO
     */
    async registerUserDevice(loginDTO: UserDeviceLoginDTO): Promise<UserDeviceDto> {
        const domain = loginDTO.email.substring(loginDTO.email.lastIndexOf('@') + 1);
        const account = await this.accountService.findAdminAccount(domain);
        if (!account) {
            this.log.error(AccountErrors.domainNotFound(domain));
            throw new NotFoundException(AccountErrors.domainNotFound(domain));
        }

        let unit = null;
        let apiUser = null;

        try {
            const authToken = await this.authTokenService.findTokenByPrimaryDomain(domain);
            if (!authToken) {
                throw new QueryException(`No valid token found for domain ${domain}`);
            }
            apiUser = await this.googleApiService.getUser(loginDTO.email, authToken);
            if (!apiUser) {
                this.log.error(GoogleApisErrors.emailNotExists(loginDTO.email));
                throw new NotFoundException(GoogleApisErrors.emailNotExists(loginDTO.email));
            }
            if (apiUser.isAdmin) {
                this.log.error(AccountErrors.nonAdmin(), JSON.stringify(apiUser));
                throw new ForbiddenException(AccountErrors.nonAdmin());
            }
            unit = await this.orgUnitService.findOneByOrgUnitPath(apiUser.orgUnitPath, account.id);
        } catch (e) {
            this.log.warn(UserErrors.notFound(loginDTO.email));
            this.log.error(e);
        }
        const orgUnitId = unit && unit.id ? unit.id : (await this.orgUnitService.findOneByOrgUnitPath('/', account.id)).id;

        let user = await this.userService.findOneByEmail(loginDTO.email);
        if (!user) {
            try {
                if (apiUser) {
                    user = await this.userService.registerChromeUser(account.id, apiUser, orgUnitId);
                } else {
                    const userDTO : UserCreationAttributes = {
                        id: uuidv4(), email: loginDTO.email, firstName: loginDTO.email, accountId: account.id, orgUnitId: orgUnitId,
                        password: "", // FIXME: what should the password be?
                        accessCode: null,
                        accessLimited: false,
                    };
                    user = await this.userService.create(userDTO);
                }
            } catch (e) {
                this.log.error(UserErrors.couldNotCreate(loginDTO.email, e));
                throw new BadRequestException(UserErrors.couldNotCreate(loginDTO.email, e));
            }
        }

        const deviceDTO: ChromeDeviceDTO = {
            deviceType: loginDTO.deviceType,
            directoryApiId: loginDTO.directoryApiId,
            os: loginDTO.os,
            osBuild: loginDTO.osBuild,
            osDeviceName: loginDTO.osDeviceName,
            ethernetMac: loginDTO.ethernetMac,
        };

        const device = await this.deviceService.registerDevice(deviceDTO, account.id, orgUnitId);
        const userDevice: UserDeviceLink = await this.findOneByDeviceAndUser(device.id, user.id);
        if (!userDevice) {
            const userDeviceCreationObject : UserDeviceLinkCreationAttributes = { userId: user.id, deviceId: device.id, loginTime: new Date(), status: Statuses.ACTIVE };
            const savedUserDevice = await this.create(userDeviceCreationObject);
            return {
                deviceLinkId: savedUserDevice.id,
                userId: savedUserDevice.userId,
                deviceId: savedUserDevice.deviceId,
                accountId: account.id,
                email: user.email,
            };
        }
        return {
            deviceLinkId: userDevice.id,
            email: user.email,
            userId: userDevice.userId,
            deviceId: userDevice.deviceId,
            accountId: account.id,
            googleUserId: user.googleUserId,
        };
    }

    private async findOneByDeviceAndUser(deviceId: string, userId: string) {
        return this.repository.findOne({ where: { deviceId, userId } });
    }

    async registerKid(loginDTO: UserDeviceLoginDTO) {
        try {
            const user = await this.userService.findUserByAccessCode(loginDTO.accessCode);
            if (!user) {
                this.log.error(UserErrors.codeNotFound(loginDTO.accessCode));
                throw new NotFoundException(UserErrors.codeNotFound(loginDTO.accessCode));
            }
            const deviceDTO: ChromeDeviceDTO = {
                deviceType: loginDTO.deviceType,
                os: loginDTO.os,
                osBuild: loginDTO.osBuild,
                osDeviceName: loginDTO.osDeviceName,
                directoryApiId: loginDTO.directoryApiId,
                ethernetMac: loginDTO.ethernetMac,
            };
            const device = await this.deviceService.registerDevice(deviceDTO, user.account.id, user.orgUnitId);
            const userDevice: UserDeviceLink = await this.findOneByDeviceAndUser(device.id, user.id);
            let userDeviceRes;
            if (!userDevice) {
                const userDeviceCreationObject : UserDeviceLinkCreationAttributes = { userId: user.id, deviceId: device.id, loginTime: new Date(), status: Statuses.ACTIVE };
                const savedUserDevice = await this.create(userDeviceCreationObject);
                userDeviceRes = {
                    deviceLinkId: savedUserDevice.id,
                    userId: savedUserDevice.userId,
                    deviceId: savedUserDevice.deviceId,
                    accountId: user.account.id,
                    email: user.email,
                };
            } else {
                userDeviceRes = {
                    deviceLinkId: userDevice.id,
                    email: user.email,
                    userId: userDevice.userId,
                    deviceId: userDevice.deviceId,
                    accountId: user.account.id,
                };
            }
            await this.userService.findOneAndUpdate(user.email, { statusId: Statuses.ACTIVE });
            userDeviceRes.orgUnitId = user.orgUnitId;
            return userDeviceRes;
        } catch (e) {
            this.log.error(UserDeviceLinkErrors.registerKid(e));
            throw new QueryException(UserDeviceLinkErrors.registerKid());
        }
    }
}
