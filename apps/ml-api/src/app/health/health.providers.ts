import { HEALTH_REPOSITORY } from '../constants';
import { Health } from './health.entity';

export const healthProviders = [
    {
        provide: HEALTH_REPOSITORY,
        useValue: Health,
    },
];
