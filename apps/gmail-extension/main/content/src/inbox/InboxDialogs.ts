import {InboxSDK} from "@inboxsdk/core";
import {EmailNotificationEvent, EventType, Flag} from "@shared/types/events.types";
import {ComposeOption, FlagOption, InBoxSdkHandler} from "@src/InBoxSdkHandler";
import {InBoxEventHandler} from "@src/inbox/InBoxEventHandler";
import {PrrUserAction} from "@shared/enum/prrAction";

const loadHtml = async (path: string): Promise<string> => {
    const url = chrome.runtime.getURL(path);
    const data = await fetch(url);
    return data.text();
}

export interface IInboxDialogs {
    doPRRComposeForceChange(): Promise<number>;
    doPRRComposeSendItAnyway(): Promise<number>;
    doPRRFlag(): Promise<number>;
    doPRROnRead(): Promise<boolean>;
    doPRRHelp(threadID: string | null, messageID : string | null): Promise<void>;
}

export class InboxDialogs implements IInboxDialogs {
    private SDK: InboxSDK;
    private readPRR: HTMLElement;
    private composePRR: HTMLElement;
    private flagPRR: HTMLElement;
    private helpPRR: HTMLElement;
    private sdkHandler: InBoxSdkHandler;
    private eventHandler: InBoxEventHandler;

    constructor(sdk: InboxSDK, handler: InBoxSdkHandler, eventHandler: InBoxEventHandler) {
        this.SDK = sdk;
        this.sdkHandler = handler;
        this.eventHandler = eventHandler;

        this.readPRR = document.createElement("div");
        this.composePRR = document.createElement("div");
        this.flagPRR = document.createElement("div");
        this.helpPRR = document.createElement("div");
    }

    async doLoad() : Promise<void> {
        this.readPRR.innerHTML = await loadHtml("./content/html/prrRead.html");
        this.composePRR.innerHTML = await loadHtml("./content/html/prrCompose.html");
        this.flagPRR.innerHTML = await loadHtml("./content/html/prrFlag.html");
        this.helpPRR.innerHTML = await loadHtml("./content/html/prrHelp.html");
    }

    doPRRComposeForceChange(): Promise<number> {
        const promise: Promise<number> = new Promise((resolve, reject) => {
            //show PRR
            const modal = this.SDK.Widgets.showModalView({
                showCloseButton: false,
                chrome: false,
                title: "Pause and Reflect",
                el: this.composePRR,
                buttons: [
                    {
                        text: "No, let me try again",
                        onClick(event) {
                            modal.close();
                            resolve(ComposeOption.NO_MISTAKE);
                        }
                    }
                ]
            });

        });
        return promise;
    }

    doPRRComposeSendItAnyway(): Promise<number> {
        const promise: Promise<number> = new Promise((resolve, reject) => {
            //show PRR
            const modal = this.SDK.Widgets.showModalView({
                showCloseButton: false,
                chrome: false,
                title: "Pause and Reflect",
                el: this.composePRR,
                buttons: [
                    {
                        text: "Yes, it's fine",
                        onClick(event) {
                            modal.close();
                            resolve(ComposeOption.MISTAKE);
                        }
                    },
                    {
                        text: "No, let me try again",
                        onClick(event) {
                            modal.close();
                            resolve(ComposeOption.NO_MISTAKE);
                        }
                    }
                ]
            });

        });
        return promise;
    }

    doPRRFlag(): Promise<number> {
        const promise: Promise<number> = new Promise((resolve, reject) => {
            //show PRR
            const modal = this.SDK.Widgets.showModalView({
                showCloseButton: false,
                chrome: false,
                title: "Pause and Reflect",
                el: this.flagPRR,
                buttons: [
                    {
                        text: "No, it's fine",
                        onClick(event) {
                            modal.close();
                            resolve(FlagOption.APPROPRIATE);
                        }
                    },
                    {
                        text: "Yes, it's unkind",
                        onClick(event) {
                            modal.close();
                            resolve(FlagOption.INAPPROPRIATE);
                        }
                    }
                ]
            });
        });
        return promise;
    }

    doPRROnRead(): Promise<boolean> {
        const promise: Promise<boolean> = new Promise((resolve, reject) => {
            //show PRR
            const modal = this.SDK.Widgets.showModalView({
                showCloseButton: false,
                chrome: false,
                title: "Pause and Reflect",
                el: this.readPRR,
                buttons: [
                    {
                        text: "No, leave it open",
                        onClick(event) {
                            modal.close();
                            resolve(false);
                        }
                    },
                    {
                        text: "Yes, please",
                        onClick(event) {
                            modal.close();
                            history.back();
                            resolve(true);
                        }
                    },
                ]
            });
        });
        return promise;
    }

    doPRRHelp(threadID: string | null, messageID : string | null): Promise<void> {
        const promise: Promise<void> = new Promise((resolve, reject) => {
            const myself = this;
            //show PRR
            const modal = this.SDK.Widgets.showModalView({
                showCloseButton: false,
                chrome: false,
                title: "Pause and Reflect",
                el: this.helpPRR,
                buttons: [
                    {
                        text: "I'll talk to an adult",
                        onClick(event) {
                            const emailEvent : EmailNotificationEvent = {
                                threadId: threadID,
                                messageId: messageID,
                                eventTypeId :EventType.EMAIL_MESSAGE_FLAG_EVENT,
                                prrAction:PrrUserAction.MESSAGE_ACTION_TALK_TO_ADULT,
                                prrTriggered : true,
                                prrMessage: "I'll talk to an adult",
                                mlFlag: Flag.UNKIND,
                                userFlag: Flag.UNKIND,
                            }
                            console.log(`Sending flagg event..`)
                            myself.eventHandler.notifyActivity(emailEvent)
                            modal.close();
                            history.back();
                        }
                    }
                ]
            });
        });
        return promise;
    }
}
