import { Inject, Injectable } from '@nestjs/common';
import { PrrAction, PrrActionCreationAttributes } from './entities/prr-action.entity';
import { PRRACTION_REPOSITORY } from '../constants';
import { QueryException } from '../error/common.exception';
import { defaultPrrAction } from './prr-action.default';

@Injectable()
export class PrrActionService {
    constructor(@Inject(PRRACTION_REPOSITORY) private readonly repository: typeof PrrAction) {}

    create(createPrrLevelDto: PrrActionCreationAttributes) {
        return this.repository.create(createPrrLevelDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    update(id: string, updatePrrLevelDto: Partial<PrrActionCreationAttributes>) {
        return this.repository.update(updatePrrLevelDto, { where: { id } });
    }

    upsert(createPrrLevelDto: PrrActionCreationAttributes) {
        return this.repository.upsert(createPrrLevelDto);
    }

    remove(id: string) {
        return this.repository.destroy({ where: { id } });
    }

    async seedDefaultData() {
        try {
            for (const prrAction of defaultPrrAction) {
                await this.repository.upsert(prrAction);
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
