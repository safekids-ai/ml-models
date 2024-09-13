import 'reflect-metadata';

import {ContentFilterUtil} from "@shared/utils/content-filter/ContentFilterUtil"
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {Logger} from '@shared/logging/ConsoleLogger';
import {Credentials, EventType} from '@shared/types/message_types';
import {PrrCategory} from '@shared/types/PrrCategory';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {DOMFilterFactory} from '@content/dom/DOMFilterFactory';
import {DOMWatcher} from '@content/dom/DOMWatcher';
import {ImageFilter} from '@content/filter/ImageFilter';
import {TextFilter} from '@content/filter/TextFilter';
import {Bootstrapper} from "@shared/BootstrapperInterface";

/**
 * This class contains methods to bootstrap extension service worker
 */
export class ContentBootstrapper implements Bootstrapper {
  private domWatcher: DOMWatcher | undefined;

  constructor(
    private readonly store: ReduxStorage,
    private readonly logger: Logger,
    private readonly storageManager: LocalStorageManager,
    private readonly chromeUtils: ChromeUtils
  ) {
    this.domWatcher = undefined;
  }

  init = async (): Promise<void> => {
    if (this.store == null) {
      throw new Error('store not initialized');
    }
    // initialize when user is logged in
    const loginData: Credentials = await this.chromeUtils.getUserCredentials();
    if (loginData.accessCode !== '') {
      // initialize DOM Watcher
      this.initializeDOMWatcher();
    }
  };

  /**
   * initializes filters
   * @private
   */
  async initializeDOMWatcher(): Promise<void> {
    const {
      filterEffect,
      imageAnalyzeLimit,
      nlpAnalyzeLimit,
      mlProcessLimit,
      nlpProcessLimit,
      showClean,
      environment
    } = this.store.getState().settings;

    // initialize the Filters
    const imageFilter = new ImageFilter(this.logger);
    const textFilter = new TextFilter(this.logger);

    // set settings of image filter
    imageFilter.setSettings({
      filterEffect,
      analyzeLimit: imageAnalyzeLimit,
      processLimit: mlProcessLimit,
      environment,
    });

    // set settings of text filter
    textFilter.setSettings({
      filterEffect,
      analyzeLimit: nlpAnalyzeLimit,
      processLimit: nlpProcessLimit,
      showClean,
      environment,
    });

    const contentFilterUtils = new ContentFilterUtil(this.store, this.logger);
    const domFilterFactory = new DOMFilterFactory();
    const domFilter = domFilterFactory.getDOMFilter(window.location.host);
    // Initialize DOM watcher
    this.domWatcher = new DOMWatcher(document, window.location.host, this.logger, this.store, imageFilter, textFilter, domFilter, contentFilterUtils);

    //chrome.runtime.sendMessage({ type: EventType.CHECK_HOST }, this.enableWatcher);
    this.enableWatcher();
    this.logger.debug(`DOM Watcher is initialized...`);
  }

  enableWatcher = (): void => {
    this.domWatcher?.watch();
    this.domWatcher?.onLoad();
  };

  getDomWatcher = (): DOMWatcher | undefined => {
    return this.domWatcher;
  };
}
