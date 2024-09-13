import { embedContent } from '@shared/chrome/tabs/AIPopupScripts';
import { Logger } from '@shared/logging/ConsoleLogger';
import { ReduxStorage } from '@shared/types/ReduxedStorage.type';
import { PrrCategory } from '@shared/types/PrrCategory';
import { PrrLevel } from '@shared/types/PrrLevel';

export type BlockResult = {
    category: PrrCategory;
    level: PrrLevel;
    host: string;
    ai: boolean;
    status: string;
    eventId?: string;
};

export class ChromeTabHelper {
    constructor(private readonly logger?: Logger, private readonly store?: ReduxStorage) {}

    /**
     *
     * @param tabId
     * @param updateProperties
     * @param callback
     */
    redirect = (tabId: number, updateProperties: UpdateProperties, callback?: () => Promise<void>) => {
        chrome.tabs.update(tabId, updateProperties, callback);
    };

    displayPopup = (tabId: number, blockResult: BlockResult) => {
        blockResult.status = 'inform';
        // all code needs to be contained inside of function
        // @ts-ignore
        chrome.scripting.executeScript(
            {
                target: { tabId },
                func: embedContent,
                args: [blockResult, tabId],
            },
            () => {}
        );
    };

    close = (tabId: number) => {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const myself = this;
        chrome.tabs.query({}, function (tabs) {
            let counter = 0;
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i]?.url?.startsWith(myself.getPRRBlockPage())) {
                    counter++;
                    if (counter === tabs.length) {
                        chrome.tabs.create({});
                    }
                    const tabId = tabs[i].id;
                    if (tabId) {
                        chrome.tabs.remove(tabId);
                    }
                }
            }
            // just to make sure that target tab is closed
            if (counter === 0) {
                if (tabs.length === 1) {
                    chrome.tabs.create({});
                }
                chrome.tabs.remove(tabId);
            }
        });
    };

    private getPRRBlockPage(): string {
        return 'chrome-extension://' + chrome.runtime.id + '/src/pages/ui-prr/index.html';
    }
    create(url: string) {
        let counter = 0;
        chrome.tabs.query({}, function (tabs) {
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i]?.url?.startsWith(url)) {
                    counter++;
                    break;
                }
            }
            // just to make sure that target tab is closed
            if (counter === 0) {
                chrome.tabs.create({ url });
            }
        });
    }

    createIfNotOpened(url: string) {
        let counter = 0;
        chrome.tabs.query({ url }, function (tabs) {
            if (tabs.length === 0) {
                chrome.tabs.create({ url });
            }
        });
    }

    getTab(tabId: number) {
        let tab = undefined;
        chrome.tabs.query({}, (tabs) => {
            for (let i = 0; i < tabs.length; i++) {
                if (tabId === tabs[i].id) {
                    tab = tabs[i];
                }
            }
        });
        return tab;
    }
}

export type UpdateProperties = {
    pinned?: boolean;
    openerTabId?: number;
    url?: string;
    highlighted?: boolean;
    active?: boolean;
    selected?: boolean;
    muted?: boolean;
    autoDiscardable?: boolean;
};
