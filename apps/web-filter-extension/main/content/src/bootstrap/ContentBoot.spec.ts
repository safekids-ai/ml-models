import {LocalStorageManager} from '../../../../shared/chrome/storage/ChromeStorageManager';
import {ConsoleLogger, Logger} from '../../../../shared/logging/ConsoleLogger';
import {BackgroundBootstrapper} from '../../../../chrome-extension/src/background/bootstrap/Bootstrapper';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {ChromeUtils} from '../../../../shared/chrome/utils/ChromeUtils';
import {ContentBootstrapper} from './Bootstrapper';
import {ChromeStore} from 'apps/web-filter-extension/shared/redux/chrome-storage/index';
import {PrrCategory} from '../../../../shared/types/PrrCategory';

describe('BackgroundBootstrapper', () => {
  let instance: ContentBootstrapper;
  const logger: Logger = new ConsoleLogger();
  const store: any = TestUtils.buildStore();
  const localStorageManager = new LocalStorageManager();
  const chromeUtils = new ChromeUtils(logger, localStorageManager);

  beforeEach(() => {
    instance = new ContentBootstrapper(store, logger, localStorageManager, chromeUtils);
  });

  it('instance should be an instanceof ContentBootstrapper', () => {
    jest.spyOn(ChromeStore, 'createStore').mockImplementation(() => {
      return store;
    });
    expect(instance instanceof ContentBootstrapper).toBeTruthy();
  });

  it('Should initialize DOMWatcher', async () => {
    jest.spyOn(ChromeStore, 'createStore').mockImplementation(() => {
      return store;
    });

    await instance.initializeDOMWatcher();
    const watcher = instance.getDomWatcher();
    expect(watcher?.watch).toBeTruthy();
  });

  it('Should initialize Bootstrapper', async () => {
    jest.spyOn(ChromeStore, 'createStore').mockImplementation(() => {
      return store;
    });
    jest.spyOn(instance, 'initializeDOMWatcher').mockImplementation(async () => {
      Promise.resolve();
    });
    jest.spyOn(chromeUtils, 'getUserCredentials').mockResolvedValue({accessCode: '111111'});

    await instance.init();

    expect(instance.initializeDOMWatcher).toBeCalledTimes(1);
  });
});
