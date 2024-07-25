import { ConsoleLogger, Logger } from '../../../../src/shared/logging/ConsoleLogger';
import { ReduxStorage } from '../../../../src/shared/types/ReduxedStorage.type';
import { ConfigurationService, ConfigurationServiceImpl } from '../../../../src/pages/background/services/ConfigurationService';
import { FetchApiService, RESTService } from '../../../../src/shared/rest/RestService';
import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';
import { ChromeUtils } from '../../../../src/shared/chrome/utils/ChromeUtils';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { Configuration } from '../../../../src/shared/types/Configuration.type';
import { PrrCategory } from '../../../../src/shared/types/PrrCategory';
import { UrlStatus } from '../../../../src/shared/types/UrlStatus';
import { ChromeExtensionStatus } from '../../../../src/shared/types/ChromeExtensionStatus.type';
import { ChromeCommonUtils } from '../../../../src/shared/chrome/utils/ChromeCommonUtils';
import { UserService, UserServiceImpl } from '../../../../src/pages/background/services/UserService';

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
                    { categoryId: PrrCategory.EXPLICIT, status: UrlStatus.ASK },
                    { categoryId: PrrCategory.GAMBLING, status: UrlStatus.INFORM },
                ],
                interceptionCategories: ['GAMING'],
                kidConfig: { accessLimitedAt: new Date() },
                accessLimited: true,
                subscription: false,
                isExtensionEnabled: true,
            };
            //mock dependencies
            jest.spyOn(restService, 'doGet').mockResolvedValueOnce(configuration);
            jest.spyOn(store, 'dispatch').mockImplementation(async () => {});
            jest.spyOn(localStorageManager, 'set').mockImplementation(async () => {});
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
