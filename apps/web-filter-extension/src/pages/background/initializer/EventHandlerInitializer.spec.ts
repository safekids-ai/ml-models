import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { QueueWrapper } from '../../../../src/pages/background/model/queue/QueueWrapper';
import { EventHandlerInitializer } from '../../../../src/pages/background/initializer/EventHandlerInitializer';
import { ChromeHelperFactory } from '../../../../src/shared/chrome/factory/ChromeHelperFactory';
import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';
import { ContentFilterManager } from '../../../../src/pages/background/filter/ContentFilterManager';
import { PrrReportManager } from '../../../../src/pages/background/prr/PrrReportManager';
import { PrrMonitor, UrlPrrMonitor } from '../../../../src/pages/background/prr/monitor/PrrMonitor';
import { mock } from 'ts-mockito';
import { InformEventHandler } from '../../../../src/pages/background/event/handler/InformEventHandler';
import { EventType } from '../../../../src/shared/types/message_types';
import { UserServiceImpl } from '../../../../src/pages/background/services/UserService';
import { ChromeCommonUtils } from '../../../../src/shared/chrome/utils/ChromeCommonUtils';
import { MLPrrMonitor } from '../../../../src/pages/background/prr/monitor/MLPrrMonitor';

describe('EventHandlerModelsInitializer', () => {
    let instance: EventHandlerInitializer;
    const logger = new ConsoleLogger();
    const store = TestUtils.buildSettingsState();
    const localStorage = new LocalStorageManager();
    const queue = mock(QueueWrapper);
    const filterManager = mock(ContentFilterManager);
    const prrReportManager = mock(PrrReportManager);
    const urlPrrMonitor = mock(UrlPrrMonitor);
    const mlPrrMonitor = mock(MLPrrMonitor);
    const tabVisitManager = mock(InformEventHandler);
    let chromeHelperFactory = new ChromeHelperFactory(logger, localStorage, store);
    const chromeUtils = chromeHelperFactory.getChromeUtils();
    beforeEach(() => {
        const userService = mock(UserServiceImpl);
        let chromeHelperFactory = new ChromeHelperFactory(logger, localStorage, store);
        instance = new EventHandlerInitializer(
            store,
            logger,
            queue,
            filterManager,
            prrReportManager,
            urlPrrMonitor,
            mlPrrMonitor,
            chromeHelperFactory,
            tabVisitManager,
            userService
        );
    });

    it('instance should be an instanceof EventHandlerInitializer', async () => {
        // @ts-ignore
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
            },
            storage: {
                // @ts-ignore
                local: {
                    get: jest.fn(() => Promise.resolve()),
                },
            },
        };
        jest.spyOn(ChromeCommonUtils, 'getUserCredentials').mockResolvedValue({ accessCode: '1111' });
        jest.spyOn(ChromeCommonUtils, 'getJWTToken').mockResolvedValue('524352346324634735734587');

        const result = await instance.init();

        expect(instance instanceof EventHandlerInitializer).toBeTruthy();
        expect(result).toBeTruthy();
    });

    it('should send an accessCode', async () => {
        const spy = jest.spyOn(chrome.runtime, 'sendMessage');
        instance.sendAccessCode('a', 'b', 'c');
        expect(spy).toBeCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('a', { status: EventType.UPDATE_CREDENTIALS, accessCode: 'b', jwtToken: 'c' }, expect.any(Function));
    });
    it('should send an accessCode', async () => {
        const spy = jest.spyOn(chrome.runtime, 'sendMessage');
        instance.sendAccessCodeAfterUpdate('a', 'b', 'c');
        expect(spy).toBeCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('a', { status: EventType.UPDATE_CREDENTIALS_AFTER_UPDATE, accessCode: 'b', jwtToken: 'c' }, expect.any(Function));
    });
});
