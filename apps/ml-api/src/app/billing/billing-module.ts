import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { stripeProviders } from './stripe.providers';
import { StripeService } from './stripe.service';

@Module({
    imports: [],
    providers: [BillingService, ...stripeProviders, StripeService],
    exports: [BillingService],
})
export class BillingModule {}
