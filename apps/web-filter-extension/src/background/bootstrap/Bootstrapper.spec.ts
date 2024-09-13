import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {BeanFactory, BeanNames} from '../factory/BeanFactory';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {BackgroundBootstrapper} from './Bootstrapper';
import {QueueWrapper} from 'apps/web-filter-extension/shared/queue/QueueWrapper';
import {mock} from 'ts-mockito';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {ChromeTabHelper} from '@shared/chrome/tabs/ChromeTabHelper';
import {ChromeHelperFactory} from '@shared/chrome/factory/ChromeHelperFactory';
import {PrrMonitor} from '../prr/monitor/PrrMonitor';
import {FilterManager} from '../filter/ContentFilterManager';
import {PrrReportManager} from '../prr/PrrReportManager';
import {ConfigurationService, ConfigurationServiceImpl} from '../services/ConfigurationService';
import {OnBoardingServiceImpl} from '../services/OnBoardingService';
import {RESTService} from '@shared/rest/RestService';
import {MLModels} from '@shared/types/MLModels';
import {MLModel} from '@shared/types/MLModel.type';
import {InformEventHandler} from '../event/handler/InformEventHandler';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {ChromeAlarmUtil} from '@shared/chrome/alarm/ChromeAlarmUtil';
import {UrlCategoryService} from '@shared/zvelo/service/UrlCategoryService';
import {ContentFilterUtil} from '@shared/utils/content-filter/ContentFilterUtil';
import {UserService, UserServiceImpl} from '../services/UserService';
import {TestUtils} from '../../../../test-utils/helpers/TestUtils';

//given
const categories = {
  url: 'facebook.com',
  codes: [10094],
};
const status = true;
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(categories),
    ok: status,
  })
) as jest.Mock;

global.chrome = {
  tabs: {
    // @ts-ignore
    onCreated: {
      addListener: jest.fn(() => Promise.resolve()),
    },
    // @ts-ignore
    onRemoved: {
      addListener: jest.fn(() => Promise.resolve()),
    },
    // @ts-ignore
    onUpdated: {
      addListener: jest.fn(() => Promise.resolve()),
    },
    // @ts-ignore
    onActivated: {
      addListener: jest.fn(() => Promise.resolve()),
    },
    // @ts-ignore
    onConnect: {
      addListener: jest.fn(() => Promise.resolve()),
    },
  },
  management: {
    // @ts-ignore
    onDisabled: {
      addListener: jest.fn(() => Promise.resolve()),
    },
    // @ts-ignore
    onEnabled: {
      addListener: jest.fn(() => Promise.resolve()),
    },
    // @ts-ignore
    onUninstalled: {
      addListener: jest.fn(() => Promise.resolve()),
    },
  },
  runtime: {
    // @ts-ignore
    onConnect: {
      addListener: jest.fn(() => Promise.resolve()),
    },
    // @ts-ignore
    onMessageExternal: {
      addListener: jest.fn(() => Promise.resolve()),
    },
    sendMessage: jest.fn(() => Promise.resolve()),
    setUninstallURL: jest.fn(() => Promise.resolve()),
    // @ts-ignore
    onMessage: {
      addListener: jest.fn(),
    },
  },
  storage: {
    // @ts-ignore
    local: {
      get: jest.fn(() => Promise.resolve()),
    },
  },
};

