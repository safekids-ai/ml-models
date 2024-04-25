import { ACTIVITY_AI_DATA_REPOSITORY } from '../constants';
import { ActivityAiDatum } from './entities/activity-ai-datum.entity';

export const activityAiDataProviders = [
    {
        provide: ACTIVITY_AI_DATA_REPOSITORY,
        useValue: ActivityAiDatum,
    },
];
