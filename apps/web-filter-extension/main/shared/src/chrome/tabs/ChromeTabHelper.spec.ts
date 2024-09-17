import { ConsoleLogger } from '../../logging/ConsoleLogger';
import { TestUtils } from '../../../../TestUtils';
import { BlockResult, ChromeTabHelper } from './ChromeTabHelper';
import { PrrLevel } from '../../types/PrrLevel';
import { PrrCategory } from '../../types/PrrCategory';
import UpdateProperties = chrome.tabs.UpdateProperties;
import Tab = chrome.tabs.Tab;
import QueryInfo = chrome.tabs.QueryInfo;

describe('ChromeTabHelper Test', () => {
    let service: ChromeTabHelper;
    const logger = new ConsoleLogger();
    const store = TestUtils.buildSettingsState();
    beforeEach(() => {
        service = new ChromeTabHelper(logger, store);
    });

    it('Should redirect to url', async () => {
        //given
        const tabSpy = jest
            .spyOn(global.chrome.tabs, 'update')
            .mockImplementation((tabId: number, updateProperties: UpdateProperties, callback?: (tab?: Tab) => void): void => {
                if (callback) {
                    callback();
                }
            });
        const tabId = 111;
        const tabInfo = { url: 'http://google.com' };
        const callback = jest.fn(async (): Promise<void> => {});

        //when
        service.redirect(tabId, tabInfo, callback);

        //then
        expect(callback).toBeCalled();
        expect(tabSpy).toBeCalled();
    });
    it('Should close tab and open a new tab if all closed', async () => {
        const tabs: Tab[] = [
            {
                id: 1,
                url: 'chrome-extension://1111111/src/pages/ui-prr/index.html',
                autoDiscardable: false,
                discarded: false,
                active: false,
                highlighted: false,
                incognito: false,
                pinned: false,
                selected: false,
                windowId: 0,
                index: 0,
            },
            {
                id: 2,
                url: 'chrome-extension://1111111/src/pages/ui-prr/index.html',
                autoDiscardable: false,
                discarded: false,
                active: false,
                highlighted: false,
                incognito: false,
                pinned: false,
                selected: false,
                windowId: 0,
                index: 0,
            },
            {
                id: 3,
                url: 'chrome-extension://1111111/src/pages/ui-prr/index.html',
                autoDiscardable: false,
                discarded: false,
                active: false,
                highlighted: false,
                incognito: false,
                pinned: false,
                selected: false,
                windowId: 0,
                index: 0,
            },
        ];
        //given
        const removeSpy = jest.fn((tabId: number, callback) => {
            if (callback) {
                callback();
            }
        });
        const createSpy = jest.fn(() => {});
        global.chrome = {
            // @ts-ignore
            runtime: {
                id: '1111111',
            },
            tabs: {
                query: async (queryInfo: QueryInfo, callback: (result: Tab[]) => void): Promise<void> => {
                    return callback(tabs);
                },
                create: async () => {
                    return createSpy() as unknown as Tab;
                },
                // @ts-ignore
                remove: (tabId: number, callback: any): void => {
                    removeSpy(tabId, callback);
                },
            },
        };
        const tabId = 3;

        //when
        service.close(tabId);

        //then
        expect(removeSpy).toBeCalled();
        expect(createSpy).toBeCalled();
    });
    it('Should close tab', async () => {
        const tabs = [
            { id: 1, url: 'https://localhost' },
            { id: 2, url: 'https://google.com' },
            { id: 3, url: 'chrome-extension://1111111/src/pages/ui-prr/index.html' },
        ];
        //given
        const removeSpy = jest.fn((tabId: number, callback) => {
            if (callback) {
                callback();
            }
        });
        global.chrome = {
            // @ts-ignore
            runtime: {
                id: '1111111',
            },
            // @ts-ignore
            tabs: {
                query: (queryInfo: QueryInfo, callback: (result: Tab[]) => void): void => {
                    // @ts-ignore
                    callback(tabs);
                },
                create: () => {},
                // @ts-ignore
                remove: (tabId: number, callback: any): void => {
                    removeSpy(tabId, callback);
                },
            },
        };
        const tabId = 3;

        //when
        service.close(tabId);

        //then
        expect(removeSpy).toBeCalled();

        //when
        service.close(1);

        //then
        expect(removeSpy).toBeCalled();
    });

    it('Should close tab when it is not prr url', async () => {
        const tabs = [{ id: 1, url: 'https://localhost' }];
        //given
        const removeSpy = jest.fn((tabId: number, callback) => {
            if (callback) {
                callback();
            }
        });
        global.chrome = {
            // @ts-ignore
            runtime: {
                id: '1111111',
            },
            // @ts-ignore
            tabs: {
                query: (queryInfo: QueryInfo, callback: (result: Tab[]) => void): void => {
                    // @ts-ignore
                    callback(tabs);
                },
                create: () => {},
                // @ts-ignore
                remove: (tabId: number, callback: any): void => {
                    removeSpy(tabId, callback);
                },
            },
        };
        const tabId = 3;

        //when
        service.close(tabId);

        //then
        expect(removeSpy).toBeCalled();

        //when
        service.close(1);

        //then
        expect(removeSpy).toBeCalled();
    });

    it('Should create a new tab', async () => {
        //given
        const createSpy = jest.fn((createProperties: any, callback) => {
            if (callback) {
                callback();
            }
        });

        const tabs: Tab[] = [
            {
                id: 1,
                url: 'chrome-extension://1111111/src/pages/ui-prr/index.html',
                autoDiscardable: false,
                discarded: false,
                active: false,
                highlighted: false,
                incognito: false,
                pinned: false,
                selected: false,
                windowId: 0,
                index: 0,
            },
        ];
        //given
        global.chrome = {
            // @ts-ignore
            tabs: {
                query: async (queryInfo: QueryInfo, callback: (result: Tab[]) => void): Promise<void> => {
                    return callback(tabs);
                },
                create: (createProperties: any, callback): void => {
                    createSpy(createProperties, callback);
                },
            },
        };

        //when
        service.create('http://google.com');

        //then
        expect(createSpy).toBeCalled();
    });

    it('Should not create a new tab if already opened', async () => {
        //given
        const createSpy = jest.fn((createProperties: any, callback) => {
            if (callback) {
                callback();
            }
        });
        const url = 'chrome-extension://1111111/src/pages/ui-prr/index.html';
        const tabs: Tab[] = [
            {
                id: 1,
                url,
                autoDiscardable: false,
                discarded: false,
                active: false,
                highlighted: false,
                incognito: false,
                pinned: false,
                selected: false,
                windowId: 0,
                index: 0,
            },
        ];
        //given
        global.chrome = {
            // @ts-ignore
            tabs: {
                query: async (queryInfo: QueryInfo, callback: (result: Tab[]) => void): Promise<void> => {
                    return callback(tabs);
                },
                create: (createProperties: any, callback): void => {
                    createSpy(createProperties, callback);
                },
            },
        };

        //when
        service.createIfNotOpened(url);

        //then
        expect(createSpy).toBeCalledTimes(0);
    });

    it('Should return tab', async () => {
        const tabs = [
            { id: 1, url: 'https://localhost' },
            { id: 2, url: 'https://google.com' },
        ];
        //given
        global.chrome = {
            // @ts-ignore
            tabs: {
                query: (queryInfo: QueryInfo, callback: (result: Tab[]) => void): void => {
                    // @ts-ignore
                    callback(tabs);
                },
            },
        };
        const tabId = 2;

        //when
        const tab: any = service.getTab(tabId);

        //then
        expect(tab).toBeTruthy();
        expect(tab?.url).toEqual('https://google.com');
    });

    it('Should embed content to tab', async () => {
        const blockResult: BlockResult = {
            category: PrrCategory.ADULT_SEXUAL_CONTENT,
            level: PrrLevel.ONE,
            host: 'google.com',
            ai: true,
            status: '',
        };
        //given
        global.chrome = {
            // @ts-ignore
            scripting: {
                executeScript: (scriptOptions: any, callback: () => void): void => {
                    // @ts-ignore
                    scriptOptions.func(scriptOptions.args[0], scriptOptions.args[1]);
                },
            },
            // @ts-ignore
            runtime: {
                id: '1111111',
            },
        };
        //given
        // @ts-ignore
        const scriptSpy = jest.spyOn(global.chrome.scripting, 'executeScript').mockImplementation((scriptProperties: any, callback: () => void): void => {
            scriptProperties.func(scriptProperties.args[0], scriptProperties.args[1]);
        });

        const tabId = 111;
        //when
        service.displayPopup(tabId, blockResult);

        //then
        expect(scriptSpy).toBeCalled();
    });
});
