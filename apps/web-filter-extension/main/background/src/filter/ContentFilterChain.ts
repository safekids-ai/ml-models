import {ContentResult} from '@shared/types/ContentResult';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {ContentFilter} from './content-filters/service/ContentFilter';
import {UrlStatus} from '@shared/types/UrlStatus';
import {HttpUtils} from '@shared/utils/HttpUtils';
import {HTMLWebData} from "@safekids-ai/web-category-types";
import {IWebCategory} from "@shared/web-category/types/web-category.types";
import {Logger} from "@shared/logging/ConsoleLogger";

/**
 *
 */
export class ContentFilterChain {
  //filter pass in are:
  // DefaultURLFilter
  // AccessLimitFilter
  // ConfigurationFilter

  constructor(private readonly logger: Logger,
              private readonly filters: ContentFilter[]) {
  }

  execute = async (_url: string, htmlData?: HTMLWebData, category?: IWebCategory): Promise<ContentResult> => {
    const url = _url.trim().toLowerCase();
    let defaultAllow = ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url);

    if (url.startsWith('chrome-extension:') || url.startsWith('chrome:')) {
      return defaultAllow;
    } else {
      let result = undefined;
      const host = HttpUtils.refineHost(url);

      //executing all filters
      for (let i = 0; i < this.filters.length; i++) {
        const filter = this.filters[i];
        result = await filter.filter(host, url, htmlData);

        if (result) {
          this.logger.log(`Configuration filter found result. Filter: ${filter.constructor.name} Host: ${host} Url: ${url} result:${JSON.stringify(result)}`);
          return result;
        }
      }
      this.logger.log(`Configuration filter did not find result. Host: ${host} Url: ${url}. Allowing website. Returning ${JSON.stringify(defaultAllow)}`);
      return defaultAllow;
    }
  };

  static refineHost(lowerHost: string) {
    const host = HttpUtils.getRootDomain(lowerHost);
    return host.startsWith('www.') ? host.replace('www.', '') : host;
  }

  static buildContentResult(status: UrlStatus,
                            category: PrrCategory,
                            level: PrrLevel,
                            url?: string,
                            key?: string,
                            aiGenerated: boolean = false,
                            verified: boolean = true,
                            probability: number = 1): ContentResult {
    return {
      status,
      category,
      level,
      host: url,
      key,
      aiGenerated,
      verified,
      probability
    };
  }
}
