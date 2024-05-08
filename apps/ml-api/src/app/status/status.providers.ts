import { STATUS_REPOSITORY } from '../constants';
import { Status } from './entities/status.entity';

export const statusProviders = [
    {
        provide: STATUS_REPOSITORY,
        useValue: Status,
    },
];
