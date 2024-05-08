import { Inject, Injectable } from '@nestjs/common';
import { ParentConsentDto } from './dto/parent-consent.dto';
import { ParentConsent } from './entities/parent-consent.entity';
import { PARENT_CONSENT_REPOSITORY } from '../../constants';
import { QueryException } from '../../error/common.exception';
import { LoggingService } from '../../logger/logging.service';

@Injectable()
export class ParentConsentService {
    constructor(
        @Inject(PARENT_CONSENT_REPOSITORY)
        private readonly repository: typeof ParentConsent,
        private readonly log: LoggingService
    ) {
        this.log.className(ParentConsentService.name);
    }

    /**
     * Create parent consent
     * @param userId
     * @param accountId
     * @param dto create parent consent request
     * @returns ParentConsent
     */
    async create(userId: string, accountId: string, dto: ParentConsentDto): Promise<void> {
        try {
            dto.userId = userId;
            dto.accountId = accountId;
            await this.repository.create(dto);
        } catch (e) {
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save(e));
        }
    }

    async delete(accountId: string): Promise<void> {
        try {
            await this.repository.destroy({ where: { accountId }, force: true });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }
}
