import { LRUCache } from '@shared/cache/LRUCache';
import { Logger } from '@shared/logging/ConsoleLogger';
import { WebCategoryConfig } from '@shared/web-category/domain/web-category.config';
import { WebCategoryApiResponse } from '@shared/web-category/domain/WebCategoryApiResponse';

type hasName = {
    name: string;
};

export class RESTWebCategoryService {
    constructor(private readonly cache: LRUCache<string, number[]>, private readonly log: Logger) {}
    private hasName(obj: unknown): obj is hasName {
        return (obj as hasName).name !== undefined;
    }

    async getHostCategoryCodes(url: string, webCategoryConfig: WebCategoryConfig): Promise<number[]> {
        const cacheCategoryCodes = this.cache.get(url);
        if (cacheCategoryCodes == null) {
            const newCategory = await this.getWebCategoryCategoryByUrl(url, webCategoryConfig);
            this.log.info(`new category after fetching url, ${JSON.stringify(newCategory)}`);
            if (newCategory != null && newCategory.codes) {
                this.cache.set(url, newCategory.codes);
                return newCategory.codes;
            }
            return [];
        }
        this.log.info(`cache return codes, ${JSON.stringify(cacheCategoryCodes)}`);
        return cacheCategoryCodes;
    }

    readonly getWebCategoryCategoryByUrl = async (url: string, webCategoryConfig: WebCategoryConfig): Promise<WebCategoryApiResponse | undefined> => {
        try {
            return await this.lookupUrl(url, webCategoryConfig);
        } catch (error) {
            // longer than 5 seconds
            if (this.hasName(error) && error.name === 'AbortError') {
                this.log.error('WebCategory Api Failed to Response back in 5s:');
                return undefined;
            } else {
                this.log.error(`Some error occurred in webCategory Api: error, ${error}`);
                return await this.lookupUrl(url, webCategoryConfig);
            }
        }
    };

    lookupUrl = async (host: string, webCategoryConfig: WebCategoryConfig): Promise<WebCategoryApiResponse> => {
        const params = {
            apiKey: webCategoryConfig.key,
            url: host,
        };
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const api = `${webCategoryConfig.url}?` + new URLSearchParams(params);
        const options = { timeout: 5000 };
        const response = await this.fetchWithTimeout(api, options);
        return await response.json();
    };

    private readonly fetchWithTimeout = async (api: string, options: { timeout: number }) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), options.timeout);
        const response = await fetch(api, {
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    };
}
