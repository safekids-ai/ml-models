import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY, URL_REPOSITORY } from '../constants';
import { QueryException } from '../error/common.exception';
import { Url } from './entities/url.entity';
import { alwaysAccessibleDomains } from '../constants/always.accessible.domains';
import { UrlDto } from '../filtered-url/dto/filtered-url.dto';
import { Account } from '../accounts/entities/account.entity';
import { AccountTypes } from '../account-type/dto/account-types';

@Injectable()
export class UrlService {
    constructor(
        @Inject(URL_REPOSITORY)
        private readonly repository: typeof Url,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: typeof Account
    ) {}

    /** Fetch urls
     * @param accountId
     * @returns urls
     */
    async findAll(accountId: string): Promise<UrlDto[]> {
        const account = await this.accountRepository.findOne({
            attributes: ['accountTypeId'],
            where: { id: accountId },
        });
        if (account.accountTypeId === AccountTypes.CONSUMER) {
            return [];
        }
        const urls = await this.repository.findAll<Url>();
        return urls.sort().map((url) => {
            return { name: url.name, enabled: true };
        });
    }

    /** Seed default urls
     * @returns void
     */
    async seedDefaultUrls(): Promise<void> {
        try {
            for (const name of alwaysAccessibleDomains) {
                await this.repository.upsert({ name });
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
