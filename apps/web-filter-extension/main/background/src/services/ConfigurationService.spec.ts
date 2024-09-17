import {ConsoleLogger, Logger} from '@shared/logging/ConsoleLogger';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {ConfigurationService, ConfigurationServiceImpl} from './ConfigurationService';
import {FetchApiService, RESTService} from '@shared/rest/RestService';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {Configuration} from '@shared/types/Configuration.type';
import {PrrCategory} from '@shared/types/PrrCategory';
import {UrlStatus} from '@shared/types/UrlStatus';
import {ChromeExtensionStatus} from '@shared/types/ChromeExtensionStatus.type';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {UserService, UserServiceImpl} from './UserService';

describe('Configuration service test', () => {
  let service: ConfigurationService;
  let store: ReduxStorage = TestUtils.buildSettingsState();
  const logger: Logger = new ConsoleLogger();
  const localStorageManager = new LocalStorageManager();
  const chromeUtils = new ChromeUtils(logger, localStorageManager);
  const restService: RESTService = new FetchApiService(chromeUtils);
  const userService: UserService = new UserServiceImpl(logger, restService, localStorageManager);

  beforeEach(async () => {
    service = new ConfigurationServiceImpl(store, logger, restService, localStorageManager, userService);
  });

  describe('get user configuration', () => {
    test('it should get user configuration', async () => {
      //given
      const configuration: Configuration = {
        permissible: ['www.google.com'],
        nonPermissible: ['www.youtube.com'],
        filteredCategories: [
          {categoryId: PrrCategory.EXPLICIT, status: UrlStatus.ASK},
          {categoryId: PrrCategory.GAMBLING, status: UrlStatus.INFORM},
        ],
        interceptionCategories: ['GAMING'],
        kidConfig: {accessLimitedAt: new Date()},
        accessLimited: true,
        subscription: false,
        isExtensionEnabled: true,
      };
      //mock dependencies
      jest.spyOn(restService, 'doGet').mockResolvedValueOnce(configuration);
      jest.spyOn(store, 'dispatch').mockImplementation(async () => {
      });
      jest.spyOn(localStorageManager, 'set').mockImplementation(async () => {
      });
      const getChromeExtensionConfigurationSpy = jest.spyOn(service, 'getChromeExtensionConfiguration');

      //when
      await service.getChromeExtensionConfiguration();

      //then
      expect(getChromeExtensionConfigurationSpy).toBeCalledTimes(1);

      expect(store.dispatch).toBeCalledTimes(4);
      expect(localStorageManager.set).toBeCalledTimes(6);
    });

    test('it should fail request while getting configurations', async () => {
      //mock dependencies
      jest.spyOn(restService, 'doGet').mockImplementation(async () => {
        throw new Error('dummy error');
      });

      //when
      let failed = false;
      const result = await service.getChromeExtensionConfiguration().catch(() => {
        failed = true;
      });

      //then
      expect(result).toBeFalsy();
    });
  });

  describe('check extension update status', () => {
    test('Should check extension update status', async () => {
      const spy = jest.spyOn(ChromeCommonUtils, 'writeLocalStorage');

      service.updateChromeExtensionAlarm(ChromeExtensionStatus.UPDATE_AVAILABLE);
      service.updateChromeExtensionAlarm(ChromeExtensionStatus.NO_UPDATE);

      //then
      expect(spy).toBeCalledTimes(2);
    });
  });
});
