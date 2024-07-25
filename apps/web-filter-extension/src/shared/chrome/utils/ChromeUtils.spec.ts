import { ChromeUtils } from '../../../../src/shared/chrome/utils/ChromeUtils';
import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';
import { PrrCategory } from '../../../../src/shared/types/PrrCategory';
import { PrrLevel } from '../../../../src/shared/types/PrrLevel';
import { Credentials } from '../../../../src/shared/types/message_types';
import { HttpUtils } from '../../../../src/shared/utils/HttpUtils';
import { jest } from '@jest/globals';
import Tab = chrome.tabs.Tab;
import { ConsoleLogger, Logger } from '../../../../src/shared/logging/ConsoleLogger';

describe('ChromeUtils Test', () => {
    let service: ChromeUtils;
    const logger: Logger = new ConsoleLogger();
    const localStorage = new LocalStorageManager();
    beforeEach(() => {
        service = new ChromeUtils(logger, localStorage);
    });

    it('Should return tab url', async () => {
        let result = service.buildTabIdUrl(undefined);
        expect(result).toBeTruthy();
        expect(result.tabId).toEqual(999999);

        let tab: Tab = {
            active: false,
            autoDiscardable: false,
            discarded: false,
            highlighted: false,
            incognito: false,
            pinned: false,
            selected: false,
            windowId: 0,
            url: 'xvideos.com',
            index: 0,
            id: 11,
        };

        result = service.buildTabIdUrl(tab);
        expect(result).toBeTruthy();
        expect(result.tabId).toEqual(11);
    });

    it('Should return prr page url ', async () => {
        //expected
        let expected = 'chrome-extension://1111111/src/pages/ui-prr/index.html';

        global.chrome = {
            // @ts-ignore
            runtime: {
                id: '1111111',
            },
        };

        //when
        const result = service.prrPageUrl();

        //then
        expect(result).toEqual(expected);
    });

    it('Should return prr page url with parameters', async () => {
        //expected
        let expectedWithParams = 'chrome-extension://1111111/src/pages/ui-prr/index.html?ai=false&status=block&category=PORN&level=1&host=poodle.com&eventId=111';

        global.chrome = {
            // @ts-ignore
            runtime: {
                id: '1111111',
            },
        };

        //when
        const prrModel = { category: PrrCategory.EXPLICIT, host: 'poodle.com', level: PrrLevel.ONE, ai: false, status: 'block', eventId: '111' };
        let result = service.prrPageUrl(prrModel);

        //then
        expect(result).toEqual(expectedWithParams);
    });

    it('Should save user credentials', async () => {
        const spy = jest.spyOn(localStorage, 'set').mockImplementation(async () => {});
        await service.saveLoginCredentials('1111', 'token111', '11111', true);
        expect(spy).toBeCalledTimes(4);
    });

    it('Should set Extension Status', async () => {
        const spy = jest.spyOn(localStorage, 'set').mockImplementation(async () => {});
        await service.setExtensionStatus(true);
        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith({ extensionStatus: true });
    });

    it('Should get User Credentials', async () => {
        const expected = { email: 'test@email.com', accessCode: '11111' };
        const spy = jest.spyOn(localStorage, 'get').mockImplementation(async (): Promise<Credentials> => {
            return expected;
        });
        const credentials = await service.getUserCredentials();
        expect(spy).toBeCalledTimes(1);
        expect(expected).toMatchObject(credentials);
    });

    it('Should complete promise', async () => {
        const callback = { key: '1111' };

        const result = await service.promiseChrome(callback);
        expect(callback).toMatchObject(result);
    });

    it('Should get User Access code', async () => {
        const expected = '11111';
        const spy = jest.spyOn(localStorage, 'get').mockImplementation(async (): Promise<string> => {
            return expected;
        });
        const accessCode = await service.getAccessCode();
        expect(spy).toBeCalledTimes(1);
        expect(expected).toEqual(accessCode);
    });

    it('Should get JWT Token', async () => {
        const expected = 'jwttoken';
        const spy = jest.spyOn(localStorage, 'get').mockImplementation(async (): Promise<string> => {
            return expected;
        });
        const jwtToken = await service.getJWTToken();
        expect(spy).toBeCalledTimes(1);
        expect(expected).toEqual(jwtToken);
    });

    it('Should return chrome manifest', async () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                getManifest: () => {
                    return {
                        name: 'my chrome extension',
                        manifest_version: 2,
                        version: '1.0.0',
                    };
                },
            },
        };
        const manifest = await service.getManifest();
        expect(manifest).toBeTruthy();
        expect(manifest.version).toEqual('1.0.0');
    });

    it('Should send message', async () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                sendMessage: async (message, callback) => {
                    if (callback != null) {
                        callback();
                    }
                },
            },
        };

        const callback = jest.fn(async (data?: any): Promise<void> => {});

        jest.spyOn(HttpUtils, 'getDomain');
        //when
        await service.sendMessage({ type: 'SEND_MESSAGE' });

        //then
        expect(callback).toBeCalledTimes(0);

        //when
        await service.sendMessage({ type: 'SEND_MESSAGE' }, callback);

        //then
        expect(callback).toBeCalledTimes(1);
    });

    it('Should send message using chrome sendMessage', async () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                sendMessage: async (message, callback) => {
                    if (callback != null) {
                        callback();
                    }
                },
            },
        };

        const callback = jest.fn(async (data?: any): Promise<void> => {});

        jest.spyOn(HttpUtils, 'getDomain');
        //when
        await service.send({ type: 'SEND_MESSAGE' });

        //then
        expect(callback).toBeCalledTimes(0);

        //when
        await service.send({ type: 'SEND_MESSAGE' }, callback);

        //then
        expect(callback).toBeCalledTimes(1);
    });

    it('Should return true if url is found in inform urls and no timeout ', async () => {
        //given
        const url = 'amazon.com';
        //mock dependencies
        const informUrls = ['amazon.com'];

        //mock dependencies
        jest.spyOn(service, 'getInformUrls').mockResolvedValueOnce(informUrls);

        //when
        const result = await service.checkInformUrlStatus(url);

        //then
        expect(result).toBeTruthy();
    });

    it('Should return false if url is found in inform urls and timeout ', async () => {
        //given
        const url = '';

        //mock dependencies
        const informUrlsArray = ['amazon.com'];

        //mock dependencies
        jest.spyOn(service, 'getInformUrls').mockResolvedValueOnce(informUrlsArray);

        //when
        const result = await service.checkInformUrlStatus(url);

        //then
        expect(result).toBeFalsy();
    });
});
