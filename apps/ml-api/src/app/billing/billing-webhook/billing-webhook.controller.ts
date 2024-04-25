import { BadRequestException, Body, Controller, Post, Request, Response } from '@nestjs/common';
import { BillingWebhookService } from './billing-webhook.service';
import { LoggingService } from '../../logger/logging.service';
import { PaymentService } from '../payment/payment.service';
import { BillingService } from '../billing.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('StripeWebhook')
@Controller('v2/billing/stripe/webhook')
export class BillingWebhookController {
    constructor(
        private readonly log: LoggingService,
        private readonly paymentWebhookService: BillingWebhookService,
        private readonly billingService: BillingService
    ) {
        this.log.className(PaymentService.name);
    }

    @ApiOperation({ summary: 'Handles Stripe events.' })
    @Post()
    async webhooks(@Request() req, @Response() res): Promise<void> {
        const sig = req.headers['stripe-signature'];
        let event;

        const payloadString = JSON.stringify(req.body, null, 2);

        try {
            event = this.billingService.constructEvent(payloadString, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.log(err);
            console.log(`⚠️Webhook signature verification failed.`);
            console.log(`⚠️  Check the env file and enter the correct webhook secret.`);
            return res.sendStatus(400);
        }

        this.log.debug('Handling Webhook', event.type);

        this.paymentWebhookService.handleWebhookEvent(event);

        res.sendStatus(200);
    }
}
