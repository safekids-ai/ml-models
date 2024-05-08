import { Inject, Injectable } from '@nestjs/common';
import { PrrLevel, PrrLevelCreationAttributes } from './entities/prr-level.entity';
import { PRRLEVEL_REPOSITORY } from '../constants';
import { QueryException } from '../error/common.exception';
import { defaultPrrLevels } from './prr-level.default';

@Injectable()
export class PrrLevelService {
    constructor(@Inject(PRRLEVEL_REPOSITORY) private readonly repository: typeof PrrLevel) {}

    create(createPrrLevelDto: PrrLevelCreationAttributes) {
        return this.repository.create(createPrrLevelDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    update(id: string, updatePrrLevelDto: Partial<PrrLevelCreationAttributes>) {
        return this.repository.update(updatePrrLevelDto, { where: { id } });
    }

    upsert(createPrrLevelDto: PrrLevelCreationAttributes) {
        return this.repository.upsert(createPrrLevelDto);
    }

    remove(id: string) {
        return this.repository.destroy({ where: { id } });
    }

    async seedDefaultData() {
        try {
            for (const prrLevel of defaultPrrLevels) {
                await this.repository.upsert(prrLevel);
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
