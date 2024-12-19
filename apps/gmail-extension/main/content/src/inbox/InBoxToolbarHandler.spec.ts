import {IInboxDialogs} from "apps/gmail-extension/main/content/src/inbox/InboxDialogs";
import {IInboxEventHandler} from "apps/gmail-extension/main/content/src/inbox/InBoxEventHandler";
import {FlagOption} from "apps/gmail-extension/main/content/src/InBoxSdkHandler";
import {MessageView, ThreadRowView, ThreadView, ToolbarButtonOnClickEvent} from "@inboxsdk/core";
import {createMock} from 'ts-auto-mock';
import {InBoxToolbarHandler} from "apps/gmail-extension/main/content/src/inbox/InBoxToolbarHandler";
import {threadUnkindMessageCSS, threadUnkindMessageLabel} from "apps/gmail-extension/main/content/src/inbox/InBoxLabels";
import {EmailNotificationEvent, EventType, Flag} from "@shared/types/events.types";

const mockContentCommunicator = {
    handleMLEmailEvent: jest.fn((a): Promise<boolean> => new Promise((resolve) => resolve(true))),
    isToxicAsync: jest.fn((a, b, c, d, e): Promise<boolean> => new Promise((resolve) => resolve(true))),
    getToxicMLThreadStatus: jest.fn((a): Promise<boolean[] | null> => new Promise((resolve) => {
        const ret = [];
        for (let i=0; i < a.length; i++) {
            if (a[i] === "1234") {
                ret.push(true);
            } else {
                ret.push(false);
            }
        }
        resolve(ret);
    })),
    handleUserFeedback : jest.fn((a,b,c,d): Promise<void> => new Promise(resolve => resolve())),
    notifyActivity : jest.fn((a): Promise<void> => new Promise(resolve => resolve())),
};

describe("content => single method calls", () => {
    test('getThreadMLToxicFlags', async () => {
        const setup = mockToolbarHandler(FlagOption.INAPPROPRIATE);
        const {handler, mockContentCommunicator}  = setup;
        const threadIDs = ["a", "b", "c"];

        jest.spyOn(mockContentCommunicator, "getToxicMLThreadStatus");
        jest.spyOn(mockContentCommunicator, "getToxicMLThreadStatus").mockImplementation(() => new Promise(resolve => resolve([true, false])));

        const result = await handler.getThreadMLToxicFlags(threadIDs);
        expect(mockContentCommunicator.getToxicMLThreadStatus).toHaveBeenCalledTimes(1);
        expect(mockContentCommunicator.getToxicMLThreadStatus).toBeCalledWith(["a", "b", "c"]);
        expect(result).toStrictEqual([true, false]);
    });

    test('getThreadIDs', async () => {
        const setup = mockToolbarHandler(FlagOption.INAPPROPRIATE);
        const {handler, mockContentCommunicator}  = setup;
        const subject = "Test";
        const htmlNode = mockHTMLTextNode(subject, false)
        const mockThreadRowView1 = mockThreadRowView("1234", subject, htmlNode, false);
        const mockThreadRowView2 = mockThreadRowView("5678", subject, htmlNode, false);
        const threadIDs = await handler.getThreadIDs([mockThreadRowView1, mockThreadRowView2]);

        expect(threadIDs).toStrictEqual(["1234", "5678"]);
    });
});

