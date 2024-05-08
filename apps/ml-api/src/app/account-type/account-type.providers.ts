import { ACCOUNT_TYPE_REPOSITORY } from '../constants';
import { AccountType } from './entities/account-type.entity';

export const accountTypeProviders = [
    {
        provide: ACCOUNT_TYPE_REPOSITORY,
        useValue: AccountType,
    },
];
