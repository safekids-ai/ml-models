import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY, NON_SCHOOL_DEVICES_CONFIG_REPOSITORY, SEQUELIZE } from '../constants';
import { NonSchoolDevicesConfig } from './entities/non-school-devices-config.entity';
import { Account } from '../accounts/entities/account.entity';
import { ExemptEmailsDto } from './dto/exempt-emails.dto';
import { QueryException } from '../error/common.exception';
import { LoggingService } from '../logger/logging.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class NonSchoolDevicesConfigService {
    private readonly sequelize: Sequelize;

    constructor(
        @Inject(NON_SCHOOL_DEVICES_CONFIG_REPOSITORY)
        private readonly repository: typeof NonSchoolDevicesConfig,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: typeof Account,
        private readonly log: LoggingService,
        @Inject(SEQUELIZE) sequelize: Sequelize
    ) {
        this.sequelize = sequelize;
    }

    async findExtensionStatus(accountId: string): Promise<Account> {
        return await this.accountRepository.findOne({
            attributes: ['enableExtension'],
            where: { id: accountId },
        });
    }

    async updateExtensionStatus(accountId: string, enableExtension: boolean): Promise<void> {
        await this.accountRepository.update({ enableExtension }, { where: { id: accountId } });
    }

    async updateExemptedEmails(accountId: string, dto: ExemptEmailsDto): Promise<void> {
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            const exemptedEmails = dto.emails.map((email) => {
                return { email, accountId };
            });
            await this.repository.destroy({ where: { accountId } });
            await this.repository.bulkCreate<NonSchoolDevicesConfig>(exemptedEmails);
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            this.log.error(QueryException.bulkCreate(e));
            throw new QueryException(QueryException.bulkCreate());
        }
    }

    async checkStatus(accountId: string, email: string): Promise<{ status: boolean }> {
        const account = await this.findExtensionStatus(accountId);
        if (account.enableExtension) {
            return { status: true };
        }
        const userFound = await this.repository.findOne<NonSchoolDevicesConfig>({
            where: { accountId, email },
        });
        return { status: !!userFound };
    }
}
