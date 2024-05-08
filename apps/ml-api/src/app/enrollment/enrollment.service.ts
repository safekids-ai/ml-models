import { Inject, Injectable } from '@nestjs/common';
import { ENROLLMENT_REPOSITORY, SEQUELIZE } from '../constants';
import { Enrollment, EnrollmentCreationAttributes } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { QueryException } from '../error/common.exception';
import { LoggingService } from '../logger/logging.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class EnrollmentService {
    private readonly sequelize: Sequelize;
    constructor(
        @Inject(ENROLLMENT_REPOSITORY) private readonly repository: typeof Enrollment,
        private readonly log: LoggingService,
        @Inject(SEQUELIZE) sequelize: Sequelize
    ) {
        this.sequelize = sequelize;
    }
    create(createEnrollmentDto: EnrollmentCreationAttributes) {
        return this.repository.create(createEnrollmentDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: number) {
        return this.repository.findOne({ where: { id } });
    }

    update(id: number, updateEnrollmentDto: Partial<EnrollmentCreationAttributes>) {
        return this.repository.update(updateEnrollmentDto, { where: { id } });
    }

    remove(id: number) {
        return this.repository.destroy({ where: { id } });
    }

    bulkInsert(createEnrollmentDtos: EnrollmentCreationAttributes[]) {
        this.repository.bulkCreate(createEnrollmentDtos);
    }

    async findAllByAccountId(accountId: string): Promise<Enrollment[]> {
        return await this.repository.findAll<Enrollment>({ where: { accountId } });
    }

    async deleteAll(ids: string[]): Promise<void> {
        await this.repository.destroy({ where: { id: ids } });
    }

    async bulkUpsert(dtos: EnrollmentCreationAttributes[]): Promise<void> {
        try {
            const fieldsToUpdate : (keyof EnrollmentCreationAttributes)[] = ['userSourcedId', 'primary', 'beginDate', 'endDate', 'classId', 'role', 'schoolId', 'rosterStatus', 'dateLastModified'];
            await this.repository.bulkCreate(dtos, { updateOnDuplicate: fieldsToUpdate });
        } catch (e) {
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
    }
}
