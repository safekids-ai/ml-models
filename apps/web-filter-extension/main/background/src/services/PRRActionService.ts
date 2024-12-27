import {PrrInform} from '@shared/types/PrrInform.type';
import {PrrAsk} from '@shared/types/PrrAsk.type';
import {Logger} from '@shared/logging/ConsoleLogger';
import {FetchApiService, RESTService} from '@shared/rest/RestService';
import {PRR_INFORM_PARENT, PRR_ASK_PARENT, PRR_INFORM_AI_PARENT, PRR_CRISIS_AI_INFORM} from './endpoints';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {ChromeTabHelper} from '@shared/chrome/tabs/ChromeTabHelper';
import {HttpUtils} from '@shared/utils/HttpUtils';
import {removeContent} from '@shared/chrome/tabs/AIPopupScripts';
import {InformEventHandler} from '../event/handler/InformEventHandler';
import {PrrCrisis} from '@shared/types/PrrCrisis.type';

export type PRRActionService = {
  informAIAction: (informPayload: PrrInform, tabId: number) => Promise<any | void>;
  removeAIScreen: (tabId: number) => Promise<any | void>;
  informAction: (informPayload: PrrInform, tabId: number) => Promise<any | void>;
  askAction: (askPayload: PrrAsk) => Promise<any | void>;
  crisisAction: (crisisPayload: PrrCrisis, tabId: number) => Promise<any | void>;
};

export class PRRActionServiceImpl implements PRRActionService {
  constructor(
    private readonly logger: Logger,
    private readonly restService: RESTService,
    private readonly chromeUtils: ChromeUtils,
    private readonly chromeTabHelper: ChromeTabHelper,
    private readonly tabVisitManager: InformEventHandler
  ) {
  }

  async informAIAction(informPayload: PrrInform, tabId: number): Promise<void> {
    try {
      // all executed code needs to be contained inside of function
      // @ts-ignore
      chrome.scripting.executeScript(
        {
          target: {tabId},
          func: removeContent,
          args: [tabId],
        },
        () => {
        }
      );

      await this.prr1CounterDecrement();
      return await this.restService.doPost(PRR_INFORM_AI_PARENT, informPayload);
    } catch (error) {
      throw new Error(`An error occurred during inform AI action: ${error}`);
    }
  }

  async crisisAction(crisisPayload: PrrCrisis, tabId: number): Promise<boolean> {
    try {
      if (crisisPayload.choseToContinue === true) {
        // all executed code needs to be contained inside of function
        // @ts-ignore
        chrome.scripting.executeScript(
          {
            target: {tabId},
            func: removeContent,
            args: [tabId],
          },
          () => {
          }
        );
      }
      await this.restService.doPost(PRR_CRISIS_AI_INFORM, crisisPayload);
      return true;
    } catch (error) {
      throw new Error(`An error occurred while processing inform request: ${error}`);
    }
  }

  async removeAIScreen(tabId: number): Promise<void> {
    try {
      // all executed code needs to be contained inside of function
      // @ts-ignore
      chrome.scripting.executeScript(
        {
          target: {tabId},
          func: removeContent,
          args: [tabId],
        },
        () => {
        }
      );
    } catch (error) {
      throw new Error(`An error occurred during inform AI action: ${error}`);
    }
  }

  async informAction(informPayload: PrrInform, tabId: number): Promise<void> {
    try {
      if (!informPayload.ai) {
        this.tabVisitManager.reportEvent(tabId, informPayload.url, informPayload.eventId);
      }

      this.chromeTabHelper.redirect(tabId, {url: informPayload.url});
      await this.prr1CounterDecrement();
      return await this.restService.doPost(PRR_INFORM_PARENT, informPayload);
    } catch (error) {
      throw new Error(`An error occurred during inform action: ${error}`);
    }
  }

  async askAction(askPayload: PrrAsk): Promise<boolean> {
    try {
      await this.prr1CounterDecrement();
      await this.restService.doPost(PRR_ASK_PARENT, askPayload);
      return true;
    } catch (error) {
      throw new Error(`An error occurred while processing ask request: ${error}`);
    }
  }

  private async prr1CounterDecrement(): Promise<void> {
    let prr1Counter: number = await this.chromeUtils.getPrr1Counter();
    this.logger.log(`prr1Counter before decrement: ${prr1Counter}`);
    if (prr1Counter > 0) {
      prr1Counter -= 1;
      await this.chromeUtils.setPrr1Counter(prr1Counter);
    }
    this.logger.log(`prr1Counter after decrement: ${prr1Counter}`);
  }
}
