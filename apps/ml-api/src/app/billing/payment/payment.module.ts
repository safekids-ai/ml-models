import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AccountsModule } from '../../accounts/accounts.module';
import { CustomerModule } from '../customer/customer-module';
import { paymentProviders } from './payment.providers';
import { BillingModule } from '../billing-module';

@Module({
    imports: [AccountsModule, CustomerModule, BillingModule],
    providers: [PaymentService, ...paymentProviders],
    controllers: [PaymentController],
    exports: [PaymentService],
})
export class PaymentModule {}
