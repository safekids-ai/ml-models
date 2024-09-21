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

export class AccessLimitFilter implements ContentFilter {
  constructor(
    private readonly logger: Logger,
    private readonly store: ReduxStorage,
    private readonly contentFilterUtil: ContentFilterUtil,
    private readonly userService: UserService,
    private readonly urlCategoryService: UrlCategoryService
  ) {
  }

  async filter(lowerHost: string): Promise<ContentResult> {
    const userAccessLimited: boolean = await ChromeCommonUtils.readLocalStorage('accessLimited');
    this.logger.log(`AccessLimitFilter -> userAccessLimited: ${userAccessLimited}`);
    if (userAccessLimited) {
      const {nonPermissibleUrls} = this.store.getState().settings;
      if (nonPermissibleUrls.includes(lowerHost)) {
        return ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.ACCESS_LIMITED, PrrLevel.ZERO, lowerHost, PrrCategory.ACCESS_LIMITED);
      }

      const categoryCodes = await this.urlCategoryService.getHostCategoryCodes(lowerHost);
      const isEdu = ChromeCommonUtils.inEducationalCodes(categoryCodes);
      const isAllowed = this.contentFilterUtil.isHostAllowed(lowerHost);

      if (isEdu || isAllowed) {
        return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, lowerHost);
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
              lowerHost,
              PrrCategory.ACCESS_LIMITED
            );
          }
        } catch (err) {
          this.logger.error(`Error occurred while getting user accessLimited ${JSON.stringify(err)}`);
        }
      }
    }
    return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, lowerHost);
  }
}
