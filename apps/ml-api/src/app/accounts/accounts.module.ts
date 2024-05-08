import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { accountProviders } from './account.providers';
import { StatusModule } from '../status/status.module';
import { AccountTypeModule } from '../account-type/account-type.module';

@Module({
    controllers: [AccountController],
    providers: [AccountService, ...accountProviders],
    exports: [AccountService],
    imports: [StatusModule, AccountTypeModule],
})
export class AccountsModule {}
