import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ACCOUNT_LICENSE_REPOSITORY } from '../constants';
import { AccountLicense, AccountLicenseCreationAttributes } from './entities/account-license.entity';
import { uuid } from 'uuidv4';
import { AccountErrors } from '../accounts/account.errors';
import { AccountService } from '../accounts/account.service';
import { LoggingService } from '../logger/logging.service';
import { AccountLicenseErrors } from './account-license.errors';

@Injectable()
export class AccountLicenseService {
    constructor(
        @Inject(ACCOUNT_LICENSE_REPOSITORY)
        private readonly repository: typeof AccountLicense,
        private readonly accountService: AccountService,
        private readonly log: LoggingService
    ) {}
    create(createLicenseDto: AccountLicenseCreationAttributes) {
        if (!createLicenseDto.id) {
            createLicenseDto.id = uuid();
        }
        return this.repository.create(createLicenseDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    findOneByKey(key: string, accountId: string) {
        return this.repository.findOne({ where: { key, accountId } });
    }

    async verifyLicense(email: string, key: string): Promise<boolean> {
        const domain = email.substring(email.lastIndexOf('@') + 1);
        const account = await this.accountService.findOneByDomain(domain);
        if (!account) {
            this.log.error(AccountErrors.domainNotFound(domain));
            throw new UnauthorizedException(AccountErrors.domainNotFound(domain));
        }
        const accountLicense = await this.repository.findOne({
            where: { key, accountId: account.id, enabled: true },
        });

        if (accountLicense && accountLicense.expiresAt >= new Date()) {
            return true;
        }

        if (!accountLicense) {
            throw AccountLicenseErrors.notFound(account.id);
        }
        if (accountLicense.expiresAt < new Date()) {
            throw AccountLicenseErrors.expired(accountLicense.expiresAt, account.id);
        }

        return false;
    }

    update(id: string, updateLicenseDto: Partial<AccountLicenseCreationAttributes>) {
        return this.repository.update(updateLicenseDto, { where: { id } });
    }

    remove(id: string) {
        return this.repository.destroy({ where: { id } });
    }
}
