import { Inject, Injectable } from '@nestjs/common';
import { CreateEmailEventConfigDto } from './dto/create-email-event-config.dto';
import { UpdateEmailEventConfigDto } from './dto/update-email-event-config.dto';
import { EMAILEVENTCONFIG_REPOSITORY } from '../constants';
import { EmailEventConfig } from './entities/email-event-config.entity';
import { EmailEventTypes } from '../email-event/email-event-types';
import { PrrUserAction } from '../prr-action/prr-action.default';

@Injectable()
export class EmailEventConfigService {
    constructor(
        @Inject(EMAILEVENTCONFIG_REPOSITORY)
        private readonly repository: typeof EmailEventConfig
    ) {}
    async create(createEmailEventConfigDto: CreateEmailEventConfigDto) {
        return await this.repository.create(createEmailEventConfigDto);
    }

    findOne(id: number) {
        return this.repository.findOne({ where: { id } });
    }

    findOneByAccountIdByEvent(accountId: string, event: EmailEventTypes, action: PrrUserAction) {
        return this.repository.findOne({ where: { accountId: accountId, eventTypeId: event, prrActionId: action } });
    }

    update(id: string, updateEmailEventConfigDto: UpdateEmailEventConfigDto) {
        return this.repository.update(updateEmailEventConfigDto, { where: { id } });
    }

    remove(id: number) {
        return this.repository.destroy({ where: { id } });
    }
}
