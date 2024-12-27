import { Inject, Injectable } from '@nestjs/common';
import { JobDTO } from './dto/jobDTO';
import { JOB_REPOSITORY, SEQUELIZE } from '../constants';
import { Job } from './entities/jobs.entity';
import { LoggingService } from '../logger/logging.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { JobEventTypes } from './job.event.types';
import { QueryException } from '../error/common.exception';
import { JobRemarks, JobStatus, JobStatusDTO } from './dto/job.status';

import { Sequelize } from 'sequelize-typescript';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { JobType } from './dto/job.type';
import { ApiKeyService } from '../api-key/api-key.service';
import { OneRosterService } from '../roster/roster.service';
import { DirectoryService } from '../directory-service/directory.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JobsService {
    private readonly sequelize: Sequelize;

    constructor(
        @Inject(JOB_REPOSITORY) private readonly repository: typeof Job,
        private eventEmitter: EventEmitter2,
        private readonly directoryService: DirectoryService,
        private readonly authTokenService: AuthTokenService,
        private readonly log: LoggingService,
        @Inject(SEQUELIZE) sequelize: Sequelize,
        private readonly apiKeyService: ApiKeyService,
        private readonly oneRosterService: OneRosterService
    ) {
        this.sequelize = sequelize;
    }

    async create(jobDTO: JobDTO, userId: string, accountId: string): Promise<Job> {
        try {
            jobDTO.id = uuidv4();
            jobDTO.userId = userId;
            jobDTO.accountId = accountId;
            jobDTO.startDate = new Date();
            jobDTO.remarks = JobRemarks.STARTED;
            if (jobDTO.type === JobType.OU) {
                this.eventEmitter.emit(JobEventTypes.SYNC_OUS, jobDTO);
            } else if (jobDTO.type === JobType.SIS) {
                this.eventEmitter.emit(JobEventTypes.SYNC_SIS, jobDTO);
            }
            await this.repository.create(jobDTO);
            return await this.findOne(jobDTO.id);
        } catch (e) {
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
    }

    async findOne(id: string): Promise<Job> {
        return await this.repository.findOne({ where: { id } });
    }

    @OnEvent(JobEventTypes.SYNC_OUS, { async: true })
    async syncOUsAndUsers(jobDTO: JobDTO) {
        await this.updateJobStatus(jobDTO.id, JobStatus.IN_PROGRESS, JobRemarks.IN_PROGRESS, new Date());
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            await this.directoryService.populateOrgUnits(jobDTO.accountId, jobDTO.userId);

            const tokenInfo = await this.authTokenService.findByUserIdDecrypted(jobDTO.userId);
            await this.directoryService.syncUsers(jobDTO.accountId, tokenInfo);

            await this.updateJobStatus(jobDTO.id, JobStatus.COMPLETED, JobRemarks.COMPLETED, undefined, new Date());
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            this.log.error(e);
            await this.updateJobStatus(jobDTO.id, JobStatus.FAILED, JobRemarks.FAILED, undefined, new Date());
        }
    }

    private async updateJobStatus(id: string, status: JobStatus, remarks: string, startDate?: Date, endDate?: Date) {
        const jobStatus = { status: status, remarks: remarks } as JobStatusDTO;
        if (startDate) jobStatus.startDate = startDate;
        if (endDate) jobStatus.endDate = endDate;
        await this.repository.update(jobStatus, { where: { id } });
    }

    @OnEvent(JobEventTypes.SYNC_SIS, { async: true })
    async syncSIS(jobDTO: JobDTO) {
        const apiKeys = await this.apiKeyService.findOneByAccount(jobDTO.accountId);
        if (!apiKeys) {
            this.log.error('No api key found by account id', jobDTO.accountId);
            await this.updateJobStatus(jobDTO.id, JobStatus.FAILED, JobRemarks.FAILED, undefined, new Date());
            return;
        }
        await this.updateJobStatus(jobDTO.id, JobStatus.IN_PROGRESS, JobRemarks.IN_PROGRESS, new Date(), undefined);
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            await this.oneRosterService.syncSIS(OneRosterService.buildApiKeyDTO(apiKeys), jobDTO.accountId);

            await this.updateJobStatus(jobDTO.id, JobStatus.COMPLETED, JobRemarks.COMPLETED, undefined, new Date());
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            this.log.error(e);
            await this.updateJobStatus(jobDTO.id, JobStatus.FAILED, JobRemarks.FAILED, undefined, new Date());
        }
    }
}
