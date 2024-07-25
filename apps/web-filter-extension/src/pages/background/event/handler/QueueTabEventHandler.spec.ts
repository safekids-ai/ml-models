import { ConsoleLogger, Logger } from '../../../../../src/shared/logging/ConsoleLogger';
import { QueueTabEventHandler } from '../../../../../src/pages/background/event/handler/QueueTabEventHandler';
import { TabEventHandler } from '../../../../../src/pages/background/event/handler/TabEventHandler';
import { Tabs } from 'jest-chrome/types/jest-chrome';
import { PrrReportManager } from '../../../../../src/pages/background/prr/PrrReportManager';
import { QueueWrapper } from '../../../../../src/pages/background/model/queue/QueueWrapper';
import { ChromeUtils } from '../../../../../src/shared/chrome/utils/ChromeUtils';
import { ChromeTabHelper } from '../../../../../src/shared/chrome/tabs/ChromeTabHelper';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { PrrReports } from '../../../../../src/shared/prr/PrrReports';
import { mock } from 'ts-mockito';
import Tab = chrome.tabs.Tab;
import { PrrMonitor } from '../../../../../src/pages/background/prr/monitor/PrrMonitor';

describe('QueueTabEventHandler', () => {
    let instance: TabEventHandler;
    const logger: Logger = mock(ConsoleLogger);
    const store = TestUtils.buildSettingsState();
    const chromeUtils: ChromeUtils = mock<ChromeUtils>();
    const chromeTabHelper = new ChromeTabHelper(logger, store);
    const queueWrapper: QueueWrapper = mock<QueueWrapper>();
    const prrReports = new PrrReports();
    const prrMonitor = mock<PrrMonitor>();

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

    beforeEach(() => {
        instance = new QueueTabEventHandler(logger, chromeUtils, chromeTabHelper, queueWrapper, prrMonitor);
    });

    test('QueueTabEventHandler - onActivated event', () => {
        const onActivatedSpy = jest.spyOn(instance, 'onActivated');
        let tabInfo: Tabs.TabActiveInfo;
        tabInfo = { tabId: 0, windowId: 0 };

        instance.onActivated(tabInfo);

        expect(onActivatedSpy).toBeCalled();
    });

    test('QueueTabEventHandler - onCreated event', () => {
        const onCreatedSpy = jest.spyOn(instance, 'onCreated');
        let tabInfo: Tabs.TabActiveInfo;
        tabInfo = { tabId: 0, windowId: 0 };

        instance.onCreated(tabInfo);

        expect(onCreatedSpy).toBeCalled();
    });

    test('QueueTabEventHandler - onRemoved event', () => {
        const onRemovedSpy = jest.spyOn(instance, 'onRemoved');
        let tabInfo: Tabs.TabActiveInfo;
        tabInfo = { tabId: 0, windowId: 0 };

        instance.onRemoved(tabInfo);

        expect(onRemovedSpy).toBeCalled();
    });

    test('QueueTabEventHandler - onUpdated event', () => {
        const onUpdatedSpy = jest.spyOn(instance, 'onUpdated');
        let tabInfo: Tabs.TabChangeInfo;
        tabInfo = { status: 'loading' };

        instance.onUpdated(tabInfo, tabEvent);

        expect(onUpdatedSpy).toBeCalled();
    });
});
