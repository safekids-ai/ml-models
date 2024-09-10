import {DEFAULT_TAB_ID, TabIdUrl} from '@pages/background/model/queue/QueueBase';
import {Credentials} from '@src/shared/types/message_types';
import {ChromeStorageManager} from '@src/shared/chrome/storage/ChromeStorageManager';
import moment from 'moment';
import Manifest = chrome.runtime.Manifest;
import {Logger} from '@src/shared/logging/ConsoleLogger';

export class ChromeUtils {
  constructor(private readonly logger: Logger, private readonly localStorageManager: ChromeStorageManager) {
  }

  buildTabIdUrl = (tab: chrome.tabs.Tab | undefined): TabIdUrl => {
    return {
      tabId: tab?.id ? tab.id : DEFAULT_TAB_ID,
      tabUrl: tab?.url ? tab?.url : `${DEFAULT_TAB_ID}`,
    };
  };

  prrPageUrl = (blockPRRModel?: any) => {
    const url = 'chrome-extension://' + chrome.runtime.id + '/src/pages/ui-prr/index.html';
    if (blockPRRModel) {
      let prrUrl = `${url}?ai=${blockPRRModel.ai}&status=${blockPRRModel.status}&category=${blockPRRModel.category.toUpperCase()}&level=${
        blockPRRModel.level
      }&host=${blockPRRModel.host}`;
      if (blockPRRModel.eventId) {
        prrUrl = prrUrl + `&eventId=${blockPRRModel.eventId}`;
      }
      return prrUrl;
    }
    return url;
  };

  saveLoginCredentials = async (accessCode: string, jwtToken: string, userDeviceLinkId: string, status: boolean): Promise<void> => {
    await this.localStorageManager.set({credentials: {accessCode}});
    await this.localStorageManager.set({jwtToken});
    await this.localStorageManager.set({userDeviceLinkId});
    await this.localStorageManager.set({extensionStatus: status});
  };

  setExtensionStatus = async (status: boolean): Promise<void> => {
    await this.localStorageManager.set({extensionStatus: status});
  };

  getUserCredentials = async (): Promise<Credentials> => {
    const credentials = await this.localStorageManager.get('credentials');
    if (credentials === undefined) {
      return {accessCode: ''};
    }
    return credentials;
  };

  promiseChrome = async (callback: any): Promise<any> => {
    /* return await new Promise((resolve) => {
        callback(resolve);
    }); */
    return await new Promise((resolve, reject) => {
      resolve(callback);
    });
  };

  getAccessCode = async (): Promise<any> => {
    return await this.localStorageManager.get('accessCode');
  };

  async getJWTToken(): Promise<any> {
    return await this.localStorageManager.get('jwtToken');
  }

  getManifest = (): Manifest => {
    return chrome.runtime.getManifest();
  };

  async sendMessage(message: any, callback?: (data?: any) => void): Promise<void> {
    if (callback != null) {
      chrome.runtime.sendMessage(message, callback);
    } else {
      chrome.runtime.sendMessage(message);
    }
  }

  async send(message: any, callback?: any): Promise<void> {
    if (callback != null) {
      chrome.runtime.sendMessage(message, (response) => {
        callback(message, response);
      });
    } else {
      chrome.runtime.sendMessage(message);
    }
  }

  getInformUrls = async () => {
    return await this.localStorageManager.get('prrInformUrlsArr');
  };

  setInformUrls = async (urlsArr: []): Promise<void> => {
    await this.localStorageManager.set({prrInformUrlsArr: urlsArr});
  };

  getPrr1Counter = async () => {
    return await this.localStorageManager.get('prr1Counter');
  };

  setPrr1Counter = async (counter: number): Promise<void> => {
    await this.localStorageManager.set({prr1Counter: counter});
  };

  getSubscriptionStatus = async () => {
    return await this.localStorageManager.get('subscriptionStatus');
  };

  setSubscriptionStatus = async (status: boolean) => {
    await this.localStorageManager.set({subscriptionStatus: status});
  };

  checkInformUrlStatus = async (requestUrl: string | undefined): Promise<boolean> => {
    let urlsArr: [] = await this.getInformUrls();
    this.logger.log(`Check Inform urls (${requestUrl}) with saved list: ${JSON.stringify(urlsArr)}`);
    let isExist = false;
    urlsArr?.find((url: any, index: number) => {
      if (url === requestUrl) {
        urlsArr.splice(index, 1);
        this.setInformUrls(urlsArr);
        isExist = true;
        return url;
      }
    });
    this.logger.log(`Inform urls (${requestUrl}) exists with staus: ${isExist}`);
    return isExist;
  };
}
