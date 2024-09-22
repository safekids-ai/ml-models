import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {UserDeviceLinkModule} from '../user-device-link/user-device-link.module';
import {JwtTokenModule} from './jwtToken/jwt.token.module';
import {AuthService} from './auth.service';
import {PassportModule} from '@nestjs/passport';
import {GoogleStrategy} from './strategy/google.strategy';
import {UserModule} from '../user/user.module';
import {ApikeyStrategy} from './strategy/apikey.strategy';
import {ChromeExtensionStrategy} from './strategy/chromeextensionauth.strategy';
import {DesktopAuthStrategy} from './strategy/desktop.auth.strategy';
import {IsAdminStrategy} from './strategy/is-admin.strategy';
import {IsAdminOrDistrictUserStrategy} from './strategy/is-admin-or-district-user.strategy';
import {InternalApiKeyModule} from '../internal-api-key/internal-api-key.module';
import {AccountLicenseModule} from '../account-license/account-license.module';
import {ChromeExtensionOpenStrategy} from "apps/ml-api/src/app/auth/strategy/chromeextensionauth_open.strategy";

@Module({
  imports: [UserDeviceLinkModule, InternalApiKeyModule, AccountLicenseModule, UserModule, JwtTokenModule],
  providers: [AuthService, ApikeyStrategy, ChromeExtensionStrategy, ChromeExtensionOpenStrategy, DesktopAuthStrategy, GoogleStrategy, IsAdminStrategy, IsAdminOrDistrictUserStrategy],
  controllers: [AuthController],
})
export class AuthModule {
}
