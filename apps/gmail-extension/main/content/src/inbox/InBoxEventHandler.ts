import {EmailMessage} from "@shared/types/EmailMessage";
import {EmailNotificationEvent, EmailFeedbackEvent, NLPFeedback} from "@shared/types/events.types";
import {MessageId} from "@shared/types/MessageId";
import {InboxBackgroundCommunicator} from "@src/inbox/InboxBackgroundCommunicator";

export interface IInboxEventHandler {
    handleUserFeedback(threadID: string | null, messageID: string | null, email: EmailMessage, feedback: NLPFeedback): Promise<void>;
    notifyActivity(event: EmailNotificationEvent): Promise<void>
}

export class InBoxEventHandler implements  IInboxEventHandler{
    private readonly communicator: InboxBackgroundCommunicator;

    constructor(communicator: InboxBackgroundCommunicator) {
        this.communicator = communicator;
    }

    async handleUserFeedback(threadID: string | null, messageID: string | null, email: EmailMessage, feedback: NLPFeedback): Promise<void> {
        return this.communicator.handleUserFeedback(threadID, messageID, email, feedback);
    }

    async notifyActivity(event: EmailNotificationEvent): Promise<void> {
        return this.communicator.notifyActivity(event);
    }
}
