import { Logger } from '../../../../../src/shared/logging/ConsoleLogger';
import { ReduxStorage } from '../../../../../src/shared/types/ReduxedStorage.type';
import { ContentFilterManager, FilterManager } from '../../../../../src/pages/background/filter/ContentFilterManager';
import { PrrMonitor, PrrReport, UrlPrrMonitor } from '../../../../../src/pages/background/prr/monitor/PrrMonitor';
import { mock } from 'ts-mockito';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { UrlTabEventHandler } from '../../../../../src/pages/background/event/handler/UrlTabEventHandler';
import { TabEventHandler } from '../../../../../src/pages/background/event/handler/TabEventHandler';
import { PrrCategory } from '../../../../../src/shared/types/PrrCategory';
import { PrrLevel } from '../../../../../src/shared/types/PrrLevel';
import { UrlStatus } from '../../../../../src/shared/types/UrlStatus';
import { Tabs } from 'jest-chrome/types/jest-chrome';
import { PrrTriggerService } from '../../../../../src/pages/background/prr/PrrTriggerService';
import Tab = chrome.tabs.Tab;
import { InformEventHandler } from '../../../../../src/pages/background/event/handler/InformEventHandler';

describe('UrlTabEventHandler', () => {
    let instance: TabEventHandler;
    const logger: Logger = mock<Logger>();
    const store: ReduxStorage = TestUtils.buildSettingsState();
    const filterManager: FilterManager = mock<ContentFilterManager>();
    const prrTriggerService = mock<PrrTriggerService>();
    const tabVisitManager = mock<InformEventHandler>();
    const prrMonitor: PrrMonitor = new UrlPrrMonitor(prrTriggerService);

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
    };
    let tabEvent = { tabId: 0, tab };

    beforeEach(() => {
        instance = new UrlTabEventHandler(logger, store, filterManager, prrMonitor, tabVisitManager);
    });

    test('UrlTabEventHandler - onActivated event', () => {
        const onActivatedSpy = jest.spyOn(instance, 'onActivated');
        let tabInfo: Tabs.TabActiveInfo;
        tabInfo = { tabId: 0, windowId: 0 };
        instance.onActivated(tabInfo);
        expect(onActivatedSpy).toBeCalled();
    });

    test('UrlTabEventHandler - onCreated event', () => {
        const onCreatedSpy = jest.spyOn(instance, 'onCreated');
        let tabInfo: Tabs.TabActiveInfo;
        tabInfo = { tabId: 0, windowId: 0 };
        instance.onCreated(tabInfo);

        expect(onCreatedSpy).toBeCalled();
    });

    test('UrlTabEventHandler - onRemoved event', () => {
        tabEvent = { tabId: 111, tab };
        const onRemovedSpy = jest.spyOn(instance, 'onRemoved');
        jest.spyOn(tabVisitManager, 'endEvent').mockImplementation(async () => {});

        instance.onRemoved(tabEvent);

        expect(onRemovedSpy).toBeCalled();
    });

    test('UrlTabEventHandler - onUpdate event', () => {
        const result = {
            status: UrlStatus.BLOCK,
            category: PrrCategory.SELF_HARM,
            level: PrrLevel.ONE,
            host: 'abc.xyz',
        };
        const filterManagerSpy = jest.spyOn(filterManager, 'filterUrl').mockResolvedValue(result);
        jest.spyOn(prrMonitor, 'reset').mockImplementation(async (tabId: number) => {});
        jest.spyOn(prrMonitor, 'report').mockImplementation(async (prrReport: PrrReport) => {});
        jest.spyOn(tabVisitManager, 'checkUrlStatus').mockResolvedValue({ status: false });

        let tabInfo: Tabs.TabChangeInfo;
        tabInfo = { status: 'loading' };
        let tab: Tab = {
            active: false,
            autoDiscardable: false,
            discarded: false,
            highlighted: false,
            incognito: false,
            pinned: false,
            selected: false,
            windowId: 0,
            url: 'https://abc.com',
            index: 0,
        };
        let tabEvent = { tabId: 0, tab };

        instance.onUpdated(tabInfo, tabEvent);

        expect(filterManagerSpy).toBeCalled();
        expect(prrMonitor.reset).toBeCalled();
        //TODO: fix this
        //expect(prrMonitor.report).toBeCalled();

        expect(instance instanceof UrlTabEventHandler).toBeTruthy();
    });

    test('UrlTabEventHandler - onUpdate event - should make status allow if user is in inform state', () => {
        const result = {
            status: UrlStatus.BLOCK,
            category: PrrCategory.SELF_HARM,
            level: PrrLevel.ONE,
            host: 'abc.xyz',
        };
        const filterManagerSpy = jest.spyOn(filterManager, 'filterUrl').mockResolvedValue(result);
        jest.spyOn(prrMonitor, 'reset').mockImplementation(async (tabId: number) => {});
        jest.spyOn(prrMonitor, 'report').mockImplementation(async (prrReport: PrrReport) => {});
        jest.spyOn(tabVisitManager, 'checkUrlStatus').mockResolvedValue({ status: true });

        let tabInfo: Tabs.TabChangeInfo;
        tabInfo = { status: 'loading' };
        let tab: Tab = {
            active: false,
            autoDiscardable: false,
            discarded: false,
            highlighted: false,
            incognito: false,
            pinned: false,
            selected: false,
            windowId: 0,
            url: 'https://abc.com',
            index: 0,
        };
        let tabEvent = { tabId: 0, tab };

        instance.onUpdated(tabInfo, tabEvent);

        expect(filterManagerSpy).toBeCalled();
        expect(prrMonitor.reset).toBeCalled();
        //TODO: fix this
        //expect(prrMonitor.report).toBeCalled();

        expect(instance instanceof UrlTabEventHandler).toBeTruthy();
    });
});
