import { Module } from '@nestjs/common';
import { AccountsModule } from '../../accounts/accounts.module';
import { SubscriptionController } from './subscription.controller';
import { planProviders } from '../plan/plan.providers';
import { CustomerModule } from '../customer/customer-module';
import { subscriptionProviders } from './subscription.providers';
import { PlanModule } from '../plan/plan.module';
import { UserModule } from '../../user/user.module';
import { BillingModule } from '../billing-module';
import { SubscriptionService } from './subscription.service';
import { SubscriptionFeedbackModule } from '../subscription-feedback/subscription-feedback.module';
import { databaseProviders } from '../../core/database/database.providers';

@Module({
    imports: [AccountsModule, CustomerModule, PlanModule, UserModule, BillingModule, SubscriptionFeedbackModule],
    providers: [SubscriptionService, ...planProviders, ...subscriptionProviders, ...databaseProviders],
    controllers: [SubscriptionController],
    exports: [SubscriptionService],
})
export class SubscriptionModule {}
