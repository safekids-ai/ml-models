import {EmailMessage} from "../../../common/types/EmailMessage";
import {EmailNotificationEvent, EmailFeedbackEvent, NLPFeedback} from "../../../common/types/events.types";
import {MessageId} from "../../../common/types/MessageId";
import {InboxBackgroundCommunicator} from "./InboxBackgroundCommunicator";

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
