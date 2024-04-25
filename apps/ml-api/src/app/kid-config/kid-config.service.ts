import { Inject, Injectable } from '@nestjs/common';
import { KID_CONFIG_REPOSITORY } from '../constants';
import { KidConfig } from './entities/kid-config.entity';
import { uuid } from 'uuidv4';
import { QueryException } from '../error/common.exception';
import { LoggingService } from '../logger/logging.service';
import { KidConfigDTO } from './dto/kid-config.dto';
import { Statuses } from '../status/default-status';

@Injectable()
export class KidConfigService {
    private readonly KID_OFF_TIME: string;

    constructor(
        @Inject(KID_CONFIG_REPOSITORY)
        private readonly repository: typeof KidConfig,
        private readonly log: LoggingService
    ) {
        this.log.className(KidConfigService.name);
        this.KID_OFF_TIME = '21:00';
    }

    /**
     * Create kid config
     * @param userId
     * @returns KidConfig
     */
    async create(userId: string): Promise<KidConfig> {
        try {
            const dto = {
                id: uuid(),
                offTime: this.KID_OFF_TIME,
                userId,
                status: Statuses.IN_PROGRESS,
                step: 0,
            } as KidConfigDTO;
            return await this.repository.create(dto);
        } catch (error) {
            this.log.error(QueryException.save(error));
            throw new QueryException(QueryException.save());
        }
    }

    /**
     * Delete kid configurations by user ids
     * @param userIds
     * @returns void
     */
    async deleteByUserIds(userIds: string[]): Promise<void> {
        try {
            await this.repository.destroy({ where: { userId: userIds } });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    /**
     * Update kid config
     * @param userId
     * @param objectToUpdate
     * @returns void
     */
    async update(userId: string, objectToUpdate = {}): Promise<void> {
        try {
            await this.repository.update(objectToUpdate, { where: { userId } });
        } catch (error) {
            this.log.error(QueryException.update(error));
            throw new QueryException(QueryException.update());
        }
    }

    /**
     * Get kid config
     * @param userId
     * @returns KidConfig
     */
    async fetch(userId: string): Promise<KidConfig> {
        return await this.repository.findOne({ where: { userId } });
    }
}
