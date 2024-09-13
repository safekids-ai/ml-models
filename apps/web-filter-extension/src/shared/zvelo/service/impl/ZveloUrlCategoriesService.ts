import { ContentResult } from '@shared/types/ContentResult';
import { ZveloConfig } from '@shared/zvelo/domain/zvelo.config';
import { UrlCategoryService } from '@shared/zvelo/service/UrlCategoryService';

import { LocalZveloCategoriesService } from '@shared/zvelo/service/impl/LocalZveloCategoriesService';
import { RESTZveloCategoriesService } from '@shared/zvelo/service/impl/RESTZveloCategoriesService';

export class ZveloUrlCategoriesService implements UrlCategoryService {
    private zveloConfig: ZveloConfig = {
        url: '',
        key: '',
    };

    constructor(
        private readonly localZveloCategoriesService: LocalZveloCategoriesService,
        private readonly restZveloCategoriesService: RESTZveloCategoriesService
    ) {}

    async initialize(zveloConfig: ZveloConfig): Promise<void> {
        this.zveloConfig = zveloConfig;
        await this.localZveloCategoriesService.initialize();
    }

    async getHostCategoryCodes(url: string): Promise<number[]> {
        const categoryCodes = await this.localZveloCategoriesService.getHostCategoryCodes(url);
        if (categoryCodes.length !== 0) {
            return categoryCodes;
        }
        return await this.restZveloCategoriesService.getHostCategoryCodes(url, this.zveloConfig);
    }

    getCategoryByCodes(host: string, codes: number[]): ContentResult {
        return this.localZveloCategoriesService.getCategoryByCodes(host, codes);
    }
}