describe('BackgroundBootstrapper', () => {
  let instance: BackgroundBootstrapper;
  const logger = new ConsoleLogger();
  const store = TestUtils.buildSettingsState();
  const localStorageManager = new LocalStorageManager();
  const chromeUtils = new ChromeUtils(logger, localStorageManager);
  const chromeTabHelper = mock<ChromeTabHelper>();
  const chromeHelperFactory = new ChromeHelperFactory(logger, localStorageManager, store);
  const restService = mock<RESTService>();
  const onBoardingService = new OnBoardingServiceImpl(logger, chromeTabHelper, chromeUtils, restService);
  const userService: UserService = new UserServiceImpl(logger, restService, localStorageManager);
  const configurationService = new ConfigurationServiceImpl(store, logger, restService, localStorageManager, userService);
  const beanFactory = new BeanFactory(store, localStorageManager, logger);
  const queue = mock<QueueWrapper>();

  beforeEach(() => {
    instance = new BackgroundBootstrapper(logger, beanFactory, store, localStorageManager);
  });

  it('instance should be an instanceof BackgroundBootstrapper', () => {
    expect(instance instanceof BackgroundBootstrapper).toBeTruthy();
  });

  it('should have a method initializeFilters()', async () => {
    const loaderSpy = jest.spyOn(beanFactory, 'getBean').mockImplementation((name: BeanNames): any => {
      if (name === BeanNames.URL_CATEGORY_SERVICE) {
        return mock<UrlCategoryService>();
      } else if (name === BeanNames.CONTENT_FILTER_UTILS) {
        return mock<ContentFilterUtil>();
      } else if (name === BeanNames.USER_SERVICE) {
        return mock<UserService>();
      } else if (name === BeanNames.CHROME_HELPERS_FACTORY) {
        return chromeHelperFactory;
      }
    });

    const result = await instance.initializeFilters();

    expect(result).toBeTruthy();
  });

  it('should have a method initializeMessageListener()', async () => {
    beanFactory.init();
    await instance.initializeFilters();
    await instance.initializeMessageListener(queue);
  });

  it('should have a method initializeAiModels()', async () => {
    const map = new Map<MLModels, MLModel>();
    const loaderSpy = jest.spyOn(beanFactory, 'getBean').mockImplementation((name: BeanNames) => {
      return map;
    });
    await instance.initializeAiModels();
  });

  it('should initialize event handlers', async () => {
    jest.spyOn(ChromeCommonUtils, 'getUserCredentials').mockResolvedValue({accessCode: '1111'});
    jest.spyOn(ChromeCommonUtils, 'getJWTToken').mockResolvedValue('524352346324634735734587');

    const loaderSpy = jest.spyOn(beanFactory, 'getBean').mockImplementation((name: BeanNames): any => {
      if (name === BeanNames.URL_PRR_OBSERVER) {
        return mock<PrrMonitor>();
      } else if (name === BeanNames.CHROME_HELPERS_FACTORY) {
        return chromeHelperFactory;
      } else if (name === BeanNames.URL_FILTER_MANAGER) {
        return mock<FilterManager>();
      } else if (name === BeanNames.PRR_REPORT_MANAGER) {
        return mock<PrrReportManager>();
      } else if (name === BeanNames.REST_SERVICE) {
        return mock<RESTService>();
      } else if (name === BeanNames.TAB_VISIT_MANAGER) {
        return mock<InformEventHandler>();
      }
    });
    jest.spyOn(chromeHelperFactory, 'getChromeUtils').mockReturnValue(chromeUtils);
    jest.spyOn(chromeHelperFactory, 'getTabHelper').mockReturnValue(chromeTabHelper);

    const initialized = await instance.initializeEventHandler(queue);
    expect(initialized).toBeTruthy();
    expect(loaderSpy).toBeCalledTimes(7);
  });

  it('should initialize alarms', async () => {
    // @ts-ignore
    global.chrome = {
      alarms: {
        // @ts-ignore
        onAlarm: {
          addListener: jest.fn(),
        },
      },
    };
    jest.spyOn(beanFactory, 'getBean').mockImplementation((name: BeanNames): any => {
      if (name === BeanNames.CONFIGURATION_SERVICE) {
        return mock<ConfigurationService>();
      } else if (name === BeanNames.CHROME_HELPERS_FACTORY) {
        return chromeHelperFactory;
      } else if (name === BeanNames.TAB_VISIT_MANAGER) {
        return mock<InformEventHandler>();
      }
    });
    jest.spyOn(chromeHelperFactory, 'getChromeUtils').mockReturnValue(chromeUtils);
    jest.spyOn(chromeHelperFactory, 'getTabHelper').mockReturnValue(chromeTabHelper);
    jest.spyOn(ChromeAlarmUtil, 'create').mockImplementation(async () => {
    });
    const result = await instance.initializeAlarms();
    expect(result).toBeTruthy();
  });

  it('should init bootstrapper and call onboarding', async () => {
    const loaderSpy = jest.spyOn(beanFactory, 'getBean').mockImplementation((name: BeanNames): any => {
      if (name === BeanNames.CONFIGURATION_SERVICE) {
        return mock<ConfigurationService>();
      } else if (name === BeanNames.CHROME_HELPERS_FACTORY) {
        return chromeHelperFactory;
      } else if (name === BeanNames.ONBOARDING_SERVICE) {
        return onBoardingService;
      } else if (name === BeanNames.AI_MODELS) {
        return new Map();
      } else if (name === BeanNames.TAB_VISIT_MANAGER) {
        return mock<InformEventHandler>();
      }
    });
    jest.spyOn(instance, 'initializeFilters').mockImplementation(async (): Promise<boolean> => {
      return true;
    });
    jest.spyOn(chromeHelperFactory, 'getChromeUtils').mockReturnValue(chromeUtils);
    jest.spyOn(chromeHelperFactory, 'getTabHelper').mockReturnValue(chromeTabHelper);
    // jest.spyOn(localStorageManager,"get").mockResolvedValue({accessCode: "111111"});
    jest.spyOn(chromeUtils, 'getUserCredentials').mockResolvedValue({accessCode: ''});
    const onBoardingSpy = jest.spyOn(onBoardingService, 'onBoard').mockImplementation(async () => {
    });
    jest.spyOn(instance, 'initializeMessageListener').mockImplementation(async (): Promise<any> => {
    });
    jest.spyOn(instance, 'initializeEventHandler').mockImplementation(async (): Promise<any> => {
    });
    jest.spyOn(instance, 'initializeAlarms').mockImplementation(async (): Promise<any> => {
    });
    jest.spyOn(instance, 'initializeFilters').mockImplementation(async (): Promise<boolean> => {
      return true;
    });
    jest.spyOn(configurationService, 'getChromeExtensionConfiguration').mockImplementation(async (): Promise<any> => {
    });
    jest.spyOn(configurationService, 'setDefaultExtensionConfiguration').mockImplementation(async (): Promise<any> => {
    });

    await instance.init();

    expect(loaderSpy).toBeCalled();
    expect(onBoardingSpy).toBeCalledTimes(1);
  });

  it('should init bootstrapper', async () => {
    const loaderSpy = jest.spyOn(beanFactory, 'getBean').mockImplementation((name: BeanNames): any => {
      if (name === BeanNames.CONFIGURATION_SERVICE) {
        return configurationService;
      } else if (name === BeanNames.CHROME_HELPERS_FACTORY) {
        return chromeHelperFactory;
      } else if (name === BeanNames.ONBOARDING_SERVICE) {
        return onBoardingService;
      } else if (name === BeanNames.AI_MODELS) {
        return new Map();
      } else if (name === BeanNames.TAB_VISIT_MANAGER) {
        return mock<InformEventHandler>();
      }
    });

    jest.spyOn(chromeUtils, 'getUserCredentials').mockResolvedValue({accessCode: '111111'});
    jest.spyOn(chromeHelperFactory, 'getChromeUtils').mockReturnValue(chromeUtils);
    jest.spyOn(chromeHelperFactory, 'getTabHelper').mockReturnValue(chromeTabHelper);
    jest.spyOn(instance, 'initializeMessageListener').mockImplementation(async (): Promise<any> => {
    });
    jest.spyOn(instance, 'initializeEventHandler').mockImplementation(async (): Promise<any> => {
    });
    jest.spyOn(instance, 'initializeAlarms').mockImplementation(async (): Promise<any> => {
    });
    jest.spyOn(instance, 'initializeFilters').mockImplementation(async (): Promise<boolean> => {
      return true;
    });
    jest.spyOn(configurationService, 'getChromeExtensionConfiguration').mockImplementation(async (): Promise<any> => {
    });
    jest.spyOn(configurationService, 'setDefaultExtensionConfiguration').mockImplementation(async (): Promise<any> => {
    });

    const onBoardingSpy = jest.spyOn(onBoardingService, 'onBoard').mockImplementation(async () => {
    });

    await instance.init();

    expect(loaderSpy).toBeCalled();
    expect(onBoardingSpy).toBeCalledTimes(0);
  });

  it('should fail to init bootstrapper', async () => {
    // @ts-ignore
    instance = new BackgroundBootstrapper(logger, null, null, localStorageManager);
    const expected = new Error('Failed initialize Bootstrapper.');
    let error = {};
    await instance.init().catch((e) => {
      error = e;
    });

    expect(expected).toMatchObject(error);
  });
});
