import {UserService, UserServiceImpl} from '../services/UserService';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {FilterInitializer} from './FilterInitializer';
import {BeanFactory, BeanNames} from '../factory/BeanFactory';
import {mock} from 'ts-mockito';
import {ZveloUrlCategoriesService} from '@shared/web-category/service/impl/ZveloUrlCategoriesService';
import {ContentFilterUtil} from '@shared/utils/content-filter/ContentFilterUtil';

describe('FilterInitializer test', () => {
  const urlCategoryService = mock(ZveloUrlCategoriesService);
  const contentFilterUtils: ContentFilterUtil = mock(ContentFilterUtil);
  const userService: UserService = mock(UserServiceImpl);

  let instance: FilterInitializer;
  const logger = new ConsoleLogger();
  const store = TestUtils.buildSettingsState();
  const localStorage = new LocalStorageManager();
  //TODO: make a type {"store":ReduxStorage;localStorage : LocalStorageManager;logger: Logger} to pass as dependency
  const beanFactory = new BeanFactory(store, localStorage, logger);

  beforeEach(() => {
  });

  it('should fail to create instance of FilterInitializer if content filters failed to create', async () => {
    instance = new FilterInitializer(logger, store, localStorage, beanFactory);

    let result = await instance.init();
    expect(result).toBeFalsy();

    expect(() => beanFactory.getBean(BeanNames.URL_FILTER_MANAGER)).toThrowError();

    //test 2nd
    beanFactory.addBean(BeanNames.URL_CATEGORY_SERVICE, urlCategoryService);
    instance = new FilterInitializer(logger, store, localStorage, beanFactory);

    result = await instance.init();
    expect(result).toBeFalsy();

    expect(() => beanFactory.getBean(BeanNames.URL_FILTER_MANAGER)).toThrowError();
    //test 3rd
    beanFactory.addBean(BeanNames.URL_CATEGORY_SERVICE, urlCategoryService);
    beanFactory.addBean(BeanNames.CONTENT_FILTER_UTILS, contentFilterUtils);
    instance = new FilterInitializer(logger, store, localStorage, beanFactory);

    result = await instance.init();
    expect(result).toBeFalsy();

    expect(() => beanFactory.getBean(BeanNames.URL_FILTER_MANAGER)).toThrowError();
  });

  it('should create instance of FilterInitializer', async () => {
    beanFactory.addBean(BeanNames.URL_CATEGORY_SERVICE, urlCategoryService);
    beanFactory.addBean(BeanNames.CONTENT_FILTER_UTILS, contentFilterUtils);
    beanFactory.addBean(BeanNames.USER_SERVICE, userService);
    instance = new FilterInitializer(logger, store, localStorage, beanFactory);

    expect(() => beanFactory.getBean(BeanNames.URL_FILTER_MANAGER)).toThrowError();

    const result = await instance.init();
    expect(result).toBeTruthy();

    const filterManager = beanFactory.getBean(BeanNames.URL_FILTER_MANAGER);
    expect(filterManager).toBeTruthy();
  });
});
