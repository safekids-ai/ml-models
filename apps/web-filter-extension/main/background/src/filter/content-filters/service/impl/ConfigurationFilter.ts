import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {ContentResult} from '@shared/types/ContentResult';
import {PrrCategory} from '@shared/types/PrrCategory';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {UrlCategoryService} from '@shared/web-category/service/UrlCategoryService';
import {ContentFilter} from '../ContentFilter';
import {Logger} from '@shared/logging/ConsoleLogger';
import {UrlStatus} from '@shared/types/UrlStatus';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';

export class ConfigurationFilter implements ContentFilter {
  constructor(
    private logger: Logger,
    private readonly store: ReduxStorage,
    private readonly urlCategoryService: UrlCategoryService,
    private readonly chromeUtils: ChromeUtils
  ) {
  }

  async filter(url: string): Promise<ContentResult> {
    const categoryCodes = await this.urlCategoryService.getHostCategoryCodes(url);
    const result = await this.urlCategoryService.getCategoryByCodes(url, categoryCodes);

    this.logger.log(`configuration filter result: ${JSON.stringify(result)}`);

    const key: any = result?.key?.toUpperCase() || '';

    const {permissibleUrls, nonPermissibleUrls, filteredCategories} = this.store.getState().settings;

    if (ChromeCommonUtils.inEducationalCodes(categoryCodes)) {
      result.status = UrlStatus.ALLOW;
    }

    this.logger.log(`filteredCategories: ${JSON.stringify(filteredCategories)}`);
    if (filteredCategories && filteredCategories.hasOwnProperty(key)) {
      const categoryStatus = filteredCategories[key];
      result.status = UrlStatus[categoryStatus];
    }

    this.logger.log(`nonPermissibleUrls: ${JSON.stringify(nonPermissibleUrls)}`);
    if (nonPermissibleUrls?.length > 0 && nonPermissibleUrls.includes(url)) {
      result.status = UrlStatus.BLOCK;
    }

    this.logger.log(`permissibleUrls: ${JSON.stringify(permissibleUrls)}`);
    if (ChromeCommonUtils.isHostPermissibleOrEducational(url, permissibleUrls)) {
      result.status = UrlStatus.ALLOW;
    }

    const informUrlExists = await this.chromeUtils.checkInformUrlStatus(url);
    this.logger.debug(`Prr inform Url exists----: ${informUrlExists}, for host: ${url}`);
    if (informUrlExists) {
      result.status = UrlStatus.ALLOW;
    }

    this.logger.log(`Parsed configuration filter result: ${JSON.stringify(result)}`);

    return result;
  }
}
