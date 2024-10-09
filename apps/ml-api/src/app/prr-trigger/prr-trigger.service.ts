import { Inject, Injectable } from '@nestjs/common';
import { CreatePrrTriggerDto } from './dto/create-prr-trigger.dto';
import { UpdatePrrTriggerDto } from './dto/update-prr-trigger.dto';
import { PRRTRIGGER_REPOSITORY } from '../constants';
import { QueryException } from '../error/common.exception';
import { defaultPrrTriggers } from './prr-triggers.default';
import { PrrTrigger } from './entities/prr-trigger.entity';

@Injectable()
export class PrrTriggerService {
    constructor(@Inject(PRRTRIGGER_REPOSITORY) private readonly repository: typeof PrrTrigger) {}
    create(createPrrTriggerDto: CreatePrrTriggerDto) {
        return this.repository.create(createPrrTriggerDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    update(id: string, updatePrrTriggerDto: UpdatePrrTriggerDto) {
        return this.repository.update(updatePrrTriggerDto, { where: { id } });
    }

    upsert(updatePrrTriggerDto: UpdatePrrTriggerDto) {
        return this.repository.upsert(updatePrrTriggerDto);
    }

    remove(id: string) {
        return this.repository.destroy({ where: { id } });
    }

    async seedDefaultData() {
        try {
            for (const prrTrigger of defaultPrrTriggers) {
                await this.repository.upsert(prrTrigger);
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
