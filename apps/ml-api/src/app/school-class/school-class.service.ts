import { Inject, Injectable } from '@nestjs/common';
import { SchoolClass, SchoolClassAttributes } from './entities/school-class.entity';
import { SCHOOLCLASS_REPOSITORY, SEQUELIZE } from '../constants';
import { CreateSchoolClassDto } from './dto/create-school-class.dto';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';
import { QueryException } from '../error/common.exception';
import { LoggingService } from '../logger/logging.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SchoolClassService {
    private readonly sequelize: Sequelize;
    constructor(
        @Inject(SCHOOLCLASS_REPOSITORY) private readonly repository: typeof SchoolClass,
        private readonly log: LoggingService,
        @Inject(SEQUELIZE) sequelize: Sequelize
    ) {
        this.sequelize = sequelize;
    }

    create(createSchoolClassDto: CreateSchoolClassDto) {
        return this.repository.create(createSchoolClassDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: number) {
        return this.repository.findOne({ where: { id } });
    }

    update(id: number, updateSchoolClassDto: UpdateSchoolClassDto) {
        return this.repository.update(updateSchoolClassDto, { where: { id } });
    }

    async findAllByAccountId(accountId: string): Promise<SchoolClass[]> {
        return await this.repository.findAll<SchoolClass>({ where: { accountId } });
    }

    async deleteAll(ids: string[]): Promise<void> {
        await this.repository.destroy({ where: { id: ids } });
    }

    async bulkUpsert(dtos: CreateSchoolClassDto[]) {
        try {
            const fieldsToUpdate : (keyof SchoolClassAttributes)[] = ['title', 'classType', 'location', 'grades', 'schoolId', 'rosterStatus', 'dateLastModified'];
            await this.repository.bulkCreate(dtos, { updateOnDuplicate: fieldsToUpdate });
        } catch (e) {
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
    }

    remove(id: number) {
        return this.repository.destroy({ where: { id } });
    }
}
