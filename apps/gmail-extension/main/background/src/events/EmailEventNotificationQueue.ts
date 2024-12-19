import {NLPResultCacheListenerInterface} from "./cache/NLPResultCacheListener";
import {EmailNotificationEvent, EventType} from "@shared/types/events.types";
import {EmailEventService} from "./api/emailEventService";
import {NLPResultCacheData} from "./cache/NLPResultCacheData";

export class EmailEventNotificationQueue implements NLPResultCacheListenerInterface {
  private cache: NLPResultCacheData;
  private cacheLoadSuccess: boolean | undefined = undefined;
  private cacheLoadError: Error;
  private messages = new Array<EmailNotificationEvent>();
  private flushInProcess: boolean = false;

  constructor(private readonly emailEventService: EmailEventService,
              private readonly maxQueueSize: number) {

  }

  put(emailNotificationEvent: EmailNotificationEvent) {
    //if not thread read event or queue is too big
    if (emailNotificationEvent.eventTypeId != EventType.EMAIL_THREAD_READ_EVENT || this.messages.length >= this.maxQueueSize) {
      this.emailEventService.sendEvent(emailNotificationEvent);
      return;
    }
    this.messages.push(emailNotificationEvent);
  }

  flushMessages() {
    for (let i = 0; i < this.messages.length; i++) {
      const event: EmailNotificationEvent = this.messages[i];
      const threadId = (event) ? event.threadId : null;

      //if cache load fails or if successful and thread doesn't exist in cache, flush it
      if (this.cacheLoadSuccess === false ||
        (this.cacheLoadSuccess === true && threadId && this.cache && !this.cache.exists(threadId))) {
        this.emailEventService.sendEvent(event);
      }
    }
    this.messages = [];
  }

  onCacheLoadSuccess(cache: NLPResultCacheData): void {
    this.cache = cache;
    this.cacheLoadSuccess = true;
    this.flushMessages();
  }

  onCacheLoadFail(error: Error): void {
    this.cacheLoadSuccess = false;
    this.cacheLoadError = error;
    this.flushMessages();
  }
}
