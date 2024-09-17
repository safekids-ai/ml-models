import {LRUCache} from '@shared/cache/LRUCache';
import {Logger} from '@shared/logging/ConsoleLogger';
import {MLModel} from '@shared/types/MLModel.type';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';

export type requestQueueValue = Array<
  Array<{
    resolve: (value: boolean) => void;
    reject: (error: Error) => void;
  }>
>;

export type CallbackFunction = (err: unknown | undefined, result: unknown | undefined) => undefined;

type KeyType<T, K extends keyof T> = T[K];
export type TabIdUrl = { tabId: number; tabUrl: string };
export const DEFAULT_TAB_ID = 999999;

export class QueueBase {
  protected readonly models: Map<string, MLModel>;
  protected readonly logger: Logger;

  protected readonly store: ReduxStorage;
  protected readonly currentTabIdUrls: Map<KeyType<TabIdUrl, 'tabId'>, KeyType<TabIdUrl, 'tabUrl'>>;
  protected activeTabId: KeyType<TabIdUrl, 'tabId'>;
  protected readonly DEFAULT_TAB_ID: number;
  protected readonly requestMap: Map<string, requestQueueValue>;
  protected readonly cache: LRUCache<string, boolean>;

  protected totalBlocked: number = 0;

  constructor(models: Map<string, MLModel>, logger: Logger, store: ReduxStorage) {
    this.store = store;
    this.models = models;
    this.logger = logger;

    this.requestMap = new Map();
    this.DEFAULT_TAB_ID = DEFAULT_TAB_ID;
    this.activeTabId = this.DEFAULT_TAB_ID;
    this.currentTabIdUrls = new Map([[this.DEFAULT_TAB_ID, `${this.DEFAULT_TAB_ID}`]]);
    this.cache = new LRUCache(200);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  /* istanbul ignore next */
  protected _checkUrlStatus(url: string): boolean {
    if (!this.requestMap.has(url)) {
      this.logger.debug(`Cannot find image/text in requestMap where url is ${url}`);
      return false;
    }
    return true;
  }

  /* istanbul ignore next */
  protected _checkCurrentTabIdUrlStatus({tabId, tabUrl}: { tabId: number; tabUrl: string }): boolean {
    if (!this.currentTabIdUrls.has(tabId)) {
      return false; // user closed this tab id
    } else if (this.currentTabIdUrls.has(tabId) && tabUrl !== this.currentTabIdUrls.get(tabId)) {
      return false; // user's tab id matches current tab id, but url references to an another page
    } else {
      return true;
    }
  }
}
