import { Inject, Injectable } from '@nestjs/common';
import { EMAILEVENT_TYPE_REPOSITORY } from '../constants';
import { EmailEventType } from './entities/email-event-type.entity';
import { CreateEmailEventTypeDto } from './dto/create-email-event-type.dto';
import { QueryException } from '../error/common.exception';
import { EmailEventTypes } from '../email-event/email-event-types';

@Injectable()
export class EmailEventTypeService {
    constructor(@Inject(EMAILEVENT_TYPE_REPOSITORY) private readonly repository: typeof EmailEventType) {}
    create(createEmailEventTypeDto: CreateEmailEventTypeDto) {
        return this.repository.create(createEmailEventTypeDto);
    }
    async seedDefaultData(): Promise<void> {
        try {
            for (const type in EmailEventTypes) {
                const emailEventType = EmailEventTypes[type];
                await this.repository.upsert({ id: emailEventType, type: emailEventType });
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
