import { Inject, Injectable } from '@nestjs/common';
import { CreateRosterOrgDto } from './dto/create-roster-org.dto';
import { UpdateRosterOrgDto } from './dto/update-roster-org.dto';
import { ROSTER_ORG_REPOSITORY, SEQUELIZE } from '../constants';
import { LoggingService } from '../logger/logging.service';
import { RosterOrg, RosterOrgAttributes } from './entities/roster-org.entity';
import { QueryException } from '../error/common.exception';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RosterOrgService {
    private readonly sequelize: Sequelize;
    constructor(
        @Inject(ROSTER_ORG_REPOSITORY) private readonly repository: typeof RosterOrg,
        private readonly log: LoggingService,
        @Inject(SEQUELIZE) sequelize: Sequelize
    ) {
        this.sequelize = sequelize;
    }

    async create(createRosterOrgDto: CreateRosterOrgDto) {
        await this.repository.create(createRosterOrgDto);
    }

    async findAllByAccountId(accountId: string): Promise<RosterOrg[]> {
        return await this.repository.findAll<RosterOrg>({ where: { accountId } });
    }

    findOne(id: number) {
        return `This action returns a #${id} rosterOrg`;
    }

    update(id: number, updateRosterOrgDto: UpdateRosterOrgDto) {
        return `This action updates a #${id} rosterOrg`;
    }

    remove(id: number) {
        return `This action removes a #${id} rosterOrg`;
    }

    async deleteAll(ids: string[]): Promise<void> {
        await this.repository.destroy({ where: { id: ids } });
    }

    async bulkUpsert(dtos: CreateRosterOrgDto[]) {
        try {
            const fieldsToUpdate : (keyof RosterOrgAttributes)[] = ['name', 'identifier', 'type', 'dateLastModified', 'rosterStatus'];
            await this.repository.bulkCreate(dtos, { updateOnDuplicate: fieldsToUpdate });
        } catch (e) {
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
    }
}
