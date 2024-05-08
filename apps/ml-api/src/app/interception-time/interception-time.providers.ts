import { INTERCEPTIONTIME_REPOSITORY } from '../constants';
import { InterceptionTime } from './entities/interception-time.entity';

export const interceptionTimeProviders = [
    {
        provide: INTERCEPTIONTIME_REPOSITORY,
        useValue: InterceptionTime,
    },
];
