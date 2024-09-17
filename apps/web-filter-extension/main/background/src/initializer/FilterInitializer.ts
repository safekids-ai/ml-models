import {UserService} from '../services/UserService';
import {ChromeStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {Logger} from '@shared/logging/ConsoleLogger';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {UrlCategoryService} from '@shared/zvelo/service/UrlCategoryService';
import {BeanFactory, BeanNames} from '../factory/BeanFactory';
import {ContentFilter} from '../filter/content-filters/service/ContentFilter';
import {AccessLimitFilter} from '../filter/content-filters/service/impl/AccessLimitFilter';
import {ConfigurationFilter} from '../filter/content-filters/service/impl/ConfigurationFilter';
import {DefaultURLFilter} from '../filter/content-filters/service/impl/DefaultURLFilter';
import {ContentFilterUtil} from "@shared/utils/content-filter/ContentFilterUtil"
import {ContentFilterChain} from '../filter/ContentFilterChain';
import {ContentFilterManager, FilterManager} from '../filter/ContentFilterManager';
import {Initializer} from './Initializer';
import {ChromeHelperFactory} from '@shared/chrome/factory/ChromeHelperFactory';

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
      const filterChain = new ContentFilterChain(this.createContentFilters());
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

    const defaultURLFilter = new DefaultURLFilter();
    const accessLimitFilter = new AccessLimitFilter(this.logger, this.store, contentFilterUtils, userService, urlCategoryService);
    const configurationFilter = new ConfigurationFilter(this.logger, this.store, urlCategoryService, chromeHelperFactory.getChromeUtils());

    const filters = [];
    filters.push(defaultURLFilter);
    filters.push(accessLimitFilter);
    filters.push(configurationFilter);

    return filters;
  };
}
