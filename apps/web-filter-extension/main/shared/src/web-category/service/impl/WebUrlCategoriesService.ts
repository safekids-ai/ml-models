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
        private readonly localWebCategoryCategoriesService: LocalWebCategoryCategoriesService,
        private readonly restWebCategoryCategoriesService: RESTWebCategoryService
    ) {}

    async initialize(webCategoryConfig: WebCategoryConfig): Promise<void> {
        this.webCategoryConfig = webCategoryConfig;
        await this.localWebCategoryCategoriesService.initialize();
    }

    async getHostCategoryCodes(host: string, url: string): Promise<number[]> {
        const categoryCodes = await this.localWebCategoryCategoriesService.getHostCategoryCodes(host);
        if (categoryCodes.length !== 0) {
            return categoryCodes;
        }
        return await this.restWebCategoryCategoriesService.getHostCategoryCodes(url, this.webCategoryConfig);
    }

    getCategoryByCodes(host: string, codes: number[]): ContentResult {
        return this.localWebCategoryCategoriesService.getCategoryByCodes(host, codes);
    }
}
