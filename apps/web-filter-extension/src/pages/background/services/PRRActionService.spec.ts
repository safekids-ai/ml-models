import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { PRRActionService, PRRActionServiceImpl } from '../../../../src/pages/background/services/PRRActionService';
import { Logger, ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { FetchApiService, RESTService } from '../../../../src/shared/rest/RestService';
import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';
import { ChromeUtils } from '../../../../src/shared/chrome/utils/ChromeUtils';
import { jest } from '@jest/globals';
import { ReduxStorage } from '../../../../src/shared/types/ReduxedStorage.type';
import { ChromeTabHelper } from '../../../../src/shared/chrome/tabs/ChromeTabHelper';
import { PrrInform } from '../../../../src/shared/types/PrrInform.type';
import { PrrCategory } from '../../../../src/shared/types/PrrCategory';

import UpdateProperties = chrome.tabs.UpdateProperties;
import Tab = chrome.tabs.Tab;
import QueryInfo = chrome.tabs.QueryInfo;
import { InformEventHandler } from '../../../../src/pages/background/event/handler/InformEventHandler';
import { ActivityService } from '../../../../src/pages/background/services/ActivityService';
import { mock } from 'ts-mockito';
import { PrrCrisis } from '../../../../src/shared/types/PrrCrisis.type';

describe('PRR service test', () => {
    let service: PRRActionService;
    let store: ReduxStorage = TestUtils.buildStore();
    const logger: Logger = new ConsoleLogger();
    const localStorageManager = new LocalStorageManager();
    const chromeUtils = new ChromeUtils(logger, localStorageManager);
    const chromeTabHelper = new ChromeTabHelper(logger, store);
    const restService: RESTService = new FetchApiService(chromeUtils);
    const activityService = mock<ActivityService>();
    const tabVisitManager: InformEventHandler = new InformEventHandler(logger, store, localStorageManager, activityService);
    beforeEach(async () => {
        service = new PRRActionServiceImpl(logger, restService, chromeUtils, chromeTabHelper, tabVisitManager);
    });

    describe('inform AI PRR Action', () => {
        test('it should inform parent after AI prompt', async () => {
            //given
            const tabId: number = 1;
            const payload: PrrInform = { categoryId: PrrCategory.ADULT_SEXUAL_CONTENT, url: 'https://google.com', ai: true };

            //mock dependencies
            global.chrome = {
                // @ts-ignore
                scripting: {
                    executeScript: (scriptOptions: any, callback: () => void): void => {
                        // @ts-ignore
                        scriptOptions.func(scriptOptions.args[0], scriptOptions.args[1]);
                    },
                },
            };
            // @ts-ignore
            const scriptSpy = jest.spyOn(global.chrome.scripting, 'executeScript').mockImplementation((scriptProperties: any, callback: () => void): void => {
                scriptProperties.func(scriptProperties.args[0], scriptProperties.args[1]);
            });
            const safekidsParentDiv = document.createElement('safekids-chrome-integration');
            const docFragment = document.createDocumentFragment();
            docFragment.appendChild(safekidsParentDiv);
            const htmlcollection = docFragment.children;
            const documentSpy = jest.spyOn(document.documentElement, 'getElementsByTagName').mockImplementation((parentDivId: string) => {
                return htmlcollection;
            });
            const httpRequest = jest.spyOn(restService, 'doPost').mockResolvedValueOnce(true);
            const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue(2);
            const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});

            //when
            const result = await service.informAIAction(payload, tabId);

            //then
            expect(result).toBeTruthy();
            expect(scriptSpy).toBeCalledTimes(1);
            expect(localStorageManagerGetSpy).toBeCalledTimes(1);
            expect(localStorageManagerSetSpy).toBeCalledTimes(1);
            expect(documentSpy).toBeCalledTimes(1);
            expect(httpRequest).toBeCalledTimes(1);
        });
        test('it should remove ai prr screen', async () => {
            //given
            const tabId: number = 1;

            //mock dependencies
            global.chrome = {
                // @ts-ignore
                scripting: {
                    executeScript: (scriptOptions: any, callback: () => void): void => {
                        // @ts-ignore
                        scriptOptions.func(scriptOptions.args[0], scriptOptions.args[1]);
                    },
                },
            };
            // @ts-ignore
            const scriptSpy = jest.spyOn(global.chrome.scripting, 'executeScript').mockImplementation((scriptProperties: any, callback: () => void): void => {
                scriptProperties.func(scriptProperties.args[0], scriptProperties.args[1]);
            });
            const safekidsParentDiv = document.createElement('safekids-chrome-integration');
            const docFragment = document.createDocumentFragment();
            docFragment.appendChild(safekidsParentDiv);
            const htmlcollection = docFragment.children;
            const documentSpy = jest.spyOn(document.documentElement, 'getElementsByTagName').mockImplementation((parentDivId: string) => {
                return htmlcollection;
            });

            //when
            await service.removeAIScreen(tabId);

            //then
            expect(scriptSpy).toBeCalledTimes(1);
            expect(documentSpy).toBeCalledTimes(1);
        });
    });

    describe('inform PRR Action', () => {
        test('it should inform parent', async () => {
            //given
            const tabId: number = 1;
            const payload: PrrInform = { categoryId: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com', ai: false };

            const getLocalStorageValue = [
                { time: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com' },
                { time: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com' },
            ];

            //mock dependencies
            jest.spyOn(localStorageManager, 'get').mockResolvedValue(getLocalStorageValue);
            jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});

            const httpRequest = jest.spyOn(restService, 'doPost').mockResolvedValueOnce(true);
            const tabSpy = jest.spyOn(chromeTabHelper, 'redirect').mockImplementation(async () => {});
            jest.spyOn(tabVisitManager, 'reportEvent').mockImplementation(async () => {});
            //when
            const result = await service.informAction(payload, tabId);

            //then
            expect(result).toBeTruthy();
            expect(tabSpy).toBeCalledTimes(1);
        });

        test('it should inform parent and report infor tab event when ai is false', async () => {
            //given
            const tabId: number = 1;
            const payload: PrrInform = { categoryId: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com', ai: false };

            const getLocalStorageValue = [
                { time: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com' },
                { time: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com' },
            ];

            //mock dependencies
            jest.spyOn(localStorageManager, 'get').mockResolvedValue(getLocalStorageValue);
            jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});

            jest.spyOn(restService, 'doPost').mockResolvedValueOnce(true);
            jest.spyOn(chromeTabHelper, 'redirect').mockImplementation(async () => {});
            jest.spyOn(tabVisitManager, 'reportEvent').mockImplementation(async () => {});
            //when
            const result = await service.informAction(payload, tabId);

            //then
            expect(result).toBeTruthy();
            expect(tabVisitManager.reportEvent).toBeCalledTimes(1);
        });

        test('it should not inform parent', async () => {
            //given
            const tabId: number = 1;
            const payload: PrrInform = { categoryId: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com', ai: true };

            //mock dependencies
            const httpRequest = jest.spyOn(restService, 'doPost').mockResolvedValueOnce(false);
            const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue([]);
            const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});

            //when
            const result = await service.informAction(payload, tabId);

            //then
            expect(result).toBeFalsy();
            expect(httpRequest).toBeCalledTimes(1);
            expect(localStorageManagerGetSpy).toBeCalledTimes(1);
            expect(localStorageManagerSetSpy).toBeCalledTimes(0);
        });

        test('it should fail request while informing parents', async () => {
            //given
            const tabId: number = 1;
            const payload: PrrInform = { categoryId: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com', ai: true };

            //mock dependencies
            const httpRequest = jest.spyOn(restService, 'doPost').mockImplementation(async () => {
                throw new Error('dummy error');
            });
            const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue([]);
            const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});

            //when
            let failed = false;
            const result = await service.informAction(payload, tabId).catch(() => {
                failed = true;
            });

            //then
            expect(result).not.toBeTruthy();
            expect(failed).toBeTruthy();
            expect(httpRequest).toBeCalledTimes(1);
            expect(localStorageManagerGetSpy).toBeCalledTimes(1);
            expect(localStorageManagerSetSpy).toBeCalledTimes(0);
        });
    });

    describe('ask PRR Action', () => {
        test('it should ask parent', async () => {
            //given
            const tabId: number = 1;
            const payload: PrrInform = { categoryId: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com', ai: false };

            //mock dependencies
            const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue(1);
            const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});
            const httpRequest = jest.spyOn(restService, 'doPost').mockResolvedValueOnce(true);

            //when
            const result = await service.askAction(payload);

            //then
            expect(result).toBeTruthy();
            expect(httpRequest).toBeCalledTimes(1);
            expect(localStorageManagerGetSpy).toBeCalledTimes(1);
            expect(localStorageManagerSetSpy).toBeCalledTimes(1);
        });

        test('it should fail request while asking parents', async () => {
            //given
            const payload: PrrInform = { categoryId: 'SOCIAL_MEDIA_CHAT', url: 'http://youtube.com', ai: false };

            //mock dependencies
            const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue([]);
            const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});
            const httpRequest = jest.spyOn(restService, 'doPost').mockImplementation(async () => {
                throw new Error('dummy error');
            });

            //when
            let failed = false;
            const result = await service.askAction(payload).catch(() => {
                failed = true;
            });

            //then
            expect(result).not.toBeTruthy();
            expect(failed).toBeTruthy();
            expect(httpRequest).toBeCalledTimes(1);
            expect(localStorageManagerGetSpy).toBeCalledTimes(1);
            expect(localStorageManagerSetSpy).toBeCalledTimes(0);
        });
    });

    describe('crisis PRR Action', () => {
        test('it should notify the parent', async () => {
            //given
            const tabId: number = 1;
            const payload: PrrCrisis = { categoryId: 'WEAPONS', url: 'http://guns.com', ai: true, choseToContinue: false };

            //mock dependencies
            const httpRequest = jest.spyOn(restService, 'doPost').mockResolvedValueOnce(true);

            //when
            const result = await service.crisisAction(payload, tabId);

            //then
            expect(result).toBeTruthy();
            expect(httpRequest).toBeCalledTimes(1);
        });

        test('it should fail request while asking parents', async () => {
            //given
            const payload: PrrInform = { categoryId: 'WEAPONS', url: 'http://guns.com', ai: true };

            //mock dependencies
            const httpRequest = jest.spyOn(restService, 'doPost').mockImplementation(async () => {
                throw new Error('dummy error');
            });

            //when
            let failed = false;
            const result = await service.askAction(payload).catch(() => {
                failed = true;
            });

            //then
            expect(result).not.toBeTruthy();
            expect(failed).toBeTruthy();
            expect(httpRequest).toBeCalledTimes(1);
        });
    });
});
