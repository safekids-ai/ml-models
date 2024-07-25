import axios from 'axios';
import { FetchApiService, RESTService } from '../../../../src/shared/rest/RestService';
import { Logger, ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { AuthenticationService, AuthenticationServiceImpl } from '../../../../src/pages/background/services/AuthenticationService';
import { ChromeUtils } from '../../../../src/shared/chrome/utils/ChromeUtils';
import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';
import { jest } from '@jest/globals';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { mock } from 'ts-mockito';

describe('Authentication service test', () => {
    let service: AuthenticationService;
    const logger: Logger = new ConsoleLogger();
    const localStorageManager = mock(LocalStorageManager);
    const chromeUtils: ChromeUtils = new ChromeUtils(logger, localStorageManager);
    const restService: RESTService = new FetchApiService(chromeUtils);
    const storageManager = TestUtils.getChromeStorage();

    beforeEach(async () => {
        service = new AuthenticationServiceImpl(logger, localStorageManager, chromeUtils, restService);
    });

    describe('Login', () => {
        test('it should not let login user with access code', async () => {
            //given
            const accessCode = '111111';

            const dataObject = {
                jwt_token: '',
                link: '',
            };

            //mock dependencies
            const chromeAgent =
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.42';
            jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValueOnce(chromeAgent);

            jest.spyOn(restService, 'doPost').mockResolvedValueOnce(dataObject);

            //when
            const result: boolean = await service.login(accessCode);

            //then
            expect(result).toBe(false);
        });

        test('it should let login user with access code', async () => {
            //given
            const accessCode = '111111';

            const dataObject = {
                jwt_token: 'dumy_jwt_token',
                link: 'dumy_link',
            };

            //mock dependencies
            jest.spyOn(restService, 'doPost').mockResolvedValueOnce(dataObject);
            jest.spyOn(storageManager, 'set').mockResolvedValueOnce(true as never);

            //when
            const result: boolean = await service.login(accessCode);

            //then
            expect(result).toBeTruthy();
            expect(result).toBe(true);
        });
    });
});
