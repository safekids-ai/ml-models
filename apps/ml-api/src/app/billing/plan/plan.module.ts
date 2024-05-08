import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { planProviders } from './plan.providers';
import { subscriptionProviders } from '../subscription/subscription.providers';
import { paymentProviders } from '../payment/payment.providers';
import { BillingModule } from '../billing-module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
    imports: [BillingModule, InvoiceModule],
    controllers: [PlanController],
    providers: [PlanService, ...planProviders, ...subscriptionProviders, ...paymentProviders],
    exports: [PlanService],
})
export class PlanModule {}
