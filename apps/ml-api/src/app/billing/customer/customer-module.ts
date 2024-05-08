import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { BillingModule } from '../billing-module';

@Module({
    imports: [BillingModule],
    providers: [CustomerService],
    exports: [CustomerService],
})
export class CustomerModule {}
