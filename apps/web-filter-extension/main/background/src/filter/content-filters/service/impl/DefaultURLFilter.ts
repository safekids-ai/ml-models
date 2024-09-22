import {ContentResult} from '@shared/types/ContentResult';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {ContentFilterChain} from '../../../ContentFilterChain';
import {ContentFilter} from '../ContentFilter';
import {DefaultUrls} from "@shared/utils/content-filter/DefaultUrls"

import {UrlStatus} from '@shared/types/UrlStatus';

export class DefaultURLFilter implements ContentFilter {
  async filter(lowerHost: string, url: string): Promise<ContentResult> {
    if (Object.keys(DefaultUrls.getSearchEngineUrls()).some((h: string) => !(lowerHost.match(h) == null))) {
      return ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.INAPPROPRIATE_FOR_MINORS, PrrLevel.ONE, lowerHost);
    }
    if (Object.keys(DefaultUrls.getExplicitUrls()).some((h: string) => !(lowerHost.match(h) == null))) {
      return ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.ADULT_SEXUAL_CONTENT, PrrLevel.ONE, lowerHost);
    }
    return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, lowerHost);
  }
}
