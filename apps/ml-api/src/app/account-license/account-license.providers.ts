import { ACCOUNT_LICENSE_REPOSITORY } from '../constants';
import { AccountLicense } from './entities/account-license.entity';

export const accountLicenseProviders = [
    {
        provide: ACCOUNT_LICENSE_REPOSITORY,
        useValue: AccountLicense,
    },
];
