import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { invoiceProviders } from './invoice.providers';
import { BillingModule } from '../billing-module';
import { AccountsModule } from '../../accounts/accounts.module';

@Module({
    imports: [BillingModule, AccountsModule],
    providers: [InvoiceService, ...invoiceProviders],
    exports: [InvoiceService],
})
export class InvoiceModule {}
