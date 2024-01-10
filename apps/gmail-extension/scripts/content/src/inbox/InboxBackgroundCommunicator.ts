import {
  EmailNotificationEvent,
  EmailFeedbackEvent,
  IDType,
  NLPFeedback,
  NLPRequestEvent,
  ToxicStatusRequestEvent,
  ToxicStatusResponseEvent
} from "../../../common/types/events.types";
import {MessageId} from "../../../common/types/MessageId";
import {EmailMessage} from "../../../common/types/EmailMessage";
import {EmailEvent} from "../../../common/types/EmailEvent";

export class InboxBackgroundCommunicator {

  async handleMLEmailEvent(emailEvent: EmailEvent): Promise<boolean> {
    const request = {type: MessageId.NLP_EMAIL_EVENT, val: emailEvent};
    return new Promise<boolean>(resolve => {
      if (!chrome.runtime?.id) {
        console.log("***WARNING** - Disconnect from the background. NLP wasn't run");
        resolve(false);
        return;
      }

      chrome.runtime.sendMessage(request, (response) => {
        if (response) {
          if (response.error) {
            console.log("NLP Error" + JSON.stringify(response.error));
            resolve(false);
          } else {
            if (response.isToxic) {
              console.log(`NLP Response text: ${emailEvent.email.subject} and ${emailEvent.email.body} toxic:${response.isToxic}`);
            }
            resolve(response.isToxic);
          }
        } else {
          console.log("NO RESPONSE RECEIVED FOR NLP **************************");
          resolve(false);
        }
      });
    });
  }

  async handleUserFeedback(threadID: string | null, messageID: string | null, email: EmailMessage, feedback: NLPFeedback): Promise<void> {
    const request = {
      type: MessageId.MESSAGE_REVIEW_CtoB,
      val: new EmailFeedbackEvent(threadID, messageID, email, feedback)
    };
    return new Promise<void>(resolve => {
      chrome.runtime.sendMessage(request, () => {
        console.log("Sent the feedback successfully. ");
        resolve();
      });
    });
  }

  async notifyActivity(event: EmailNotificationEvent): Promise<void> {
    const request = {
      type: MessageId.MESSAGE_EVENT,
      val: event
    };
    return new Promise<void>(resolve => {
      chrome.runtime.sendMessage(request, () => {
        console.log("Sent the message successfully. ");
        resolve();
      });
    });
  }

  async isToxicAsync(id: string | null, idType: IDType | null, content: string | null, maxWords?: number, toxicWordMatch?: boolean): Promise<boolean> {
    const nlpRequest = new NLPRequestEvent(id, idType, content, maxWords, toxicWordMatch);
    const request = {type: MessageId.GET_NLP_CtoB, val: nlpRequest};
    return new Promise<boolean>(resolve => {
      if (!chrome.runtime?.id) {
        console.log("***WARNING** - Disconnect from the background. NLP wasn't run");
        resolve(false);
        return;
      }

      chrome.runtime.sendMessage(request, (response) => {
        if (response) {
          if (response.error) {
            console.log("NLP Error" + JSON.stringify(response.error));
            resolve(false);
          } else {
            if (response.isToxic) {
              console.log(`NLP Response text:${content} toxic:${response.isToxic}`);
            }
            resolve(response.isToxic);
          }
        } else {
          console.log("NO RESPONSE RECEIVED FOR NLP **************************");
          resolve(false);
        }
      });
    });
  }

  async getToxicMLThreadStatus(ids: string[]): Promise<boolean[] | null> {
    if (!ids) {
      return null;
    }

    if (ids.length == 0) {
      return [];
    }
    const toxicStatusRequest = new ToxicStatusRequestEvent(ids);
    const request = {type: MessageId.GET_ML_TOXIC_STATUS, val: toxicStatusRequest};
    return new Promise<boolean[] | null>(resolve => {
      if (!chrome.runtime?.id) {
        console.log("***WARNING** - Disconnect from the background. NLP wasn't run");
        resolve(null);
        return;
      }

      chrome.runtime.sendMessage(request, (response) => {
        if (response) {
          if (response.error) {
            console.log("Toxic ML flag cache Error" + JSON.stringify(response.error));
            resolve(null);
          } else {
            const toxicResponse: ToxicStatusResponseEvent = response;
            const toxicResult = toxicResponse.toxic;
            resolve(toxicResult);
          }
        } else {
          console.log("NO RESPONSE RECEIVED FOR TOXIC ML LOOKUP  **************************");
          resolve(null);
        }
      });
    });
  }
}
