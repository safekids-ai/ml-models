import { ACCOUNT_REPOSITORY } from '../constants';
import { Account } from './entities/account.entity';

export const accountProviders = [
    {
        provide: ACCOUNT_REPOSITORY,
        useValue: Account,
    },
];
