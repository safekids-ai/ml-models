import {TabEvent} from '../manager/TabEventManager';
import TabChangeInfo = chrome.tabs.TabChangeInfo;

export interface TabEventHandler {
  onActivated(activeInfo: chrome.tabs.TabActiveInfo): Promise<void>;

  onCreated(tabEvent: TabEvent): void;

  onRemoved(tabEvent: TabEvent): void;

  onUpdated(tabInfo: TabChangeInfo, tabEvent: TabEvent): Promise<void>;
}
