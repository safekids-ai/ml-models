import {ContentResult} from '@shared/types/ContentResult';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {ContentFilterChain} from '../../../ContentFilterChain';
import {ContentFilter} from '../ContentFilter';
import {DefaultUrls} from "@shared/utils/content-filter/DefaultUrls"

import {UrlStatus} from '@shared/types/UrlStatus';
import {HTMLWebData} from "@safekids-ai/web-category-types";
import {ChromeCommonUtils} from "@shared/chrome/utils/ChromeCommonUtils";
import {Logger} from "@shared/logging/ConsoleLogger";
import {ReduxStorage} from "@shared/types/ReduxedStorage.type";
import {ChromeUtils} from "@shared/chrome/utils/ChromeUtils";
import {HttpUtils} from "@shared/utils/HttpUtils";

export class StaticHostURLFilter implements ContentFilter {
  constructor(
    private readonly logger: Logger,
    private readonly store: ReduxStorage,
    private readonly chromeUtils: ChromeUtils
  ) {
  }

  async filter(host: string, url: string, meta?: HTMLWebData): Promise<ContentResult> {
    //user defined permissible and impermissible sites
    const {permissibleUrls, nonPermissibleUrls, filteredCategories} = this.store.getState().settings;
    this.logger.log(`nonPermissibleUrls: ${JSON.stringify(nonPermissibleUrls)}`);
    if (nonPermissibleUrls?.length > 0 && nonPermissibleUrls.includes(host)) {
      return ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.UN_KNOWN, PrrLevel.ONE, host);
    }

    this.logger.log(`permissibleUrls: ${JSON.stringify(permissibleUrls)}`);
    if (ChromeCommonUtils.isHostPermissibleOrEducational(host, permissibleUrls)) {
      return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.PERMISSIBLE, PrrLevel.ZERO, host);
    }

    const informUrlExists = await this.chromeUtils.checkInformUrlStatus(host);
    this.logger.debug(`Prr inform Url exists----: ${informUrlExists}, for host: ${host}`);
    if (informUrlExists) {
      return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.PERMISSIBLE, PrrLevel.ZERO, host);
    }

    //local IP
    if (HttpUtils.isLocalHostOrLocalIP(url)) {
      return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, host);
    }

    //hardcoded websites
    if (Object.keys(DefaultUrls.getSearchEngineUrls()).some((h: string) => !(host.match(h) == null))) {
      return ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.INAPPROPRIATE_FOR_MINORS, PrrLevel.ONE, host);
    }
    if (Object.keys(DefaultUrls.getExplicitUrls()).some((h: string) => !(host.match(h) == null))) {
      return ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.ADULT_SEXUAL_CONTENT, PrrLevel.ONE, host);
    }

    //edu websites
    if (host.toLowerCase().endsWith(".edu")) {
      return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.EDUCATIONAL, PrrLevel.ZERO, host);
    }

    return undefined;
  }
}
