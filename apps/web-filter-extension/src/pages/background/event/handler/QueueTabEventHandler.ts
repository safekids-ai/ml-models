import { ChromeUtils } from '../../../../shared/chrome/utils/ChromeUtils';
import { QueueWrapper } from '../../model/queue/QueueWrapper';
import { PrrReportManager } from '../../prr/PrrReportManager';
import { TabEvent } from '../manager/TabEventManager';
import { DEFAULT_TAB_ID } from '../../model/queue/QueueBase';
import { TabEventHandler } from './TabEventHandler';
import { Logger } from '../../../../shared/logging/ConsoleLogger';
import { ChromeTabHelper } from '../../../../shared/chrome/tabs/ChromeTabHelper';

import { MLPrrMonitor } from '../../prr/monitor/MLPrrMonitor';
import { PrrMonitor } from '../../prr/monitor/PrrMonitor';

/**
 * This class handles tab events for ML Queue
 */
export class QueueTabEventHandler implements TabEventHandler {
    constructor(
        private logger: Logger,
        private readonly chromeUtils: ChromeUtils,
        private readonly chromeTabHelper: ChromeTabHelper,
        private readonly queue: QueueWrapper,
        private readonly prrMonitor: PrrMonitor
    ) {}

    async onActivated(activeInfo: chrome.tabs.TabActiveInfo): Promise<void> {
        this.queue.setActiveTabId(activeInfo.tabId);
    }

    onCreated(tabEvent: TabEvent): void {
        const tabIdUrl = this.chromeUtils.buildTabIdUrl(tabEvent.tab);
        this.queue.addTabIdUrl(tabIdUrl);
    }

    onRemoved(tabEvent: TabEvent): void {
        this.queue.clearByTabId(tabEvent.tab?.id);
    }

    async onUpdated(tabInfo: chrome.tabs.TabChangeInfo, tabEvent: TabEvent): Promise<void> {
        if (tabInfo.status === 'loading') {
            const tabIdUrl = this.chromeUtils.buildTabIdUrl(tabEvent.tab);
            this.queue.updateTabIdUrl(tabIdUrl);
            if (!!tabEvent?.tab?.url && !(tabEvent.tab?.url.startsWith('chrome-extension:') || tabEvent.tab?.url.startsWith('chrome:'))) {
                this.prrMonitor.reset(tabEvent.tab?.id as number);
            }
        }
    }
}
