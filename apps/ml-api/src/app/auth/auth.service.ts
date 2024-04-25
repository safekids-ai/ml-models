import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserDeviceLinkService } from '../user-device-link/user-device-link.service';
import { LoggingService } from '../logger/logging.service';
import { JwtTokenService } from './jwtToken/jwt.token.service';
import { AuthDto, UserDeviceLoginDTO } from './auth.dto';
import axios from 'axios';
import { DeviceTypes } from '../device-type/device-type.enum';
import { AuthErrors } from './auth.errors';

@Injectable()
export class AuthService {
    constructor(
        private readonly userDeviceService: UserDeviceLinkService,
        private readonly log: LoggingService,
        private readonly jwtTokenService: JwtTokenService
    ) {}

    async loginUser(userDeviceDTO: UserDeviceLoginDTO, deviceType: DeviceTypes): Promise<AuthDto> {
        if (!userDeviceDTO || !userDeviceDTO.email) {
            throw new UnauthorizedException(AuthErrors.unAuthorized('Invalid Email Id.'));
        }
        userDeviceDTO.deviceType = deviceType;
        const userDevice = await this.userDeviceService.registerUserDevice(userDeviceDTO);
        const token = await this.jwtTokenService.generateChromeExtensionToken(userDevice);
        return { link: userDevice.deviceLinkId, jwt_token: token.jwt_token };
    }

    async validateToken(email, token: string): Promise<boolean> {
        try {
            if (!token) return false;
            const userInfo = await axios.get<any>(`https://www.googleapis.com/oauth2/v3/userinfo`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return userInfo.data.email === email;
        } catch (error) {
            this.log.error(error);
            return false;
        }
    }

    async loginKidOnChrome(userDeviceDTO: UserDeviceLoginDTO, deviceType: DeviceTypes) {
        userDeviceDTO.deviceType = deviceType;
        const userDevice = await this.userDeviceService.registerKid(userDeviceDTO);
        const token = await this.jwtTokenService.generateChromeExtensionToken(userDevice);
        return { link: userDevice.deviceLinkId, jwt_token: token.jwt_token };
    }
}
