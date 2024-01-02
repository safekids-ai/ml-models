import {ThreadRowView, ToolbarButtonOnClickEvent} from "@inboxsdk/core";
import {EmailMessage} from "../../../common/types/EmailMessage";
import {EmailNotificationEvent, EventType, Flag, NLPFeedback} from "../../../common/types/events.types";
import {PrrUserAction} from "../../../common/enum/prrAction";
import {DOMUtils} from "../utils/DOMUtils";
import {threadUnkindMessageCSS, threadUnkindMessageLabel} from "./InBoxLabels";
import {FlagOption} from "../InBoxSdkHandler";
import {IInboxDialogs} from "./InboxDialogs";
import {IInboxEventHandler} from "./InBoxEventHandler";
import {InboxBackgroundCommunicator} from "./InboxBackgroundCommunicator";

export class InBoxToolbarHandler {
    private prrDialog: IInboxDialogs;
    private eventHandler: IInboxEventHandler;
    private contentHandler: InboxBackgroundCommunicator;

    constructor(prrDialog: IInboxDialogs, eventHandler: IInboxEventHandler, contentHandler: InboxBackgroundCommunicator) {
        this.prrDialog = prrDialog;
        this.eventHandler = eventHandler;
        this.contentHandler = contentHandler;
    }

    async getThreadMLToxicFlags (threadsIDs: string[]): Promise<boolean[] | null> {
        const threadFlags = await this.contentHandler.getToxicMLThreadStatus(threadsIDs);
        return threadFlags;
    }

    async getThreadIDs (threadRowViews: ThreadRowView[]) : Promise<string[]> {
        const threadIDArr = [];
        for (let i = 0; i < threadRowViews.length; i++) {
            const threadRowView = threadRowViews[i];
            let threadID : string | null = null;
            try {
                threadID = await threadRowView.getThreadIDAsync();
            } catch (error) {
                console.log("Error getting thread id " + error);
            }
            if (threadID) {
                threadIDArr.push(threadID);
            }
        }
        return threadIDArr;
    }

    async handleToolbarButtonClick(event: ToolbarButtonOnClickEvent) {
        const prrFeedback = await this.prrDialog.doPRRFlag();

        //handle thread row views
        const threadRowViews = event.selectedThreadRowViews;
        const threadIds = await this.getThreadIDs(threadRowViews);
        const threadMLFlags = (threadIds) ? await this.getThreadMLToxicFlags(threadIds) : null;
        const mlMap = new Map<string, boolean>();

        if (threadMLFlags) {
            for (let j=0; j < threadIds.length; j++) {
                mlMap.set(threadIds[j], threadMLFlags[j]);
            }
        }

        for (let i = 0; i < threadRowViews.length; i++) {
            const threadRowView = threadRowViews[i];
            let threadID : string | null = null;
            try {
                threadID = await threadRowView.getThreadIDAsync();
            } catch (error) {
                console.log("Error getting thread id " + error);
            }
            const subject = threadRowView.getSubject();
            let mlFlag = null;

            if (threadID) {
                const val = mlMap.get(threadID);
                if (val != null || val !== undefined) {
                    mlFlag = val;
                }
            }
            const emailMessage = new EmailMessage(null, null, subject, null);
            this.handleSingleMessage(threadID, null, mlFlag, emailMessage, prrFeedback, event);
        }

        //handle thread views
        const threadViews = event.selectedThreadViews;
        for (let i = 0; i < threadViews.length; i++) {
            const threadView = threadViews[i];
            let threadID: string | null = null;
            try {
                threadID = await threadView.getThreadIDAsync();
            } catch (error) {
                console.log("Error getting thread id " + error);
            }
            const threadMLFlags = (threadID) ? await this.getThreadMLToxicFlags([threadID]) : null;
            const threadMLFlag = (threadMLFlags && threadMLFlags.length > 0) ? threadMLFlags[0] : null;
            const subject = threadView.getSubject();
            const messageViews = threadView.getMessageViews();
            let messageID : string | null = null;

            if (messageViews.length > 0) {
                try {
                    messageID = await messageViews[0].getMessageIDAsync()
                } catch (error) {
                    console.log("Unable to get messageid on toolbar click due to " + error);
                }
            }
            const body = (messageViews.length > 0) ? messageViews[0].getBodyElement().innerText : null;
            const emailMessage = new EmailMessage(null, null, subject, body);
            await this.handleSingleMessage(threadID, messageID, threadMLFlag, emailMessage, prrFeedback, event);
        }
    }

    async handleSingleMessage(threadID: string | null,
                              messageID: string | null,
                              mlBooleanFlag: boolean | null,
                              emailMessage: EmailMessage,
                              prrFeedback: FlagOption, event: ToolbarButtonOnClickEvent) {

        let mlFlag = null;

        if (mlBooleanFlag != null) {
            mlFlag = (mlBooleanFlag) ? Flag.UNKIND : Flag.KIND;
        }

        //report cache event to backend
        const emailThreadFlagEvent: EmailNotificationEvent = {
            eventTypeId: EventType.EMAIL_THREAD_FLAG_EVENT,
            threadId: threadID,
            messageId: messageID,
            mlFlag: mlFlag,
            prrTriggered: true,
        }
        //send feedback
        switch (prrFeedback) {
            case FlagOption.APPROPRIATE: {
                this.eventHandler.handleUserFeedback(threadID, messageID, emailMessage, NLPFeedback.CLEAN);
                emailThreadFlagEvent.userFlag = Flag.KIND
                emailThreadFlagEvent.prrMessage = "No, it's fine"
                emailThreadFlagEvent.prrAction = PrrUserAction.THREAD_ACTION_ITS_FINE
                break;
            }
            case FlagOption.INAPPROPRIATE: {
                this.eventHandler.handleUserFeedback(threadID, messageID, emailMessage, NLPFeedback.TOXIC);
                emailThreadFlagEvent.userFlag = Flag.UNKIND;
                emailThreadFlagEvent.prrMessage = "Yes, it's unkind";
                emailThreadFlagEvent.prrAction = PrrUserAction.THREAD_ACTION_ITS_UNKIND;
                emailThreadFlagEvent.emailMessage = emailMessage;
                break;
            }
        }

        this.eventHandler.notifyActivity(emailThreadFlagEvent)

        //modify labels
        for (let i = 0; i < event.selectedThreadRowViews.length; i++) {
            const rowView = event.selectedThreadRowViews[i];
            const rowThreadID = rowView.getThreadID();
            if (rowThreadID == threadID) {
                const element = rowView.getElement();
                const nodes = new Set<Node>();
                let hadToxicLabel = false;

                //remove the toxic label if necessary
                DOMUtils.getChildElements(nodes, element);
                for (const node of nodes) {
                    if (node.nodeType == Node.TEXT_NODE) {
                        const plainText = node.textContent;
                        if (plainText == threadUnkindMessageLabel) {
                            //remove the tag
                            if (prrFeedback == FlagOption.APPROPRIATE) {
                                if (node.parentNode && node.parentNode.parentNode) {
                                    node.parentNode.parentNode.removeChild(node.parentNode);
                                } else {
                                    node.textContent = "";
                                }
                            }
                            hadToxicLabel = true;
                            break;
                        }
                    }
                }

                //add label if necessary
                if (prrFeedback == FlagOption.INAPPROPRIATE && !hadToxicLabel) {
                    rowView.addLabel(threadUnkindMessageCSS);
                }
            }
        }
    }
}
