import { PRRLEVEL_REPOSITORY } from '../constants';
import { PrrLevel } from './entities/prr-level.entity';

export const prrLevelProviders = [
    {
        provide: PRRLEVEL_REPOSITORY,
        useValue: PrrLevel,
    },
];
