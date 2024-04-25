import { Module } from '@nestjs/common';
import { AccountLicenseService } from './account-license.service';
import { accountLicenseProviders } from './account-license.providers';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
    imports: [AccountsModule],
    providers: [AccountLicenseService, ...accountLicenseProviders],
    exports: [AccountLicenseService],
})
export class AccountLicenseModule {}
