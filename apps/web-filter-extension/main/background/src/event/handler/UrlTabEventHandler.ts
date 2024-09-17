import {Logger} from '@shared/logging/ConsoleLogger';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {FilterManager} from '../../filter/ContentFilterManager';
import {PrrMonitor, PrrReport} from '../../prr/monitor/PrrMonitor';
import {TabEvent} from '../manager/TabEventManager';
import {TabEventHandler} from './TabEventHandler';
import {UrlStatus} from '@shared/types/UrlStatus';
import {PrrTrigger} from '@shared/types/message_types';
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import {InformEventHandler} from './InformEventHandler';
import {HttpUtils} from '@shared/utils/HttpUtils';

/**
 * Handles Tab events related to URL changes
 */
export class UrlTabEventHandler implements TabEventHandler {
  constructor(
    private logger: Logger,
    private store: ReduxStorage,
    private readonly filterManager: FilterManager,
    private readonly prrMonitor: PrrMonitor,
    private readonly tabVisitManager: InformEventHandler
  ) {
  }

  async onActivated(activeInfo: chrome.tabs.TabActiveInfo): Promise<void> {
    this.prrMonitor.reset(activeInfo.tabId);
  }

  onCreated(tabEvent: TabEvent): void {
  }

  onRemoved(tabEvent: TabEvent): void {
    if (tabEvent.tabId) {
      this.tabVisitManager.endEvent(tabEvent.tabId);
    }
  }

  async onUpdated(tabInfo: TabChangeInfo, tabEvent: TabEvent): Promise<void> {
    if (tabInfo.status === 'loading') {
      if (!!tabEvent?.tab?.url && !(tabEvent.tab?.url.startsWith('chrome-extension:') || tabEvent.tab?.url.startsWith('chrome:'))) {
        this.prrMonitor.reset(tabEvent.tab?.id as number);
      }
    }
    this.logger.log(`onUpdated - url-> ${tabEvent.tab?.url ? tabEvent.tab.url : 'url does not exist'}`);
    const result = await this.filterManager.filterUrl(tabEvent.tab?.url ? tabEvent.tab.url : '');
    const informUrlExists = await this.tabVisitManager.checkUrlStatus(tabEvent.tab?.id, tabEvent.tab?.url);
    this.logger.log(`Should set ALLOW----: ${informUrlExists.status}, for host: ${tabEvent.tab?.url}`);
    if (informUrlExists.status) {
      result.status = UrlStatus.ALLOW;
    }
    //add in the queue ->
    if (result.status !== UrlStatus.ALLOW) {
      const prrReport: PrrReport = {
        category: result.category,
        fullWebUrl: tabEvent.tab?.url,
        level: result.level,
        prrTriggerId: PrrTrigger.URL_INTERCEPTED,
        tabId: tabEvent.tab?.id ? tabEvent.tab?.id : -1,
        url: result.host,
        status: result.status,
        isAiGenerated: false,
        eventId: informUrlExists.eventId,
      };
      if (result.status === UrlStatus.INFORM) {
        prrReport.eventId = HttpUtils.generateInformUrlId(prrReport.url, tabEvent.tabId);
      }
      this.prrMonitor.report(prrReport);
    }
  }
}
