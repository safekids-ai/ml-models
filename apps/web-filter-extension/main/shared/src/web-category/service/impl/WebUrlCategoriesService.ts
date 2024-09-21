import { ContentResult } from '@shared/types/ContentResult';
import { WebCategoryConfig } from '@shared/web-category/domain/web-category.config';
import { UrlCategoryService } from '@shared/web-category/service/UrlCategoryService';

import { LocalWebCategoryCategoriesService } from '@shared/web-category/service/impl/LocalWebCategoryCategoriesService';
import { RESTWebCategoryService } from '@shared/web-category/service/impl/RESTWebCategoryService';

export class WebUrlCategoriesService implements UrlCategoryService {
    private webCategoryConfig: WebCategoryConfig = {
        url: '',
        key: '',
    };

    constructor(
        private readonly localZveloCategoriesService: LocalWebCategoryCategoriesService,
        private readonly restZveloCategoriesService: RESTWebCategoryService
    ) {}

    async initialize(webCategoryConfig: WebCategoryConfig): Promise<void> {
        this.webCategoryConfig = webCategoryConfig;
        await this.localZveloCategoriesService.initialize();
    }

    async getHostCategoryCodes(url: string): Promise<number[]> {
        const categoryCodes = await this.localZveloCategoriesService.getHostCategoryCodes(url);
        if (categoryCodes.length !== 0) {
            return categoryCodes;
        }
        return await this.restZveloCategoriesService.getHostCategoryCodes(url, this.webCategoryConfig);
    }

    getCategoryByCodes(host: string, codes: number[]): ContentResult {
        return this.localZveloCategoriesService.getCategoryByCodes(host, codes);
    }
}
