import { ACTIVITYTYPE_REPOSITORY } from '../constants';
import { ActivityType } from './entities/activity-type.entity';

export const activityTypeProviders = [
    {
        provide: ACTIVITYTYPE_REPOSITORY,
        useValue: ActivityType,
    },
];
