import { Payment } from './entities/payment.entity';
import { PAYMENT_REPOSITORY } from '../../constants';

export const paymentProviders = [
    {
        provide: PAYMENT_REPOSITORY,
        useValue: Payment,
    },
];
