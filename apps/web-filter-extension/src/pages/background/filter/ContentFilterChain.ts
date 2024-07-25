import { ContentResult } from '../../../shared/types/ContentResult';
import { PrrCategory } from '../../../shared/types/PrrCategory';
import { PrrLevel } from '../../../shared/types/PrrLevel';

import { ContentFilter } from './content-filters/service/ContentFilter';
import { UrlStatus } from '../../../shared/types/UrlStatus';
import { HttpUtils } from '../../../shared/utils/HttpUtils';

/**
 *
 */
export class ContentFilterChain {
    constructor(private readonly filters: ContentFilter[]) {}

    execute = async (url: string): Promise<ContentResult> => {
        const lowerHost = url.trim().toLowerCase();
        if (lowerHost.startsWith('chrome-extension:') || lowerHost.startsWith('chrome:')) {
            return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url);
        } else {
            let result: ContentResult = {
                status: UrlStatus.ALLOW,
                category: PrrCategory.UN_KNOWN,
                level: PrrLevel.ZERO,
            };
            const host = HttpUtils.refineHost(lowerHost);

            //executing all filters
            for (let i = 0; i < this.filters.length; i++) {
                result = await this.filters[i].filter(host);

                if (result.status === UrlStatus.BLOCK) {
                    return result;
                }
            }
            return result;
        }
    };

    static refineHost(lowerHost: string) {
        const host = HttpUtils.getRootDomain(lowerHost);
        return host.startsWith('www.') ? host.replace('www.', '') : host;
    }

    static buildContentResult(status: UrlStatus, category: PrrCategory, level: PrrLevel, url?: string, key?: string): ContentResult {
        return {
            status,
            category,
            level,
            host: url,
            key,
        };
    }
}
