import {ChromeHelperFactory} from '@shared/chrome/factory/ChromeHelperFactory';
import {Logger} from '@shared/logging/ConsoleLogger';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {QueueTabEventHandler} from '../event/handler/QueueTabEventHandler';
import {TabEventHandler} from '../event/handler/TabEventHandler';
import {UrlTabEventHandler} from '../event/handler/UrlTabEventHandler';
import {TabEventManager} from '../event/manager/TabEventManager';
import {FilterManager} from '../filter/ContentFilterManager';
import {QueueWrapper} from '@shared/queue/QueueWrapper';
import {PrrMonitor} from '../prr/monitor/PrrMonitor';
import {PrrReportManager} from '../prr/PrrReportManager';
import {EventType} from '@shared/types/message_types';
import {Initializer} from './Initializer';
import {InformEventHandler} from '../event/handler/InformEventHandler';
import {UserService} from '../services/UserService';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';

export class EventHandlerInitializer implements Initializer {
  private readonly handlers: TabEventHandler[] = [];
  private readonly tabEventManager: TabEventManager;

  constructor(
    private readonly store: ReduxStorage,
    private readonly logger: Logger,
    private readonly queue: QueueWrapper,
    private readonly filterManager: FilterManager,
    private readonly prrReportManager: PrrReportManager,
    private readonly urlPrrMonitor: PrrMonitor,
    private readonly mlPrrMonitor: PrrMonitor,
    private readonly chromeHelperFactory: ChromeHelperFactory,
    private readonly tabVisitManager: InformEventHandler,
    private readonly userService: UserService
  ) {
    // TODO:  change initializers implementation. not clean right now
    this.generateEventHandlers();
    this.tabEventManager = new TabEventManager(this.logger, this.store, this.handlers);
  }

  async init(): Promise<boolean> {
    const myself: EventHandlerInitializer = this;
    /* istanbul ignore next */
    chrome.tabs.onCreated.addListener(function (tab) {
      myself.tabEventManager.onCreated({tab});
    });

    // When user closed tab
    /* istanbul ignore next */
    chrome.tabs.onRemoved.addListener(function (tabId) {
      myself.tabEventManager.onRemoved({tabId});
    });

    // When user went to new url in same domain
    /* istanbul ignore next */
    chrome.tabs.onUpdated.addListener(async function (tabId, tabInfo, tab) {
      const subscription = await myself.chromeHelperFactory.getChromeUtils().getSubscriptionStatus();
      myself.logger.log(`chrome.tabs.onUpdated.addListener -> subscription status: ${subscription}`);
      if (subscription === false) {
        return;
      }

      if (tab.url !== undefined && tabInfo.status === 'loading') {
        myself.tabEventManager.onUpdated(tabInfo, {tab, tabId});
      }
    });

    // When user selected tab as active
    /* istanbul ignore next */
    chrome.tabs.onActivated.addListener(function (activeInfo) {
      myself.tabEventManager.onActivated(activeInfo, {});
    });

    const extId = import.meta.env.WATCHDOG_EXTENSION_ID as string;
    const loginData = await ChromeCommonUtils.getUserCredentials();
    const jwtToken = await ChromeCommonUtils.getJWTToken();

    this.sendAccessCode(extId, loginData.accessCode, jwtToken);

    /* istanbul ignore next */
    chrome.runtime.onMessageExternal.addListener((message: any, sender: chrome.runtime.MessageSender) => {
      this.logger.debug('request received from watchdog');
      if (sender.id === extId) {
        if (message.status === EventType.REQUEST_CREDENTIALS) {
          this.sendAccessCode(extId, loginData.accessCode, jwtToken);
        } else if (message.status === EventType.REQUEST_CREDENTIALS_AFTER_UPDATE) {
          this.sendAccessCodeAfterUpdate(extId, loginData.accessCode, jwtToken);
        }
      }
    });

    /* istanbul ignore next */
    chrome.management.onDisabled.addListener((info) => {
      if (info.id === extId) {
        this.userService.notifyParents();
      }
    });

    /* istanbul ignore next */
    chrome.management.onEnabled.addListener((info) => {
      if (info.id === extId) {
        this.sendAccessCode(extId, loginData.accessCode, jwtToken);
      }
    });

    /* istanbul ignore next */
    chrome.management.onUninstalled.addListener((id) => {
      if (id === extId) {
        this.userService.notifyParents();
      }
    });

    return true;
  }

  public sendAccessCode = (extId: string, accessCode: string, jwtToken: string) => {
    /* istanbul ignore next */
    chrome.runtime.sendMessage(extId, {status: EventType.UPDATE_CREDENTIALS, accessCode, jwtToken}, () => {
      this.logger.info('sent update credentials message to watchdog');
      if (chrome.runtime.lastError) {
        this.logger.info('unable to find companion extension');
      }
    });
  };

  public sendAccessCodeAfterUpdate = (extId: string, accessCode: string, jwtToken: string) => {
    /* istanbul ignore next */
    chrome.runtime.sendMessage(
      extId,
      {
        status: EventType.UPDATE_CREDENTIALS_AFTER_UPDATE,
        accessCode,
        jwtToken,
      },
      () => {
        this.logger.info('sent update credentials after update message to watchdog');
        if (chrome.runtime.lastError) {
          this.logger.info('unable to find companion extension');
        }
      }
    );
  };

  /**
   * Generates list of handlers that will server tab events
   * @return array of chrome tab event handlers
   */
  private generateEventHandlers(): void {
    const urlEventHandler = new UrlTabEventHandler(this.logger, this.store, this.filterManager, this.urlPrrMonitor, this.tabVisitManager);
    const queueEventHandler = new QueueTabEventHandler(
      this.logger,
      this.chromeHelperFactory.getChromeUtils(),
      this.chromeHelperFactory.getTabHelper(),
      this.queue,
      this.mlPrrMonitor
    );
    this.handlers.push(urlEventHandler);
    this.handlers.push(queueEventHandler);
  }
}
