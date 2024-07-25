import { Logger } from '../../../../shared/logging/ConsoleLogger';
import { ReduxStorage } from '../../../../shared/types/ReduxedStorage.type';
import { TabEventHandler } from '../handler/TabEventHandler';

export type TabEvent = {
    tabId?: number;
    tab?: chrome.tabs.Tab;
};

/**
 *
 */
export type EventManager = {
    onActivated: (activeInfo: chrome.tabs.TabActiveInfo, tabEvent: TabEvent) => void;
    onCreated: (tabEvent: TabEvent) => void;
    onRemoved: (tabEvent: TabEvent) => void;
    onUpdated: (tabInfo: chrome.tabs.TabChangeInfo, tabEvent: TabEvent) => void;
};

export class TabEventManager implements EventManager {
    constructor(private readonly logger: Logger, private readonly store: ReduxStorage, private readonly eventHandlers: TabEventHandler[]) {}

    onActivated = (activeInfo: chrome.tabs.TabActiveInfo, tabEvent: TabEvent): void => {
        this.eventHandlers.forEach((eventHandler) => {
            void eventHandler.onActivated(activeInfo);
        });
    };

    onCreated = (tabEvent: TabEvent): void => {
        this.eventHandlers.forEach((eventHandler) => {
            eventHandler.onCreated(tabEvent);
        });
    };

    onRemoved = (tabEvent: TabEvent): void => {
        this.eventHandlers.forEach((eventHandler) => {
            eventHandler.onRemoved(tabEvent);
        });
    };

    onUpdated = (tabInfo: chrome.tabs.TabChangeInfo, tabEvent: TabEvent): void => {
        this.eventHandlers.forEach((eventHandler) => {
            void eventHandler.onUpdated(tabInfo, tabEvent);
        });
    };
}
