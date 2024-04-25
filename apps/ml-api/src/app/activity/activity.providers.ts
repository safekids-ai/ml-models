import { ACTIVITY_REPOSITORY } from '../constants';
import { Activity } from './entities/activity.entity';

export const activityProviders = [
    {
        provide: ACTIVITY_REPOSITORY,
        useValue: Activity,
    },
];
