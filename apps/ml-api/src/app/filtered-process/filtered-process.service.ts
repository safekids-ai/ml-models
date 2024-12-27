import { OrgUnitService } from './../org-unit/org-unit.service';
import { Inject, Injectable } from '@nestjs/common';
import { FilteredProcessCreationAttributes } from './entities/filtered-process.entity';
import { FILTERED_PROCESS_REPOSITORY, SEQUELIZE } from '../constants';
import { FilteredProcess } from './entities/filtered-process.entity';
import { QueryException } from '../error/common.exception';
import { FilteredProcessDto, ProcessDto } from './dto/filtered-process.dto';
import { Sequelize } from 'sequelize-typescript';
import { LoggingService } from '../logger/logging.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilteredProcessService {
    private readonly sequelize: Sequelize;

    constructor(
        @Inject(FILTERED_PROCESS_REPOSITORY) private readonly filteredProcessRepository: typeof FilteredProcess,
        @Inject(SEQUELIZE) sequelize: Sequelize,
        private readonly log: LoggingService,
        private readonly orgUnitService: OrgUnitService
    ) {
        this.sequelize = sequelize;
    }

    /** Fetch all organizational units processes
     * @param accountId
     * @returns organizational units processes
     */
    async findFilteredProcess(accountId: string): Promise<FilteredProcessDto[]> {
        const orgUnits = await this.orgUnitService.findKidsOrgUnits(accountId);
        return await Promise.all(
            orgUnits.map(async (orgUnit) => {
                const processes = await this.findAllByOrgUnitId(orgUnit.id, accountId);
                return {
                    id: orgUnit.id,
                    name: orgUnit.name,
                    processes: processes.map((filteredProcess) => {
                        return {
                            id: filteredProcess.id,
                            name: filteredProcess.name,
                            isAllowed: filteredProcess.isAllowed,
                        };
                    }),
                };
            })
        );
    }

    /** Create filtered process
     * @param accountId
     * @param orgUnitProcess
     * @returns void
     */
    async createFilteredProcess(accountId: string, orgUnitProcess: FilteredProcessDto): Promise<FilteredProcessDto> {
        const processes = orgUnitProcess.processes;
        const filteredProcesses = processes?.map((process) => {
            return { id: uuidv4(), name: process.name, orgUnitId: orgUnitProcess.id, accountId, isAllowed: process.isAllowed };
        });
        await this.createBulk(filteredProcesses);

        orgUnitProcess.processes = filteredProcesses.map((process: ProcessDto) => {
            return { id: process.id, name: process.name, isAllowed: process.isAllowed };
        });
        return orgUnitProcess;
    }

    findAllByOrgUnitId(orgUnitId: string, accountId: string): Promise<FilteredProcess[]> {
        return this.filteredProcessRepository.findAll({ where: { orgUnitId, accountId } });
    }

    /**
     * Save filtered process
     * @param dto
     * @returns void
     */
    async create(dto: FilteredProcessCreationAttributes): Promise<void> {
        await this.filteredProcessRepository.create(dto);
    }

    /**
     * Save filtered process in bulk
     * @param dto
     * @returns void
     */
    async createBulk(dto: FilteredProcessCreationAttributes[]): Promise<void> {
        try {
            await this.filteredProcessRepository.bulkCreate(dto);
        } catch (e) {
            this.log.error(QueryException.bulkCreate(e));
            throw new QueryException(QueryException.bulkCreate());
        }
    }

    async update(id: string, objToUpDate = {}): Promise<void> {
        await this.filteredProcessRepository.update(objToUpDate, { where: { id: id } });
    }

    /** Delete filtered proces by id
     * @param id
     * @returns void
     */
    async delete(id: string): Promise<void> {
        await this.filteredProcessRepository.destroy({ where: { id } });
    }

    async deleteAccount(accountId: string): Promise<void> {
        await this.filteredProcessRepository.destroy({ where: { accountId }, force: true });
    }

    async deleteAll(ids: string[]): Promise<void> {
        try {
            await this.filteredProcessRepository.destroy({ where: { orgUnitId: ids }, force: true });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }
}
