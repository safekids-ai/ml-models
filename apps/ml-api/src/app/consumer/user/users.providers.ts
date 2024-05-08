import { USER_REPOSITORY } from '../../constants';
import { User } from '../../user/entities/user.entity';

export const userProviders = [
    {
        provide: USER_REPOSITORY,
        useValue: User,
    },
];