describe("content => InBoxToolbarHandler", () => {
    test('test event handler notifications', async () => {
        const setup = mockToolbarHandler(FlagOption.INAPPROPRIATE);
        const {mockEventHandler} = setup;
        const subject = "toxic subject";
        const htmlNode = mockHTMLTextNode(subject, false)
        const mockThreadRowView1 = mockThreadRowView("1234", subject, htmlNode, false);
        const mockThreadRowView2 = mockThreadRowView("5678", subject, htmlNode, false);
        const mockEvent = mockToolbarEvents([mockThreadRowView1, mockThreadRowView2], []);

        jest.spyOn(mockEventHandler, "notifyActivity");
        await setup.handler.handleToolbarButtonClick(mockEvent);

        expect(mockEventHandler.notifyActivity).toHaveBeenCalledTimes(2);

        const firstEvent: EmailNotificationEvent = {
            eventTypeId: EventType.EMAIL_THREAD_FLAG_EVENT,
            threadId: "1234",
            messageId: null,
            mlFlag: Flag.UNKIND,
            prrAction: "THREAD_ACTION_ITS_UNKIND",
            prrMessage: "Yes, it's unkind",
            prrTriggered: true,
            userFlag: Flag.UNKIND,
            emailMessage : {
                body: null,
                from: null,
                subject: subject,
                to: null
            }
        };

        const secondEvent: EmailNotificationEvent = {
            eventTypeId: EventType.EMAIL_THREAD_FLAG_EVENT,
            threadId: "5678",
            messageId: null,
            mlFlag: Flag.KIND,
            prrAction: "THREAD_ACTION_ITS_UNKIND",
            prrMessage: "Yes, it's unkind",
            prrTriggered: true,
            userFlag: Flag.UNKIND,
            emailMessage : {
                body: null,
                from: null,
                subject: subject,
                to: null
            }
        };

        expect(mockEventHandler.notifyActivity).toHaveBeenNthCalledWith(1, firstEvent);
        expect(mockEventHandler.notifyActivity).toHaveBeenNthCalledWith(2, secondEvent);
    });

    test('single thread view message clean->flag', async () => {
        const setup = mockToolbarHandler(FlagOption.INAPPROPRIATE);
        const subject = "toxic subject";
        const htmlNode = mockHTMLTextNode(subject, false)
        const mockThreadRowView1 = mockThreadRowView("1234", subject, htmlNode, false);
        const mockEvent = mockToolbarEvents([mockThreadRowView1], []);

        jest.spyOn(mockThreadRowView1, "addLabel");
        await setup.handler.handleToolbarButtonClick(mockEvent);

        expect(mockThreadRowView1.addLabel).toHaveBeenCalledTimes(1);
        expect(mockThreadRowView1.addLabel).toBeCalledWith(threadUnkindMessageCSS);
    });

    test('single thread view message flag->clean', async () => {
        const beforeToxic = true;
        const setup = mockToolbarHandler(FlagOption.APPROPRIATE);
        const subject = "some subject";
        const htmlNode = mockHTMLTextNode(subject, beforeToxic)
        const mockThreadRowView1 = mockThreadRowView("1234", subject, htmlNode, beforeToxic);
        const mockEvent = mockToolbarEvents([mockThreadRowView1], []);
        const elementNode = mockThreadRowView1.getElement();

        jest.spyOn(mockThreadRowView1, "addLabel");

        expect(elementNode.childNodes[0].textContent).toBe(threadUnkindMessageLabel);

        await setup.handler.handleToolbarButtonClick(mockEvent);

        expect(mockThreadRowView1.addLabel).toHaveBeenCalledTimes(0);
        expect(elementNode.childNodes.length).toBe(1);
        expect(elementNode.childNodes[0].textContent).toBe("");
    });
})

const mockToolbarHandler = (flagOption: FlagOption) => {
    const mockEventHandler = createMock<IInboxEventHandler>();
    const mockDialogs = createMock<IInboxDialogs>();

    jest.spyOn(mockDialogs, "doPRRFlag").mockImplementation(() => new Promise(resolve => resolve(flagOption)));

    const handler = new InBoxToolbarHandler(mockDialogs, mockEventHandler, mockContentCommunicator);

    return {handler, mockContentCommunicator, mockEventHandler};
};

const mockToolbarEvents = (selectedThreadRowView: ThreadRowView[], selectedThreadViews: ThreadView[]) => {
    return createMock<ToolbarButtonOnClickEvent>({
        selectedThreadRowViews: selectedThreadRowView,
        selectedThreadViews: selectedThreadViews
    });
}

const mockThreadRowView = (threadID: string, subject: string, htmlElement: HTMLElement, hasToxicLabel: boolean) => {
    const threadRowView = createMock<ThreadRowView>({
        getThreadIDAsync(): Promise<string> {
            return new Promise(resolve => resolve(threadID));
        },
        getSubject(): string {
            return subject;
        },
        getThreadID(): string {
            return threadID;
        },
        getElement(): HTMLElement {
            return htmlElement;
        }
    });
    return threadRowView;
}

const mockHTMLTextNode = (subject: string, insertToxicLabel: boolean) => {
    const label =  (insertToxicLabel) ? threadUnkindMessageLabel : subject;
    const textNode = document.createTextNode(label);
    const div = document.createElement("div");
    div.appendChild(textNode);
    return div;
}

const mockThreadView = (threadID: string, subject: string, messages: string[]) => {
    const threadRowView = createMock<ThreadView>({
        getThreadIDAsync(): Promise<string> {
            return new Promise(resolve => resolve(threadID));
        },
        getSubject(): string {
            return subject;
        },
        getMessageViews(): Array<MessageView> {
            const messageViews = messages.map(message => {
                const messageView = createMock<MessageView>({
                    getMessageIDAsync(): Promise<string> {
                        return new Promise(resolve => resolve("some message id"));
                    },
                    getBodyElement(): HTMLElement {
                        const div = document.createElement("div");
                        div.innerText = message;
                        return div;
                    }
                });
                return messageView;
            });
            return messageViews;
        }
    });
    return threadRowView;
}
