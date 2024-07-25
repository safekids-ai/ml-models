import { Logger } from '../../../../../src/shared/logging/ConsoleLogger';
import { mock } from 'ts-mockito';
import { ReduxStorage } from '../../../../../src/shared/types/ReduxedStorage.type';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { TabEventManager } from '../../../../../src/pages/background/event/manager/TabEventManager';
import { TabEventHandler } from '../../../../../src/pages/background/event/handler/TabEventHandler';
import { UrlTabEventHandler } from '../../../../../src/pages/background/event/handler/UrlTabEventHandler';
import { QueueTabEventHandler } from '../../../../../src/pages/background/event/handler/QueueTabEventHandler';
import { FilterManager } from '../../../../../src/pages/background/filter/ContentFilterManager';
import { PrrMonitor } from '../../../../../src/pages/background/prr/monitor/PrrMonitor';
import { ChromeUtils } from '../../../../../src/shared/chrome/utils/ChromeUtils';
import { ChromeTabHelper } from '../../../../../src/shared/chrome/tabs/ChromeTabHelper';
import { QueueWrapper } from '../../../../../src/pages/background/model/queue/QueueWrapper';
import { Tabs } from 'jest-chrome/types/jest-chrome';
import { InformEventHandler } from '../../../../../src/pages/background/event/handler/InformEventHandler';
import { ChromeStorageManager } from '../../../../../src/shared/chrome/storage/ChromeStorageManager';
import { ActivityService } from '../../../../../src/pages/background/services/ActivityService';
import { PrrCategory } from '../../../../../src/shared/types/PrrCategory';
import Tab = chrome.tabs.Tab;

describe('TabEventManager', () => {
    let tab: Tab = {
        active: false,
        autoDiscardable: false,
        discarded: false,
        highlighted: false,
        incognito: false,
        pinned: false,
        selected: false,
        windowId: 0,
        url: 'abc.xyz',
        index: 0,
    };
    let tabEvent = { tabId: 0, tab };

    let instance: TabEventManager;

    const filterManager = mock<FilterManager>();
    const prrMonitor = mock<PrrMonitor>();
    const chromeUtils = mock<ChromeUtils>();
    const chromeTabHelper = mock<ChromeTabHelper>();
    const queueWrapper = mock<QueueWrapper>();
    const logger: Logger = mock<Logger>();
    const localStorage: ChromeStorageManager = mock<ChromeStorageManager>();
    const activityService: ActivityService = mock<ActivityService>();
    const store: ReduxStorage = TestUtils.buildStore([], [], PrrCategory.ONLINE_GAMING, [], true, true);
    const eventManagers: TabEventHandler[] = [];
    const tabVisitManager = new InformEventHandler(logger, store, localStorage, activityService);
    //handler 1
    const urlTabEventHandler = new UrlTabEventHandler(logger, store, filterManager, prrMonitor, tabVisitManager);
    eventManagers.push(urlTabEventHandler);
    //handler 2
    const queueTabEventHandler = new QueueTabEventHandler(logger, chromeUtils, chromeTabHelper, queueWrapper, prrMonitor);
    eventManagers.push(queueTabEventHandler);

    beforeEach(() => {
        instance = new TabEventManager(logger, store, eventManagers);
    });

    test('TabEventManager - onActivated event', () => {
        const urlTabEventHandlerSpy = jest.spyOn(urlTabEventHandler, 'onCreated');
        const queueTabEventHandlerSpy = jest.spyOn(queueTabEventHandler, 'onCreated');

        instance.onCreated(tabEvent);

        expect(urlTabEventHandlerSpy).toBeCalled();
        expect(queueTabEventHandlerSpy).toBeCalled();
    });

    test('TabEventManager - onRemoved event', () => {
        const urlTabEventHandlerSpy = jest.spyOn(urlTabEventHandler, 'onRemoved');
        const queueTabEventHandlerSpy = jest.spyOn(queueTabEventHandler, 'onRemoved');
        jest.spyOn(tabVisitManager, 'endEvent').mockImplementation(async () => {});
        instance.onRemoved(tabEvent);

        expect(urlTabEventHandlerSpy).toBeCalled();
        expect(queueTabEventHandlerSpy).toBeCalled();
    });

    test('TabEventManager - onActivated event', () => {
        const urlTabEventHandlerSpy = jest.spyOn(urlTabEventHandler, 'onActivated');
        const queueTabEventHandlerSpy = jest.spyOn(queueTabEventHandler, 'onActivated');
        let activeInfo: Tabs.TabActiveInfo = { tabId: 0, windowId: 0 };
        instance.onActivated(activeInfo, tabEvent);

        expect(urlTabEventHandlerSpy).toBeCalled();
        expect(queueTabEventHandlerSpy).toBeCalled();
    });

    test('TabEventManager - onUpdated event', () => {
        const urlTabEventHandlerSpy = jest.spyOn(urlTabEventHandler, 'onUpdated');
        const queueTabEventHandlerSpy = jest.spyOn(queueTabEventHandler, 'onUpdated');
        jest.spyOn(tabVisitManager, 'checkUrlStatus').mockResolvedValue({ status: true });
        let tabInfo: Tabs.TabChangeInfo;
        tabInfo = {};
        instance.onUpdated(tabInfo, tabEvent);

        expect(urlTabEventHandlerSpy).toBeCalled();
        expect(queueTabEventHandlerSpy).toBeCalled();
    });
});
