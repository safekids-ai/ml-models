import {ThreadRowView} from "@inboxsdk/core";
import {EmailNotificationEvent, EventType, Flag, IDType} from "../../../common/types/events.types";
import {InboxBackgroundCommunicator} from "./InboxBackgroundCommunicator";
import {threadUnkindMessageCSS} from "./InBoxLabels";
import {IInboxEventHandler} from "./InBoxEventHandler";
import {EmailEvent} from "../../../common/types/EmailEvent";
import {EmailMessage} from "../../../common/types/EmailMessage";

export class InboxThreadViewHandler {

    constructor(private readonly backgroundCommunicator: InboxBackgroundCommunicator,
                private readonly eventHandler: IInboxEventHandler) {
        this.backgroundCommunicator = backgroundCommunicator;
    }

    async onInBoxSubject(threadRowView: ThreadRowView): Promise<void> {
        //const body = threadRowView.getElement().textContent;
        const subject = threadRowView.getSubject();
        const threadId = threadRowView.getThreadID();

        const myself = this;
        console.log("Inbox message. id:" + threadId + " subject:" + subject);
        const emailEvent = new EmailEvent(
            EventType.EMAIL_THREAD_READ_EVENT,
            new EmailMessage(null, null, subject, null, threadId));

        const toxic = await this.backgroundCommunicator.handleMLEmailEvent(emailEvent);
        if (toxic) {
            if (!threadRowView.destroyed) {
                threadRowView.addLabel(threadUnkindMessageCSS);
            }
        }

        //if no thread id is available, not point in logging it
        if (!threadId) {
            return;
        }

        //send only if there is a toxic event
        if (toxic) {
            const emailNotificationEvent : EmailNotificationEvent = {
                eventTypeId: EventType.EMAIL_THREAD_READ_EVENT,
                threadId: threadId,
                messageId: null,
                mlFlag: toxic ? Flag.UNKIND : Flag.KIND
            }
            this.eventHandler.notifyActivity(emailNotificationEvent)
        }
    };
}
