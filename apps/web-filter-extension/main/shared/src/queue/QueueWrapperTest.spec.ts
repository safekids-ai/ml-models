import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {TestUtils} from '../../../../../TestUtils';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {MLModel, ModelSettings} from '@shared/types/MLModel.type';
import {NLPBert} from '@safekids-ai/nlp-js-common';
import {mock} from 'ts-mockito';
import {Vision} from '@safekids-ai/vision-js-common';
import {NLPModel} from 'chrome-extension/src/background/model/NLPModel';
import {ImageModel} from 'chrome-extension/src/background/model/ImageModel';
import {MLModels} from '@shared/types/MLModels';
import {QueueWrapper} from '@shared/queue/QueueWrapper';
import Tab = chrome.tabs.Tab;

class QueueWrapperTest extends QueueWrapper {
  getCurrentTabIdUrls() {
    return this.currentTabIdUrls;
  }

  getActiveTab() {
    return this.activeTabId;
  }

  getLoadingQueue() {
    return this.loadingQueue;
  }

  getCache() {
    return this.cache;
  }

  getRequestMap() {
    return this.requestMap;
  }
}

describe('Queue Wrapper tests', () => {
  const store = TestUtils.buildSettingsState();
  const storageManager = new LocalStorageManager();
  const settings: ModelSettings = {filterStrictness: 70};
  const logger = new ConsoleLogger();
  const nlp: NLPBert = mock(NLPBert);
  const nlpModel = new NLPModel(nlp, logger);
  const chromeUtils = new ChromeUtils(logger, storageManager);
  const vision: Vision = mock(Vision);
  const imageModel = new ImageModel(vision, logger, settings);
  const models: Map<string, MLModel> = new Map<string, MLModel>();
  models.set(MLModels.NLP, nlpModel);
  models.set(MLModels.VISION, imageModel);

  let queueWrapper: QueueWrapperTest;

  beforeEach(async () => {
    queueWrapper = new QueueWrapperTest(models, logger, store);
  });

  it('Should add TabId Url', async () => {
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
      id: 1111,
    };
    const tabIdUrl = chromeUtils.buildTabIdUrl(tab);
    queueWrapper.addTabIdUrl(tabIdUrl);

    const urls = queueWrapper.getCurrentTabIdUrls();
    const url = urls.get(tabIdUrl.tabId);
    expect(url).toEqual(tabIdUrl.tabUrl);
  });

  it('Should update TabId Url', async () => {
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
      id: 1111,
    };
    let tabIdUrl = chromeUtils.buildTabIdUrl(tab);
    queueWrapper.addTabIdUrl(tabIdUrl);

    let urls = queueWrapper.getCurrentTabIdUrls();
    let url = urls.get(tabIdUrl.tabId);
    expect(url).toEqual('https://abc.com');

    tab.url = 'http://google.com';
    tabIdUrl = chromeUtils.buildTabIdUrl(tab);
    queueWrapper.updateTabIdUrl(tabIdUrl);

    urls = queueWrapper.getCurrentTabIdUrls();
    url = urls.get(tabIdUrl.tabId);
    expect(url).toEqual('http://google.com');
  });

  it('Should clear By TabId', async () => {
    // @ts-ignore
    let tab: Tab = {
      url: 'https://abc.com',
      id: 1111,
    };
    let tabIdUrl = chromeUtils.buildTabIdUrl(tab);
    queueWrapper.addTabIdUrl(tabIdUrl);

    queueWrapper.clearByTabId(tabIdUrl.tabId);

    const urls = queueWrapper.getCurrentTabIdUrls();
    const url = urls.get(tabIdUrl.tabId);
    expect(url).toBeFalsy();
  });

  it('Should set active tab', async () => {
    queueWrapper.setActiveTabId(111);

    let active = queueWrapper.getActiveTab();
    expect(active).toBeTruthy();
    expect(active).toEqual(111);
  });

  it('Should predict given text', async () => {
    let url = 'I want to do suicide';
    const loadingQueue = queueWrapper.getLoadingQueue();
    jest.spyOn(loadingQueue, 'add').mockImplementation(async () => {
      const fetchedUrl = queueWrapper.getRequestMap().get(url);
      if (fetchedUrl != null) {
        for (const [{resolve}] of fetchedUrl) {
          resolve(true);
        }
      }
    });
    // @ts-ignore
    let tab: Tab = {
      url: 'https://abc.com',
      id: 1111,
    };
    let tabIdUrl = chromeUtils.buildTabIdUrl(tab);
    let result = await queueWrapper.predict(url, tabIdUrl, MLModels.NLP);
    queueWrapper.predict(url, tabIdUrl, MLModels.NLP);
    expect(result).toBeTruthy();

    const cache = queueWrapper.getCache();
    cache.set(url, true);

    result = await queueWrapper.predict('I want to do suicide', tabIdUrl, MLModels.NLP);
    expect(result).toBeTruthy();

    queueWrapper.clearCache();
    expect(queueWrapper.getCache().has(url)).toBeFalsy();
  });
});
