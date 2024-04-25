import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtTokenModule } from '../../auth/jwtToken/jwt.token.module';
import { AuthService } from './auth.service';
import { OrgUnitModule } from '../../org-unit/org-unit.module';
import { AccountsModule } from '../../accounts/accounts.module';
import { ConsumerUserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from '../../core/database/database.providers';
import { UserCodeModule } from '../user-code/user-code.module';
import { usersProviders } from '../../user/users.providers';
import { accountProviders } from '../../accounts/account.providers';
import { orgUnitProviders } from '../../org-unit/org-unit.providers';
import { userCodeProviders } from '../user-code/user_code.providers';
import { FilteredCategoryModule } from '../../filtered-category/filtered-category.module';
import { filteredUrlProviders } from '../../filtered-url/filteredurl.providers';
import { filteredCategoryProviders } from '../../filtered-category/filteredcategory.providers';
import { PlanModule } from '../../billing/plan/plan.module';
import { CustomerModule } from '../../billing/customer/customer-module';
import { SubscriptionModule } from '../../billing/subscription/subscription-module';
import { subscriptionProviders } from '../../billing/subscription/subscription.providers';

@Module({
    imports: [
        CustomerModule,
        JwtTokenModule,
        AccountsModule,
        OrgUnitModule,
        ConsumerUserModule,
        PlanModule,
        UserCodeModule,
        ConfigModule,
        FilteredCategoryModule,
        SubscriptionModule,
    ],
    providers: [
        ...databaseProviders,
        AuthService,
        ...usersProviders,
        ...accountProviders,
        ...orgUnitProviders,
        ...userCodeProviders,
        ...filteredUrlProviders,
        ...filteredCategoryProviders,
        ...subscriptionProviders,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class ConsumerAuthModule {}
