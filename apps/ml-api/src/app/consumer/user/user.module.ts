import { FilteredProcessModule } from './../../filtered-process/filtered-process.module';
import { Module } from '@nestjs/common';
import { ConsumerUserService } from './consumer-user.service';
import { ConsumerUserController } from './consumerUserController';
import { userProviders } from './users.providers';
import { OrgUnitModule } from '../../org-unit/org-unit.module';
import { ParentConsentModule } from '../parent-consent/parent-consent.module';
import { ActivityModule } from '../../activity/activity.module';
import { DeviceModule } from '../../device/device.module';
import { UserDeviceLinkModule } from '../../user-device-link/user-device-link.module';
import { FilteredUrlModule } from '../../filtered-url/filtered-url.module';
import { FilteredCategoryModule } from '../../filtered-category/filtered-category.module';
import { databaseProviders } from '../../core/database/database.providers';
import { LoggingModule } from '../../logger/logging.module';
import { KidConfigModule } from '../../kid-config/kid-config.module';
import { KidRequestModule } from '../../kid-request/kid-request.module';
import { accountProviders } from '../../accounts/account.providers';
import { SubscriptionModule } from '../../billing/subscription/subscription-module';
import { PaymentModule } from '../../billing/payment/payment.module';
import { SubscriptionFeedbackModule } from '../../billing/subscription-feedback/subscription-feedback.module';
import { InvoiceModule } from '../../billing/invoice/invoice.module';
import { PromoCodeModule } from '../../billing/promo-code/promo-code.module';
import { planProviders } from '../../billing/plan/plan.providers';

@Module({
    imports: [
        ParentConsentModule,
        OrgUnitModule,
        ActivityModule,
        DeviceModule,
        UserDeviceLinkModule,
        FilteredUrlModule,
        FilteredCategoryModule,
        LoggingModule,
        KidConfigModule,
        KidRequestModule,
        SubscriptionModule,
        PaymentModule,
        SubscriptionFeedbackModule,
        InvoiceModule,
        PromoCodeModule,
        FilteredProcessModule,
    ],
    providers: [...userProviders, ConsumerUserService, ...databaseProviders, ...accountProviders, ...planProviders],
    controllers: [ConsumerUserController],
    exports: [ConsumerUserService],
})
export class ConsumerUserModule {}
