import { Payment } from '../payment/entities/payment.entity';
import { PAYMENT_REPOSITORY } from './../../constants';
import { LoggingService } from './../../logger/logging.service';
import { Inject, Injectable } from '@nestjs/common';
import { AccountService } from '../../accounts/account.service';
import { BillingService } from '../billing.service';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { CustomerService } from '../customer/customer.service';
import { InitPaymentResponseDto } from './dto/Init-payment-response.dto';

@Injectable()
export class PaymentService {
    constructor(
        private readonly log: LoggingService,
        private readonly billingService: BillingService,
        private readonly accountService: AccountService,
        private readonly customerService: CustomerService,
        @Inject(PAYMENT_REPOSITORY) private readonly repository: typeof Payment
    ) {}

    async createPaymentIntent(accountId: string): Promise<InitPaymentResponseDto> {
        const account = await this.accountService.findOne(accountId);
        const setupIntent = await this.billingService.createPaymentIntent(accountId, account.stripeCustomerId);
        return { clientSecret: setupIntent.client_secret };
    }

    async savePaymentMethod(accountId: string, paymentMethodId: string): Promise<PaymentResponseDto> {
        const account = await this.accountService.findOne(accountId);
        await this.customerService.updateCustomer(account.stripeCustomerId, paymentMethodId);
        const paymentMethod = await this.billingService.getPaymentMethod(paymentMethodId);
        const paymentDetails = {
            accountId,
            paymentMethodId,
            lastDigits: paymentMethod.card.last4,
            expiryMonth: paymentMethod.card.exp_month,
            expiryYear: paymentMethod.card.exp_year,
        };
        await this.repository.create(paymentDetails);
        return paymentDetails;
    }

    async findOne(accountId: string): Promise<PaymentResponseDto> {
        return await this.repository.findOne({
            where: { accountId },
            order: [['createdAt', 'DESC']],
        });
    }

    async deleteAll(accountId: string): Promise<void> {
        await this.repository.destroy({ where: { accountId }, force: true });
    }
}
