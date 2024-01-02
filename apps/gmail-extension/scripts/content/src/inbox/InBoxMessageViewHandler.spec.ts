import {IInboxDialogs} from "./InboxDialogs";
import {IInboxEventHandler} from "./InBoxEventHandler";
import {ComposeView, Contact, MessageView, SimpleElementView, ThreadView} from "@inboxsdk/core";
import {createMock} from 'ts-auto-mock';
import {InBoxMessageViewHandler} from "./InBoxMessageViewHandler";

const mockModelToxic = {
    handleMLEmailEvent: jest.fn((a): Promise<boolean> => new Promise((resolve) => resolve(true))),
    isToxicAsync: jest.fn((a, b, c, d, e): Promise<boolean> => new Promise((resolve) => resolve(true))),
    getToxicMLThreadStatus: jest.fn((a): Promise<boolean[] | null> => new Promise((resolve) => {
        resolve(null);
    })),
    handleUserFeedback: jest.fn((a, b, c, d): Promise<void> => new Promise(resolve => resolve())),
    notifyActivity: jest.fn((a): Promise<void> => new Promise(resolve => resolve())),
};

const mockModelClean = {
    handleMLEmailEvent: jest.fn((a): Promise<boolean> => new Promise((resolve) => resolve(false))),
    isToxicAsync: jest.fn((a, b, c, d, e): Promise<boolean> => new Promise((resolve) => resolve(false))),
    getToxicMLThreadStatus: jest.fn((a): Promise<boolean[] | null> => new Promise((resolve) => {
        resolve(null);
    })),
    handleUserFeedback: jest.fn((a, b, c, d): Promise<void> => new Promise(resolve => resolve())),
    notifyActivity: jest.fn((a): Promise<void> => new Promise(resolve => resolve())),
};

interface StubEvent {
    cancel(): Promise<void>;
}

