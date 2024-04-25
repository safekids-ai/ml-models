import { Module } from '@nestjs/common';
import { ActivityAiDataService } from './activity-ai-data.service';
import { ActivityAiDataController } from './activity-ai-data.controller';
import { activityAiDataProviders } from './activity-ai-data.providers';

@Module({
    controllers: [ActivityAiDataController],
    providers: [ActivityAiDataService, ...activityAiDataProviders],
    exports: [ActivityAiDataService],
})
export class ActivityAiDataModule {}
