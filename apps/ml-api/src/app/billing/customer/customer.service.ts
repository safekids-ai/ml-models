import { Injectable } from '@nestjs/common';
import { BillingService } from '../billing.service';

@Injectable()
export class CustomerService {
    constructor(private readonly billingService: BillingService) {}
    async createCustomer(accountId: string, email: string, name: string): Promise<string> {
        return await this.billingService.createCustomer(accountId, email, name);
    }

    async updateCustomer(customerId: string, paymentMethodId: string): Promise<void> {
        await this.billingService.updateCustomer(customerId, paymentMethodId);
    }
}
