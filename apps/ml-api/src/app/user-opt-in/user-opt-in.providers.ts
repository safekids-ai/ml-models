import { USER_OPTIN_REPOSITORY } from '../constants';
import { UserOptIn } from './entities/user-opt-in.entity';

export const userOptInProviders = [
    {
        provide: USER_OPTIN_REPOSITORY,
        useValue: UserOptIn,
    },
];
