import {BeanFactory, BeanNames} from './BeanFactory';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {mock} from 'ts-mockito';
import {ContentFilterManager} from '../filter/ContentFilterManager';
import {jest} from '@jest/globals';

describe('BeanFactory', () => {
  const store = TestUtils.buildSettingsState();
  const logger = new ConsoleLogger();
  const localStorage = new LocalStorageManager();
  let instance: BeanFactory;
  let urlFilterManager = mock(ContentFilterManager);
  //given
  const categories = {
    url: 'facebook.com',
    codes: [10094],
  };
  const status = true;
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(categories),
      ok: status,
    })
  ) as jest.Mock;

  beforeEach(async () => {
    instance = new BeanFactory(store, localStorage, logger);
    TestUtils.mockFetchResponse(categories, true);
    await instance.init();
  });
  it('Should return dependencies after init', async () => {
    expect(instance.getBean(BeanNames.PRR_REPORT_MANAGER)).toBeTruthy();
    expect(instance.getBean(BeanNames.ACTIVITY_SERVICE)).toBeTruthy();
    expect(instance.getBean(BeanNames.REST_SERVICE)).toBeTruthy();
    expect(instance.getBean(BeanNames.ONBOARDING_SERVICE)).toBeTruthy();
    expect(instance.getBean(BeanNames.AUTHENTICATION_SERVICE)).toBeTruthy();
    expect(instance.getBean(BeanNames.URL_CATEGORY_SERVICE)).toBeTruthy();
    expect(instance.getBean(BeanNames.CONFIGURATION_SERVICE)).toBeTruthy();
    expect(instance.getBean(BeanNames.ML_PRR_OBSERVER)).toBeTruthy();
    expect(instance.getBean(BeanNames.URL_PRR_OBSERVER)).toBeTruthy();
    expect(instance.getBean(BeanNames.PRR_TRIGGER_SERVICE)).toBeTruthy();
    expect(instance.getBean(BeanNames.PRR_LEVEL_CHECKER)).toBeTruthy();
    expect(instance.getBean(BeanNames.PRR_REPORT_MANAGER)).toBeTruthy();
    expect(instance.getBean(BeanNames.CHROME_HELPERS_FACTORY)).toBeTruthy();
    expect(instance.getBean(BeanNames.USER_SERVICE)).toBeTruthy();
    expect(instance.getBean(BeanNames.CONTENT_FILTER_UTILS)).toBeTruthy();

    expect(() => instance.getBean(BeanNames.URL_FILTER_MANAGER)).toThrowError();
  });

  it('Should add dependency after init', async () => {
    expect(() => instance.getBean(BeanNames.URL_FILTER_MANAGER)).toThrowError();

    instance.addBean(BeanNames.URL_FILTER_MANAGER, urlFilterManager);

    const bean = instance.getBean(BeanNames.URL_FILTER_MANAGER);
    expect(bean).toBeTruthy();
  });

  it('Should remove dependency after init', async () => {
    let prrReportManager = instance.getBean(BeanNames.PRR_REPORT_MANAGER);
    expect(prrReportManager).toBeTruthy();

    instance.removeBean(BeanNames.PRR_REPORT_MANAGER);

    expect(() => instance.getBean(BeanNames.PRR_REPORT_MANAGER)).toThrowError();
  });
});
