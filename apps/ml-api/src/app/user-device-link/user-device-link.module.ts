import { Module } from '@nestjs/common';
import { userDeviceLinkProviders } from './user-device-link.providers';
import { UserDeviceLinkService } from './user-device-link.service';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';
import { OrgUnitModule } from '../org-unit/org-unit.module';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { GoogleApisModule } from '../google-apis/google-apis.module';

@Module({
    imports: [AccountsModule, UserModule, DeviceModule, OrgUnitModule, AuthTokenModule, GoogleApisModule],
    providers: [UserDeviceLinkService, ...userDeviceLinkProviders],
    exports: [UserDeviceLinkService],
})
export class UserDeviceLinkModule {}
