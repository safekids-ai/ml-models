import { LRUCache } from '@src/shared/cache/LRUCache';
import { Logger } from '@src/shared/logging/ConsoleLogger';
import { ZveloConfig } from '@src/shared/zvelo/domain/zvelo.config';
import { ZveloApiResponse } from '@src/shared/zvelo/domain/ZveloApiResponse';

type hasName = {
    name: string;
};

export class RESTZveloCategoriesService {
    constructor(private readonly cache: LRUCache<string, number[]>, private readonly log: Logger) {}
    private hasName(obj: unknown): obj is hasName {
        return (obj as hasName).name !== undefined;
    }

    async getHostCategoryCodes(url: string, zveloConfig: ZveloConfig): Promise<number[]> {
        const cacheCategoryCodes = this.cache.get(url);
        if (cacheCategoryCodes == null) {
            const newCategory = await this.getZveloCategoryByUrl(url, zveloConfig);
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

    readonly getZveloCategoryByUrl = async (url: string, zveloConfig: ZveloConfig): Promise<ZveloApiResponse | undefined> => {
        try {
            return await this.lookupUrl(url, zveloConfig);
        } catch (error) {
            // longer than 5 seconds
            if (this.hasName(error) && error.name === 'AbortError') {
                this.log.error('Zvelo Api Failed to Response back in 5s:');
                return undefined;
            } else {
                this.log.error(`Some error occurred in zvelo Api: error, ${error}`);
                return await this.lookupUrl(url, zveloConfig);
            }
        }
    };

    lookupUrl = async (host: string, zveloConfig: ZveloConfig): Promise<ZveloApiResponse> => {
        const params = {
            apiKey: zveloConfig.key,
            url: host,
        };
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const api = `${zveloConfig.url}?` + new URLSearchParams(params);
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