describe("content => InBoxMessageViewHandler", () => {
    test('clean message no PRR and user still on message view', async () => {
        const setup = mockMessageViewHandler("test", "test", true, false, true, false);
        await setup.handler.onInBoxReadMessage(setup.messageView);
        expect(setup.mockDialogs.doPRROnRead).toHaveBeenCalledTimes(0);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenCalledTimes(1);
        expect(setup.mockEventHandler.notifyActivity).toBeCalledWith({
            eventTypeId: "EMAIL_READ_EVENT",
            messageId: "M1",
            mlFlag: "KIND",
            threadId: "T1",
        });
    });

    test('toxic message with PRR but user decides to close it', async () => {
        const setup = mockMessageViewHandler("test", "test", true, true, true, false);
        await setup.handler.onInBoxReadMessage(setup.messageView);
        expect(setup.mockDialogs.doPRROnRead).toHaveBeenCalledTimes(1);
        expect(setup.threadView.addNoticeBar).toHaveBeenCalledTimes(0);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenCalledTimes(1);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenNthCalledWith(1, {
            eventTypeId: "EMAIL_READ_PRR_EVENT",
            messageId: "M1",
            mlFlag: "UNKIND",
            prrAction: "MESSAGE_ACTION_YES_PLEASE_CLOSE_IT",
            prrMessage: "Yes, Please",
            prrTriggered: true,
            threadId: "T1",
        });
    });

    test('toxic message with PRR but user decides not to close it', async () => {
        const setup = mockMessageViewHandler("test", "test", true, true, false, false);
        await setup.handler.onInBoxReadMessage(setup.messageView);
        expect(setup.mockDialogs.doPRROnRead).toHaveBeenCalledTimes(1);
        expect(setup.threadView.addNoticeBar).toHaveBeenCalledTimes(1);
        expect(setup.noticeBarHTMLElement.appendChild).toHaveBeenCalledTimes(3);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenCalledTimes(1);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenNthCalledWith(1, {
            emailMessage: {
                body: "test",
                from: {
                    email: "johndoe@cache.com",
                    name: "John Doe",
                },
                messageId: undefined,
                subject: "test",
                threadId: undefined,
                to: null,
            },
            eventTypeId: "EMAIL_READ_PRR_EVENT",
            messageId: "M1",
            mlFlag: "UNKIND",
            prrAction: "MESSAGE_ACTION_NO_LEAVE_IT_OPEN",
            prrMessage: "No, leave it open",
            prrTriggered: true,
            threadId: "T1",
        });
    });

    test('toxic message but the user moves away from the message before PRR popup', async () => {
        const setup = mockMessageViewHandler("test", "test", true, true, true, true);
        await setup.handler.onInBoxReadMessage(setup.messageView);
        expect(setup.mockDialogs.doPRROnRead).toHaveBeenCalledTimes(0);
        expect(setup.threadView.addNoticeBar).toHaveBeenCalledTimes(0);
        expect(setup.mockModel.handleMLEmailEvent).toBeCalledWith({
            email: {
                body: "test",
                from: null,
                messageId: "M1",
                subject: "test",
                threadId: "T1",
                to: null,
            },
            eventType: "EMAIL_READ_EVENT"
        });
    });

    const mockMessageViewHandler = (subject: string, body: string, isLoaded: boolean, toxic: boolean, closeMessageOnPRR: boolean, destroyAfterModel: boolean) => {
        const mockEventHandler = createMock<IInboxEventHandler>();
        const mockDialogs = createMock<IInboxDialogs>();
        const event = createMock<StubEvent>();
        const messageView = createMock<MessageView>();
        const threadView = createMock<ThreadView>();
        const mockFromContact = createMock<Contact>();
        const htmlBodyElement = createMock<HTMLElement>();
        const noticeBarElement = createMock<SimpleElementView>();
        const noticeBarHTMLElement = document.createElement("div");

        //html body
        htmlBodyElement.textContent = body;
        htmlBodyElement.innerText = body;

        //create fake contact from
        mockFromContact.name = "John Doe";
        mockFromContact.emailAddress = "johndoe@cache.com";

        //event handler for notifications
        jest.spyOn(mockEventHandler, "notifyActivity");

        //create fake message
        jest.spyOn(messageView, "getSender").mockImplementation(() => mockFromContact);
        jest.spyOn(messageView, "getThreadView").mockImplementation(() => threadView);
        jest.spyOn(messageView, "getMessageIDAsync").mockImplementation(() => new Promise(resolve => resolve("M1")));
        jest.spyOn(messageView, "isLoaded").mockImplementation(() => isLoaded);
        jest.spyOn(messageView, "getBodyElement").mockImplementation(() => htmlBodyElement);

        //create fake thread view
        jest.spyOn(threadView, "getThreadIDAsync").mockImplementation(() => new Promise(resolve => resolve("T1")));
        jest.spyOn(threadView, "getSubject").mockImplementation(() => subject);
        jest.spyOn(threadView, "addNoticeBar").mockImplementation(() => noticeBarElement);

        //create fake dialogs
        jest.spyOn(mockDialogs, "doPRROnRead").mockImplementation(() => new Promise(resolve => resolve(closeMessageOnPRR)));

        //notice bar
        noticeBarElement.el = noticeBarHTMLElement;
        jest.spyOn(noticeBarHTMLElement, "appendChild");

        let mockModel = (toxic) ? mockModelToxic : mockModelClean;
        if (destroyAfterModel) {
            mockModel = {
                handleMLEmailEvent: jest.fn((a): Promise<boolean> => new Promise((resolve) => resolve(false))),
                isToxicAsync: jest.fn((a, b, c, d, e): Promise<boolean> => new Promise((resolve) => {
                    //messageView.on("destroy", null);
                    resolve(false);
                })),
                getToxicMLThreadStatus: jest.fn((a): Promise<boolean[] | null> => new Promise((resolve) => {
                    resolve(null);
                })),
                handleUserFeedback: jest.fn((a, b, c, d): Promise<void> => new Promise(resolve => resolve())),
                notifyActivity: jest.fn((a): Promise<void> => new Promise(resolve => resolve())),
            };
        }

        //mock model
        jest.spyOn(mockModel, "handleMLEmailEvent");

        const handler = new InBoxMessageViewHandler(mockModel, mockDialogs, mockEventHandler);

        return {
            handler,
            messageView,
            threadView,
            mockDialogs,
            noticeBarElement,
            noticeBarHTMLElement,
            mockEventHandler,
            mockModel
        };
    };
})
