import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AccountLicenseService } from '../../account-license/account-license.service';
import { LoggingService } from '../../logger/logging.service';
import { AccountLicenseErrors } from '../../account-license/account-license.errors';

@Injectable()
export class DesktopAuthStrategy extends PassportStrategy(Strategy, 'desktop-auth') {
    constructor(private readonly accountLicenseService: AccountLicenseService, private readonly log: LoggingService) {
        super({
            usernameField: 'email',
            passwordField: 'key',
            passReqToCallback: true,
        });
    }

    async validate(req, email: string, key: string): Promise<any> {
        try {
            const verified = await this.accountLicenseService.verifyLicense(req.body.email, req.body.key);
            if (!verified) {
                this.log.error(AccountLicenseErrors.invalid());
                throw new UnauthorizedException(AccountLicenseErrors.invalid());
            }
        } catch (e) {
            this.log.error(e);
            throw new UnauthorizedException(AccountLicenseErrors.invalid());
        }
        return email;
    }
}
