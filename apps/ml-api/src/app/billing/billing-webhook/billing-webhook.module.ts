import { Module } from '@nestjs/common';
import { BillingWebhookService } from './billing-webhook.service';
import { BillingWebhookController } from './billing-webhook.controller';
import { SubscriptionModule } from '../subscription/subscription-module';
import { LoggingModule } from '../../logger/logging.module';
import { BillingModule } from '../billing-module';
import { PromoCodeModule } from '../promo-code/promo-code.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { OrgUnitModule } from '../../org-unit/org-unit.module';
import { databaseProviders } from '../../core/database/database.providers';

@Module({
    imports: [SubscriptionModule, PromoCodeModule, LoggingModule, BillingModule, InvoiceModule, OrgUnitModule],
    controllers: [BillingWebhookController],
    providers: [BillingWebhookService, ...databaseProviders],
})
export class BillingWebhookModule {}
