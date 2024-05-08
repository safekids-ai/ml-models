import { Module } from '@nestjs/common';
import { ActivityTypeService } from './activity-type.service';
import { activityTypeProviders } from './activity-type.providers';

@Module({
    providers: [ActivityTypeService, ...activityTypeProviders],
    exports: [ActivityTypeService],
})
export class ActivityTypeModule {}
