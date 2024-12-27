import {ContentFilter} from "../ContentFilter";
import {Logger} from "@shared/logging/ConsoleLogger";
import {ReduxStorage} from "@shared/types/ReduxedStorage.type";
import {UrlCategoryService} from "@shared/web-category/service/UrlCategoryService";
import {UserService} from "../../../../services/UserService";
import {HTMLWebData} from "@safekids-ai/web-category-types";
import {ContentResult} from "@shared/types/ContentResult";
import {ChromeCommonUtils} from "@shared/chrome/utils/ChromeCommonUtils";
import {ContentFilterChain} from "../../../ContentFilterChain";
import {UrlStatus} from "@shared/types/UrlStatus";
import {PrrCategory} from "@shared/types/PrrCategory";
import {PrrLevel} from "@shared/types/PrrLevel";
import {addMinutes, isAfter} from "date-fns";

export class DynamicCategoryFilter implements ContentFilter {
  constructor(
    private readonly logger: Logger,
    private readonly store: ReduxStorage,
    private readonly urlCategoryService: UrlCategoryService,
    private readonly userService: UserService,
  ) {
  }

  async filter(host: string, url: string, htmlData?: HTMLWebData): Promise<ContentResult> {
    const {permissibleUrls, nonPermissibleUrls, filteredCategories} = this.store.getState().settings;
    const userAccessLimited: boolean = await ChromeCommonUtils.readLocalStorage('accessLimited');

    const category = await this.urlCategoryService.getHostCategoryCodes(host, url, htmlData);
    let result = this.urlCategoryService.getCategoryByCodes(host, category);
    this.logger.log(`configuration filter category result: ${JSON.stringify(result)}`);

    //check if educational content
    const isEdu = ChromeCommonUtils.inEducationalCodes(category)[0];
    if (isEdu) {
      return ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.EDUCATIONAL, PrrLevel.ZERO, host);
    }

    //check if limit access
    if (userAccessLimited) {
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

    //check categories
    const key: any = result?.key?.toUpperCase() || '';

    this.logger.log(`filteredCategories: ${JSON.stringify(filteredCategories)}`);
    if (filteredCategories && filteredCategories.hasOwnProperty(key)) {
      const categoryStatus = filteredCategories[key];
      result.status = UrlStatus[categoryStatus];
      this.logger.log(`Content filter. Found a filtered category: ${JSON.stringify(result)}`);
      return result;
    }
    return undefined;
  }
}
