import { Inject, Injectable } from '@nestjs/common';
import { ACTIVITYTYPE_REPOSITORY } from '../constants';
import { ActivityType } from './entities/activity-type.entity';
import { CreateActivityTypeDto } from './dto/create-activity-type.dto';
import { UpdateActivityTypeDto } from './dto/update-activity-type.dto';
import { QueryException } from '../error/common.exception';
import { defaultActivityTypes } from './default-activitytypes';

@Injectable()
export class ActivityTypeService {
    constructor(@Inject(ACTIVITYTYPE_REPOSITORY) private readonly repository: typeof ActivityType) {}
    create(createActivityTypeDto: CreateActivityTypeDto) {
        return this.repository.create(createActivityTypeDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    update(id: string, updateActivityTypeDto: UpdateActivityTypeDto) {
        return this.repository.update(updateActivityTypeDto, { where: { id } });
    }

    upsert(dto: CreateActivityTypeDto) {
        return this.repository.upsert(dto);
    }

    remove(id: string) {
        return this.repository.destroy({ where: { id } });
    }

    async seedDefaultData() {
        try {
            for (const activityType of defaultActivityTypes) {
                await this.repository.upsert(activityType);
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
