import { USER_AUTHTOKEN_REPOSITORY } from '../constants';
import { AuthToken } from './entities/auth-token.entity';

export const usersAuthTokenProviders = [
    {
        provide: USER_AUTHTOKEN_REPOSITORY,
        useValue: AuthToken,
    },
];
