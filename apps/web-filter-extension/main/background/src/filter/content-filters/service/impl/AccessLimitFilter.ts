import {addMinutes, isAfter} from 'date-fns';
import {UserService} from '../../../../services/UserService';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {ContentResult} from '@shared/types/ContentResult';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {UrlCategoryService} from '@shared/web-category/service/UrlCategoryService';
import {ContentFilterChain} from '../../../ContentFilterChain';
import {ContentFilter} from '../ContentFilter';
import {Logger} from '@shared/logging/ConsoleLogger';
import {ContentFilterUtil} from "@shared/utils/content-filter/ContentFilterUtil"
import {UrlStatus} from '@shared/types/UrlStatus';
import {HttpUtils} from "@shared/utils/HttpUtils";
import {WebMeta} from "@safekids-ai/web-category-types";

export class AccessLimitFilter implements ContentFilter {
  constructor(
    private readonly logger: Logger,
    private readonly store: ReduxStorage,
    private readonly contentFilterUtil: ContentFilterUtil,
    private readonly userService: UserService,
    private readonly urlCategoryService: UrlCategoryService
  ) {
  }

  async filter(host: string, url: string, meta?: WebMeta): Promise<ContentResult> {
    const userAccessLimited: boolean = await ChromeCommonUtils.readLocalStorage('accessLimited');
    this.logger.log(`AccessLimitFilter -> userAccessLimited: ${userAccessLimited}`);

    if (HttpUtils.isLocalHostOrLocalIP(url)) {
      return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, host);
    }

    if (userAccessLimited) {
      const {nonPermissibleUrls} = this.store.getState().settings;
      if (nonPermissibleUrls.includes(host)) {
        return ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.ACCESS_LIMITED, PrrLevel.ZERO, host, PrrCategory.ACCESS_LIMITED);
      }

      const categoryResult = await this.urlCategoryService.getHostCategoryCodes(host, url, meta);
      const isEdu = ChromeCommonUtils.inEducationalCodes(categoryResult);
      const isAllowed = this.contentFilterUtil.isHostAllowed(host);
      this.logger.log(`Filter Host: ${host} url:${url} isEdu:${isEdu} isAllowed:${isAllowed}`);
      if (isEdu || isAllowed) {
        return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, host);
      } else {
        try {
          const accessLimitedAt: Date = await ChromeCommonUtils.getAccessLimitedTime();
          this.logger.log(`AccessLimitFilter -> accessLimitedAt: ${accessLimitedAt}`);
          const isAfterRestoreTime = isAfter(new Date(), addMinutes(new Date(accessLimitedAt), 5));
          this.logger.log(`AccessLimitFilter -> isAfterRestoreTime: ${isAfterRestoreTime}`);
          if (isAfterRestoreTime) {
            this.logger.log(`Resetting PRR counters...`);
            this.userService.updateAccess(false, '');
          } else {
            return ContentFilterChain.buildContentResult(
              UrlStatus.BLOCK,
              PrrCategory.ACCESS_LIMITED,
              PrrLevel.ZERO,
              host,
              PrrCategory.ACCESS_LIMITED
            );
          }
        } catch (err) {
          this.logger.error(`Error occurred while getting user accessLimited ${JSON.stringify(err)}`);
        }
      }
    }
    return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, host);
  }
}
