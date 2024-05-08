import { UserCode } from './entities/user-code.entity';
import { USER_CODE_REPOSITORY } from '../../constants';

export const userCodeProviders = [
    {
        provide: USER_CODE_REPOSITORY,
        useValue: UserCode,
    },
];
