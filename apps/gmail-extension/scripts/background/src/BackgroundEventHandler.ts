import MessageSender = chrome.runtime.MessageSender;
import {MessageId} from "../../common/types/MessageId";
import {
  EmailFeedbackEvent,
  EmailNotificationEvent,
  EventType,
  IDType,
  NLPFeedback,
  NLPRequestEvent,
  NLPResponse,
  ToxicStatusRequestEvent,
  ToxicStatusResponseEvent
} from "../../common/types/events.types";
import {ILogger} from "../../common/utils/Logger";
import {NLPResultCache} from "./cache/NLPResultCache";
import {NLPModelWrapperInterface} from "./model/NLPModelWrapperInterface";
import {EmailEventService} from "./api/emailEventService";
import {closeTab} from "./api/chromeUtil";
import {OnBoardingService} from "./api/onboarding";
import {EmailEvent} from "../../common/types/EmailEvent";

export class BackgroundEventHandler {
  private logger: ILogger;
  private nlpCache: NLPResultCache;
  private model: NLPModelWrapperInterface;
  private emailEventService: EmailEventService;

  public constructor(logger: ILogger, nlpCache: NLPResultCache, model: NLPModelWrapperInterface,
                     emailEventService: EmailEventService, private onboardingService: OnBoardingService) {
    this.logger = logger;
    this.nlpCache = nlpCache;
    this.model = model;
    this.emailEventService = emailEventService
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onMessage(message: any, sender: MessageSender, callback: any): boolean {
    if (message.type === MessageId.NLP_EMAIL_EVENT) {
      const emailEvent = message.val as EmailEvent;
      const {email, eventType} = emailEvent;
      let id: string | null = null;
      let idType: IDType | null = null;
      let text: string | undefined | null = null;
      let toxicWordMatch = false;
      const maxWords = 300;

      switch (eventType) {
        case EventType.EMAIL_THREAD_READ_EVENT: {
          id = (email.threadId) ? email.threadId : null;
          idType = IDType.THREAD_VIEW;
          text = email.subject;
          toxicWordMatch = false;
          break;
        }
        case EventType.EMAIL_READ_EVENT : {
          id = (email.messageId) ? email.messageId : null;
          idType = IDType.MESSAGE_VIEW;
          text = email.subject + "." + email.body;
          toxicWordMatch = true;
          break;
        }
        default : {
          throw new Error(`Unknown event type received : ${JSON.stringify(emailEvent)}`);
        }
      }

      const cacheID = (id && idType != null) ? BackgroundEventHandler.getTrimmedID(id, idType) : null;
      const cacheResult: NLPResponse | null = this.getCacheResult(cacheID);
      const nlpRequest = new NLPRequestEvent(id, idType, text, maxWords, toxicWordMatch);

      if (cacheResult) {
        callback(cacheResult);
        return true;
      }

      this.getModelResult(cacheID, nlpRequest).then(result => {
        callback(result)
      })
    } else if (message.type === MessageId.GET_ML_TOXIC_STATUS) {
      const request = message.val as ToxicStatusRequestEvent;
      const ids = request.ids;
      const ret: boolean[] = [];
      for (let i = 0; i < ids.length; i++) {
        const cacheThreadID = BackgroundEventHandler.getTrimmedID(ids[i], IDType.THREAD_VIEW);
        const cacheMessageID = BackgroundEventHandler.getTrimmedID(ids[i], IDType.MESSAGE_VIEW);
        let mlFlag: boolean = false;
        if (cacheThreadID) {
          mlFlag = mlFlag || this.nlpCache.isToxicML(cacheThreadID);
        }
        if (cacheMessageID) {
          mlFlag = mlFlag || this.nlpCache.isToxicML(cacheMessageID);
        }
        ret.push(mlFlag);
      }
      callback(new ToxicStatusResponseEvent(ret));
      return true;
    } else if (message.type === MessageId.GET_NLP_CtoB) {
      const request = message.val as NLPRequestEvent;
      const id = request.id;
      const idType = request.idType;
      const cacheID = (id && idType != null) ? BackgroundEventHandler.getTrimmedID(id, idType) : null;
      const cacheResult: NLPResponse | null = this.getCacheResult(cacheID);

      if (cacheResult) {
        callback(cacheResult);
        return true;
      }
      this.getModelResult(cacheID, request).then(result => {
        callback(result)
      })
    } else if (message.type === MessageId.MESSAGE_REVIEW_CtoB) {
      const request = message.val as EmailFeedbackEvent;
      const threadID = (request.threadID) ? BackgroundEventHandler.shortenID(request.threadID) : null;
      const messageID = (request.messageID) ? BackgroundEventHandler.shortenID(request.messageID) : null;
      const email = request.message;
      const feedback = request.feedback;
      const cacheThreadID = threadID ? (threadID + "-T") : threadID;
      const cacheMessageID = messageID ? (messageID + "-M") : messageID;

      this.logger.debug("ThreadId:" + cacheThreadID + ", MessageID:" + cacheMessageID +
        ". Received feedback for message. subject:" + email.subject + " feedback:" + feedback.toString());

      if (cacheThreadID) this.nlpCache.removeAll(cacheThreadID);
      if (cacheMessageID) this.nlpCache.removeAll(cacheMessageID);

      switch (feedback) {
        case NLPFeedback.CLEAN: {
          if (cacheThreadID) this.nlpCache.addUserClean(cacheThreadID);
          if (cacheMessageID) this.nlpCache.addUserClean(cacheMessageID);
          break;
        }
        case NLPFeedback.TOXIC: {
          if (cacheThreadID) this.nlpCache.addUserToxic(cacheThreadID);
          if (cacheMessageID) this.nlpCache.addUserToxic(cacheMessageID);
          break;
        }
      }
      this.nlpCache.flush();

      callback(true);
    } else if (message.type === MessageId.PING_CtoB) {
      this.logger.debug("message:" + message.val);
      callback("background pong");
    } else if (message.type === MessageId.MESSAGE_EVENT) {
      const request = message.val as EmailNotificationEvent;
      this.emailEventService.sendEvent(request).then(result => {
        callback(result);
      }).catch(error => {
        callback({error});
      })
    } else if (message.type === MessageId.SAVE_OPT_IN) {
      console.log(`Sending onboarding request....`)
      this.onboardingService.saveUserOnboarding(message.payload).then((result) => {
        callback(result);
      }).catch((error) => {
        callback(error);
      })
    } else if (message.type === MessageId.CLOSE_TAB) {
      if (sender.tab) {
        closeTab(sender.tab)
      }
    } else {
      this.logger.debug("Unknown message received:" + message);
      callback(null);
    }

    return true;
  }

  getModelResult = async (cacheID: string | null, request: NLPRequestEvent): Promise<NLPResponse> => {
    try {
      const result = await this.model.isToxic(request.text, request.maxWords, request.toxicWordMatch);
      if (cacheID) {
        this.logger.debug("Adding id:" + cacheID + " with toxic result:" + result);
        this.nlpCache.add(cacheID, result);
      }
      return new NLPResponse(result);
    } catch (error) {
      let errorStack;
      if (error instanceof Error) {
        errorStack = (error as Error).stack;
      } else {
        errorStack = error;
      }
      this.logger.log("BACKGROUND ERROR result isToxic error for text:" + JSON.stringify(request) +
      " error:" + errorStack);
      const resp = new NLPResponse();
      resp.error = error;
      return resp;
    }
  }


  getCacheResult = (cacheID: string | null): NLPResponse | null => {
    if (cacheID) {
      const isClean = this.nlpCache.isClean(cacheID);
      if (isClean) {
        this.logger.debug("Cache hit for id:" + cacheID + " **clean**")
        return new NLPResponse(false);
      }
      const isToxic = this.nlpCache.isToxic(cacheID);
      if (isToxic) {
        this.logger.debug("Cache hit for id:" + cacheID + " **toxic**")
        return new NLPResponse(true);
      }
    }
    return null;
  }

  static getTrimmedID = (id: string, idType: IDType) => {
    if (idType == IDType.THREAD_VIEW) return BackgroundEventHandler.getTrimmedThreadID(id);
    if (idType == IDType.MESSAGE_VIEW) return BackgroundEventHandler.getTrimmedMessageID(id);
    return id;
  }

  static getTrimmedThreadID = (id: string) => {
    const trimID = BackgroundEventHandler.shortenID(id);
    return trimID ? (trimID + "-" + "T") : trimID;
  }

  static getTrimmedMessageID = (id: string) => {
    const trimID = BackgroundEventHandler.shortenID(id);
    return trimID ? (trimID + "-" + "M") : trimID;
  }

  static shortenID = (id: string) => {
    if (!id) {
      return null;
    }
    if (id.length > 5) {
      return id.substring(id.length - 5, id.length);
    }
    return id;
  }
}
