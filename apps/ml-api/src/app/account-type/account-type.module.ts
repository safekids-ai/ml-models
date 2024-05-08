import { Module } from '@nestjs/common';
import { AccountTypeService } from './account-type.service';
import { accountTypeProviders } from './account-type.providers';

@Module({
    providers: [AccountTypeService, ...accountTypeProviders],
    exports: [AccountTypeService],
})
export class AccountTypeModule {}
