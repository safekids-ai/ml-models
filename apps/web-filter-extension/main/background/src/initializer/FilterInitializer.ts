import {UserService} from '../services/UserService';
import {ChromeStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {Logger} from '@shared/logging/ConsoleLogger';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {UrlCategoryService} from '@shared/web-category/service/UrlCategoryService';
import {BeanFactory, BeanNames} from '../factory/BeanFactory';
import {ContentFilter} from '../filter/content-filters/service/ContentFilter';
import {ContentFilterUtil} from "@shared/utils/content-filter/ContentFilterUtil"
import {ContentFilterChain} from '../filter/ContentFilterChain';
import {ContentFilterManager, FilterManager} from '../filter/ContentFilterManager';
import {Initializer} from './Initializer';
import {ChromeHelperFactory} from '@shared/chrome/factory/ChromeHelperFactory';
import {StaticHostURLFilter} from "../filter/content-filters/service/impl/StaticHostAndURLFilter";
import {DynamicCategoryFilter} from "../filter/content-filters/service/impl/DynamicCategoryFilter";

export class FilterInitializer implements Initializer {
  constructor(
    private readonly logger: Logger,
    private readonly store: ReduxStorage,
    private readonly storageManager: ChromeStorageManager,
    private readonly beanFactory: BeanFactory
  ) {
  }

  init = async (): Promise<boolean> => {
    try {
      // TODO: send filter Manager as dependency
      const filterChain = new ContentFilterChain(this.logger, this.createContentFilters());
      const filterManager: FilterManager = new ContentFilterManager(filterChain);
      this.beanFactory.addBean(BeanNames.URL_FILTER_MANAGER, filterManager);
      return true;
    } catch (e) {
      this.logger.error(`Error occurred while initializing Filters. ${e}`);
      return false;
    }
  };

  /**
   * creates default list of content filters to be provided to filter chain
   */
  createContentFilters = (): ContentFilter[] => {
    const urlCategoryService = this.beanFactory.getBean(BeanNames.URL_CATEGORY_SERVICE) as UrlCategoryService;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!urlCategoryService) {
      throw new Error('Dependency UrlCategoryService not found.');
    }
    const contentFilterUtils: ContentFilterUtil = this.beanFactory.getBean(BeanNames.CONTENT_FILTER_UTILS) as ContentFilterUtil;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!contentFilterUtils) {
      throw new Error('Dependency contentFilterUtils not found.');
    }
    const userService: UserService = this.beanFactory.getBean(BeanNames.USER_SERVICE) as UserService;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!userService) {
      throw new Error('Dependency userService not found.');
    }
    const chromeHelperFactory = this.beanFactory.getBean(BeanNames.CHROME_HELPERS_FACTORY) as ChromeHelperFactory;

    const staticHostFilter = new StaticHostURLFilter(this.logger, this.store, chromeHelperFactory.getChromeUtils());
    const dynamicCategoryFilter = new DynamicCategoryFilter(this.logger, this.store, urlCategoryService, userService);

    const filters = [];
    filters.push(staticHostFilter);
    filters.push(dynamicCategoryFilter);

    return filters;
  };
}
