import { Role } from './entities/role.entity';
import { ROLE_REPOSITORY } from '../constants';

export const roleProviders = [
    {
        provide: ROLE_REPOSITORY,
        useValue: Role,
    },
];
