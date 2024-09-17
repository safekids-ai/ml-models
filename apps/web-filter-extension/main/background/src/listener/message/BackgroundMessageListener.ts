import {ChromeTabHelper} from '@shared/chrome/tabs/ChromeTabHelper';
import {Logger} from '@shared/logging/ConsoleLogger';
import {PredictionRequestHandler} from './handler/PredictionRequestHandler';
import {EventType, MessageTypes} from '@shared/types/message_types';
import {onBoardingStatus} from '@shared/types/onBoardingStatus.type';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {FilterManager} from '../../filter/ContentFilterManager';
import {PrrMonitor, PrrReport} from '../../prr/monitor/PrrMonitor';
import {PrrReportManager} from '../../prr/PrrReportManager';
import {ActivityService} from '../../services/ActivityService';
import {AuthenticationService} from '../../services/AuthenticationService';
import {CategoryService} from '../../services/CategoryService';
import {OnBoardingService} from '../../services/OnBoardingService';
import {PRRActionService} from '../../services/PRRActionService';
import {UserService} from '../../services/UserService';
import {InformEventHandler} from '../../event/handler/InformEventHandler';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';

export type MessageListener = {
  onMessage: (request: MessageTypes, sender: chrome.runtime.MessageSender, callback: any) => Promise<boolean>;
};

export class BackgroundMessageListener implements MessageListener {
  constructor(
    private readonly logger: Logger,
    private readonly store: ReduxStorage,
    private readonly activityService: ActivityService,
    private readonly chromeTabHelper: ChromeTabHelper,
    private readonly chromeUtils: ChromeUtils,
    private readonly contentFilterManager: FilterManager,
    private readonly prrReportManager: PrrReportManager,
    private readonly prrMonitor: PrrMonitor,
    private readonly predictionRequestHandler: PredictionRequestHandler,
    private readonly authenticationService: AuthenticationService,
    private readonly onBoardingService: OnBoardingService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly prrActionService: PRRActionService,
    private readonly tabVisitManager: InformEventHandler
  ) {
  }

  onMessage = async (message: MessageTypes, sender: chrome.runtime.MessageSender): Promise<any> => {
    this.logger.debug(`Background Message Listener: ${JSON.stringify(message)}`);

    if (message.type !== (EventType.LOGIN || EventType.GET_ONBOARDING_STATUS || EventType.SAVE_ONBOARDING_STATUS)) {
      const subscriptionStatus = await this.chromeUtils.getSubscriptionStatus();
      this.logger.log(`onMessage -> subscription status; ${subscriptionStatus}`);
      if (subscriptionStatus === false) {
        return false;
      }
    }

    switch (message.type) {
      case EventType.LOGIN:
        return await this.authenticationService.login(message.accessCode ? message.accessCode : '');
      case EventType.GET_ONBOARDING_STATUS:
        return await this.onBoardingService.getOnboardingStatus();

      case EventType.SAVE_ONBOARDING_STATUS:
        const payload: onBoardingStatus = {status: message.status, step: message.step};
        return await this.onBoardingService.saveOnboardingStatus(payload);

      case EventType.ANALYZE_IMAGE:
      case EventType.ANALYZE_TEXT:
        return await this.predictionRequestHandler.onRequest(message.value, sender);
      case EventType.PAGE_VISIT:
        this.activityService.savePageVisit(message);
        break;
      case EventType.TITLE_CLICK:
        this.activityService.saveTitleClick(message);
        break;
      case EventType.WEB_SEARCH:
        this.activityService.saveWebSearch(message.host ? message.host : '');
        break;
      case EventType.END_TAB_EVENT:
        this.tabVisitManager.endEvent(this.checkTabId(sender.tab?.id));
        break;
      case EventType.CLOSE_TAB:
        this.chromeTabHelper.close(this.checkTabId(sender.tab?.id));
        this.prrMonitor.reset(this.checkTabId(sender.tab?.id));
        this.tabVisitManager.endEvent(this.checkTabId(sender.tab?.id));
        break;
      case EventType.PRR_TRIGGER:
        const prrReport: PrrReport = this.prrReportManager.getReport(this.checkTabId(sender.tab?.id));
        this.activityService.prrTriggered(prrReport);
        break;
      case EventType.REDIRECT:
        this.chromeTabHelper.redirect(this.checkTabId(sender.tab?.id), {url: message.host});
        break;
      case EventType.REPORT_NOTIFICATION:
        this.activityService.sendTeacherMessage(this.checkTabId(sender.tab?.id), message);
        break;
      case EventType.CHECK_HOST:
        return await this.contentFilterManager.filterUrl(sender.url ? sender.url : '');
      case EventType.LET_US_KNOW:
        this.activityService.reportEvent(message, this.checkTabId(sender.tab?.id));
        this.activityService.reportFalsePositiveReport(sender.tab?.id).catch((e) => {
          this.logger.error(`Error occurred while saving false positive report. ${e}`);
        });
        break;
      case EventType.TELL_ME_MORE:
        this.activityService.reportEvent(message, this.checkTabId(sender.tab?.id));
        break;
      case EventType.TAKE_ME_BACK:
        this.activityService.reportEvent(message, this.checkTabId(sender.tab?.id));
        break;
      case EventType.DELETE_EXTENSION:
        chrome.management.uninstallSelf();
        break;
      case EventType.LIMIT_ACCESS:
        this.userService.updateAccess(message.value, message.category);
        break;
      case EventType.PING:
        return {message: 'success'};

      case EventType.GET_PARENT_LIST:
        return await this.userService.getParentsList();

      case EventType.UPDATE_CATEGORIES:
        return await this.categoryService.updateCategories(message.category);

      case EventType.UPDATE_CATEGORIES_TIME:
        return await this.categoryService.updateCategoriesTime(message.categories, message.offtime);

      case EventType.PRR_INFORM_AI_ACTION:
        return await this.prrActionService.informAIAction(message.payload, this.checkTabId(sender.tab?.id));

      case EventType.PRR_REMOVE_AI_SCREEN:
        return await this.prrActionService.removeAIScreen(this.checkTabId(sender.tab?.id));

      case EventType.PRR_INFORM_ACTION:
        return await this.prrActionService.informAction(message.payload, this.checkTabId(sender.tab?.id));

      case EventType.PRR_ASK_ACTION:
        return await this.prrActionService.askAction(message.payload);

      case EventType.PRR_CRISIS_ACTION:
        return await this.prrActionService.crisisAction(message.payload, this.checkTabId(sender.tab?.id));

      default:
        break;
    }
    return true;
  };

  checkTabId = (tabId: number | undefined): number => {
    if (!tabId) {
      throw new Error('unable to fetch chrome tab Id in BackgroundMessageListener');
    }
    return tabId;
  };
}
