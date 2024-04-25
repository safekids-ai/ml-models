import { Inject, Injectable } from '@nestjs/common';
import { NONSCHOOLDAYSCONFIG_REPOSITORY } from '../constants';
import { NonSchoolDaysConfig, NonSchoolDaysConfigCreationAttributes } from './entities/non-school-days-config.entity';

@Injectable()
export class NonSchoolDaysConfigService {
    constructor(@Inject(NONSCHOOLDAYSCONFIG_REPOSITORY) private readonly repository: typeof NonSchoolDaysConfig) {}
    create(createNonSchoolDaysConfigDto: NonSchoolDaysConfigCreationAttributes) {
        return this.repository.create(createNonSchoolDaysConfigDto);
    }

    bulkCreate(createNonSchoolDaysConfigDtos: NonSchoolDaysConfigCreationAttributes[]) {
        return this.repository.bulkCreate(createNonSchoolDaysConfigDtos);
    }

    findByAccountId(accountId: string) {
        return this.repository.findOne({ where: { accountId } });
    }

    update(accountId: string, updateNonSchoolDaysConfigDto: Partial<NonSchoolDaysConfigCreationAttributes>) {
        return this.repository.update(updateNonSchoolDaysConfigDto, { where: { accountId } });
    }

    remove(accountId: string) {
        return this.repository.destroy({ where: { accountId } });
    }

    upsert(updateNonSchoolDaysConfigDto: NonSchoolDaysConfigCreationAttributes) {
        return this.repository.upsert(updateNonSchoolDaysConfigDto);
    }
}
