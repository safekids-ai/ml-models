import { Inject, Injectable } from '@nestjs/common';
import { ACTIVITY_AI_DATA_REPOSITORY } from '../constants';
import { ActivityAiDatum, ActivityAiDataCreationAttributes } from './entities/activity-ai-datum.entity';

@Injectable()
export class ActivityAiDataService {
    constructor(@Inject(ACTIVITY_AI_DATA_REPOSITORY) private readonly repository: typeof ActivityAiDatum) {}
    async create(createActivityAiDatumDto: ActivityAiDataCreationAttributes) {
        return await this.repository.create(createActivityAiDatumDto);
    }

    async findAllByDate(date: Date) {
        return await this.repository.findAll({ where: { activityTime: date } });
    }
}
