import { WEBTIME_REPOSITORY } from '../constants';
import { WebTime } from './entities/web-time.entity';

export const webTimeProviders = [
    {
        provide: WEBTIME_REPOSITORY,
        useValue: WebTime,
    },
];
