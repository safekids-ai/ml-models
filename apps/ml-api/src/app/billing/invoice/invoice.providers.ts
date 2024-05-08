import { Invoice } from './entities/invoice.entity';
import { INVOICE_REPOSITORY } from '../../constants';

export const invoiceProviders = [
    {
        provide: INVOICE_REPOSITORY,
        useValue: Invoice,
    },
];
