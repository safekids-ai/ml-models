import {MessageView, SimpleElementView} from "@inboxsdk/core";
import {EmailNotificationEvent, EventType, Flag, IDType, NLPFeedback} from "../../../common/types/events.types";
import {EmailContact, EmailMessage} from "../../../common/types/EmailMessage";
import {InboxBackgroundCommunicator} from "./InboxBackgroundCommunicator";
import {IInboxDialogs, InboxDialogs} from "./InboxDialogs";
import {IInboxEventHandler, InBoxEventHandler} from "./InBoxEventHandler";
import {PrrUserAction} from "../../../common/enum/prrAction";
import {EmailEvent} from "../../../common/types/EmailEvent";
import {threadUnkindMessageCSS} from "./InBoxLabels";

export class InBoxMessageViewHandler {

    constructor(private readonly backgroundCommunicator: InboxBackgroundCommunicator,
                private readonly prrDialog: IInboxDialogs,
                private readonly eventHandler: IInboxEventHandler) {
        this.eventHandler = eventHandler;
        this.backgroundCommunicator = backgroundCommunicator;
        this.prrDialog = prrDialog;
    }

    async onInBoxReadMessage(messageView: MessageView): Promise<void> {
        const threadView = messageView.getThreadView();
        let threadID: string | null = null;
        let messageID: string | null = null;

        try {
            threadID = await threadView.getThreadIDAsync();
        } catch (error) {
            console.log("Error getting threadID due to " + error);
        }

        try {
            messageID = await messageView.getMessageIDAsync();
        } catch (error) {
            console.log("Unable to get message id due to " + error);
        }

        //check if the view is still available
        let destroyed = false;
        messageView.on("destroy", () => {
            destroyed = true;
        });

        const subject = (threadView.getSubject() && threadView.getSubject() === '(no subject)') ? "" : threadView.getSubject();
        const body = messageView.getBodyElement().textContent;
        const loaded = messageView.isLoaded();

        if (!messageView.isLoaded()) {
            return;
        }

        const message = {
            from: messageView.getSender().name,
            fromEmail: messageView.getSender().emailAddress,
            subject: subject,
            body: messageView.getBodyElement().innerText
        };

        const emailEvent = new EmailEvent(
            EventType.EMAIL_READ_EVENT,
            new EmailMessage(null, null, message.subject, message.body, threadID, messageID));

        const toxic = await this.backgroundCommunicator.handleMLEmailEvent(emailEvent);

        const emailNotificationEvent: EmailNotificationEvent = {
            eventTypeId: EventType.EMAIL_READ_EVENT,
            messageId: messageID,
            threadId: threadID,
        }


        //check to see if the view has been destroyed
        if (!toxic || destroyed || !messageView.isLoaded()) {
            emailNotificationEvent.mlFlag = Flag.KIND
            //cache read message event
            this.eventHandler.notifyActivity(emailNotificationEvent)
            return;
        }

        const emailMessage = new EmailMessage(
            new EmailContact(message.from, message.fromEmail),
            null,
            message.subject,
            message.body);

        //show PRR
        const prrResponse = await this.prrDialog.doPRROnRead();

        if (!prrResponse) {
            emailNotificationEvent.emailMessage = emailMessage;
        }

        emailNotificationEvent.eventTypeId = EventType.EMAIL_READ_PRR_EVENT;
        emailNotificationEvent.mlFlag = Flag.UNKIND;
        emailNotificationEvent.prrTriggered = true;
        emailNotificationEvent.prrMessage = prrResponse ? "Yes, Please" : "No, leave it open";
        emailNotificationEvent.prrAction = prrResponse ? PrrUserAction.MESSAGE_ACTION_YES_PLEASE_CLOSE_IT : PrrUserAction.MESSAGE_ACTION_NO_LEAVE_IT_OPEN;
        this.eventHandler.notifyActivity(emailNotificationEvent);

        if (prrResponse) {
            return;
        }

        //add the notice bar to capture false positives
        const view: SimpleElementView = threadView.addNoticeBar();
        const htmlElement: HTMLElement = view.el;
        const label = document.createElement("label");
        const yesButton = document.createElement("button");
        const noButton = document.createElement("button");
        label.innerText = "Is this message unkind? ";
        yesButton.innerText = "Yes";
        noButton.innerText = "No";

        //purple styling
        htmlElement.style.backgroundColor = "#5939FA";
        label.style.color = "#ffffff";

        const myself = this;

        //report cache event to backend
        const emailThreadFlagEvent: EmailNotificationEvent = {
            eventTypeId: EventType.EMAIL_MESSAGE_FLAG_EVENT,
            threadId: threadID,
            messageId: messageID,
            prrTriggered: true,
        }

        yesButton.onclick = function () {
            htmlElement.innerHTML = "Thanks for your feedback.";
            htmlElement.style.color = "#ffffff";

            myself.prrDialog.doPRRHelp(threadID, messageID);
            myself.eventHandler.handleUserFeedback(threadID, messageID, emailMessage, NLPFeedback.TOXIC);

            emailThreadFlagEvent.mlFlag = Flag.UNKIND;
            emailThreadFlagEvent.userFlag = Flag.UNKIND;
            emailThreadFlagEvent.prrMessage = "Yes";
            emailThreadFlagEvent.prrAction = PrrUserAction.MESSAGE_ACTION_YES;
            myself.eventHandler.notifyActivity(emailThreadFlagEvent);
        };

        noButton.onclick = function () {
            htmlElement.innerHTML = "Thanks for your feedback.";
            htmlElement.style.color = "#ffffff";
            myself.eventHandler.handleUserFeedback(threadID, messageID, emailMessage, NLPFeedback.CLEAN);

            emailThreadFlagEvent.mlFlag = Flag.UNKIND;
            emailThreadFlagEvent.userFlag = Flag.KIND;
            emailThreadFlagEvent.emailMessage = emailMessage;
            emailThreadFlagEvent.prrMessage = "No";
            emailThreadFlagEvent.prrAction = PrrUserAction.MESSAGE_ACTION_NO;
            myself.eventHandler.notifyActivity(emailThreadFlagEvent);
        };

        htmlElement.appendChild(label);
        htmlElement.appendChild(yesButton);
        htmlElement.appendChild(noButton);
    }
}
