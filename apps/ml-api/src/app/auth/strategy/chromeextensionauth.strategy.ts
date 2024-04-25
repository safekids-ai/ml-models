import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfig from '../../config/jwt';
import { UserService } from '../../user/user.service';
import { UserDeviceLinkService } from '../../user-device-link/user-device-link.service';
import { ChromeExtensionToken } from '../dto/ChromeExtensionToken';

@Injectable()
export class ChromeExtensionStrategy extends PassportStrategy(Strategy, 'chrome-extension-auth') {
    constructor(protected readonly userService: UserService, protected readonly userDeviceLinkService: UserDeviceLinkService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig().jwtConfig.secretKey,
            ignoreExpiration: true,
        });
    }

    async validate(payload: ChromeExtensionToken): Promise<any> {
        const userDeviceLink = await this.userDeviceLinkService.findOne(payload.deviceLinkId);
        const user = await this.userService.findOneById(payload.userId);
        if (!user || !userDeviceLink || user.accountId != payload.accountId) {
            throw new UnauthorizedException('You are not authorized to perform the operation');
        }
        payload.orgUnitId = user.orgUnitId;
        return payload;
    }
}
