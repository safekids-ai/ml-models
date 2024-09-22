import {ContentResult} from '@shared/types/ContentResult';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {ContentFilter} from './content-filters/service/ContentFilter';
import {UrlStatus} from '@shared/types/UrlStatus';
import {HttpUtils} from '@shared/utils/HttpUtils';

/**
 *
 */
export class ContentFilterChain {
  constructor(private readonly filters: ContentFilter[]) {
  }

  execute = async (_url: string): Promise<ContentResult> => {
    const url = _url.trim().toLowerCase();
    if (url.startsWith('chrome-extension:') || url.startsWith('chrome:')) {
      return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url);
    } else {
      let result: ContentResult = {
        status: UrlStatus.ALLOW,
        category: PrrCategory.UN_KNOWN,
        level: PrrLevel.ZERO,
      };
      const host = HttpUtils.refineHost(url);

      //executing all filters
      for (let i = 0; i < this.filters.length; i++) {
        result = await this.filters[i].filter(host, url);

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
