import {InBoxComposeViewHandler} from "./InBoxComposeViewHandler";
import {IInboxDialogs} from "./InboxDialogs";
import {IInboxEventHandler} from "./InBoxEventHandler";
import {ComposeOption} from "../InBoxSdkHandler";
import {ComposeView} from "@inboxsdk/core";
import {createMock} from 'ts-auto-mock';

const mockBackgroundCommunicatorToxic = {
    handleMLEmailEvent: jest.fn((a): Promise<boolean> => new Promise((resolve) => resolve(true))),
    isToxicAsync: jest.fn((a, b, c, d, e): Promise<boolean> => new Promise((resolve) => resolve(true))),
    getToxicMLThreadStatus: jest.fn((a): Promise<boolean[] | null> => new Promise((resolve) => {
        resolve(null);
    })),
    handleUserFeedback: jest.fn((a, b, c, d): Promise<void> => new Promise(resolve => resolve())),
    notifyActivity: jest.fn((a): Promise<void> => new Promise(resolve => resolve())),
}
const mockBackgroundComnunicatorClean = {
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

describe("content => InBoxComposeViewHandler", () => {
    test('clean message sent success', async () => {
        const setup = mockComposeViewHandler("test", "test", ComposeOption.NO_MISTAKE, false, false);
        const threadId = setup.handler.threadId;

        //throw 2 events... one top stop compose and the other to send it
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);
        expect(setup.event.cancel).toHaveBeenCalledTimes(1);
        expect(setup.composeView.send).toHaveBeenCalledTimes(1);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenCalledWith({
            eventTypeId: "EMAIL_SEND_EVENT",
            mlFlag: "KIND",
            threadId: threadId
        });
        expect(setup.handler.threadId).not.toBe(threadId);
    });

    test('clean message not sent since compose was closed', async () => {
        const setup = mockComposeViewHandler("test", "test", ComposeOption.NO_MISTAKE, false, true);
        const threadId = setup.handler.threadId;
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);
        expect(setup.event.cancel).toHaveBeenCalledTimes(1);
        expect(setup.composeView.send).toHaveBeenCalledTimes(0);
        expect(setup.handler.attemptsToChangeMessage).toEqual(0);
        expect(setup.handler.threadId).not.toBe(threadId);
    });

    test('toxic message with prr sent due to mistake', async () => {
        const setup = mockComposeViewHandler("test", "test", ComposeOption.MISTAKE, true, false);
        const threadId = setup.handler.threadId;

        //1st to cancel send event and show a forced PRR
        //2rd to redo PRR
        //3th is to send
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);

        //initial forced PRR
        expect(setup.event.cancel).toHaveBeenCalledTimes(2);
        expect(setup.mockDialogs.doPRRComposeForceChange).toHaveBeenCalledTimes(1);
        expect(setup.mockDialogs.doPRRComposeSendItAnyway).toHaveBeenCalledTimes(1);
        expect(setup.composeView.send).toHaveBeenCalledTimes(1);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenCalledTimes(2);

        expect(setup.mockEventHandler.notifyActivity).toHaveBeenNthCalledWith(1, {
            eventTypeId: "EMAIL_SEND_EVENT",
            mlFlag: "UNKIND",
            prrAction: "COMPOSE_ACTION_NO_TRY_AGAIN",
            prrMessage: "No, let me try again",
            prrTriggered: true,
            threadId: threadId,
        });

        expect(setup.mockEventHandler.notifyActivity).toHaveBeenNthCalledWith(2, {
            emailMessage: {
                body: "test",
                from: null,
                messageId: undefined,
                subject: "test",
                threadId: undefined,
                to: null,
            },
            eventTypeId: "EMAIL_SEND_EVENT",
            mlFlag: "UNKIND",
            prrAction: "COMPOSE_ACTION_YES_ITS_FINE",
            prrMessage: "Yes, it's fine",
            prrTriggered: true,
            threadId: threadId,
            userFlag: "KIND"
        });
        expect(setup.handler.threadId).not.toBe(threadId);
    });

    test('toxic message with prr not sent since view was closed', async () => {
        const setup = mockComposeViewHandler("test", "test", ComposeOption.MISTAKE, true, true);
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);

        expect(setup.event.cancel).toHaveBeenCalledTimes(1);
        expect(setup.mockDialogs.doPRRComposeForceChange).toHaveBeenCalledTimes(0);
        expect(setup.mockDialogs.doPRRComposeSendItAnyway).toHaveBeenCalledTimes(0);
        expect(setup.handler.attemptsToChangeMessage).toEqual(0);
        expect(setup.composeView.send).toHaveBeenCalledTimes(0);
    });


    test('toxic message with prr not sent since it was a bad message', async () => {
        const setup = mockComposeViewHandler("test", "test", ComposeOption.NO_MISTAKE, true, false);
        const threadId = setup.handler.threadId;

        //1st is the forced PRR
        //2nd is the let's try again
        //3rd one is a clean message
        //4th one is a send event
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);
        setup.handler.modelRunner = mockBackgroundComnunicatorClean;
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);
        await setup.handler.onInBoxCompose(setup.composeView, setup.event);

        //initial forced PRR
        expect(setup.event.cancel).toHaveBeenCalledTimes(3);
        expect(setup.mockDialogs.doPRRComposeForceChange).toHaveBeenCalledTimes(1);
        expect(setup.mockDialogs.doPRRComposeSendItAnyway).toHaveBeenCalledTimes(1);
        expect(setup.composeView.send).toHaveBeenCalledTimes(1);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenCalledTimes(3);

        expect(setup.mockEventHandler.notifyActivity).toHaveBeenNthCalledWith(1, {
            eventTypeId: "EMAIL_SEND_EVENT",
            mlFlag: "UNKIND",
            prrAction: "COMPOSE_ACTION_NO_TRY_AGAIN",
            prrMessage: "No, let me try again",
            prrTriggered: true,
            threadId: threadId,
        });

        expect(setup.mockEventHandler.notifyActivity).toHaveBeenNthCalledWith(2, {
            eventTypeId: "EMAIL_SEND_EVENT",
            mlFlag: "UNKIND",
            prrAction: "COMPOSE_ACTION_NO_TRY_AGAIN",
            prrMessage: "No, let me try again",
            prrTriggered: true,
            threadId: threadId,
            userFlag: "UNKIND"
        });

        expect(setup.mockEventHandler.notifyActivity).toHaveBeenNthCalledWith(3, {
            eventTypeId: "EMAIL_SEND_EVENT",
            mlFlag: "KIND",
            threadId: threadId,
        });

        expect(setup.handler.threadId).not.toBe(threadId);
    });

    const mockComposeViewHandler = (subject: string, body: string, composeOption: ComposeOption, toxic: boolean, destroyView: boolean) => {
        const mockEventHandler = createMock<IInboxEventHandler>();
        const mockDialogs = createMock<IInboxDialogs>();
        const event = createMock<StubEvent>();
        const composeView = createMock<ComposeView>({
            destroyed: destroyView
        });

        jest.spyOn(mockEventHandler, "notifyActivity");
        jest.spyOn(mockDialogs, "doPRRComposeForceChange").mockImplementation(() => new Promise(resolve => resolve(ComposeOption.NO_MISTAKE)));
        jest.spyOn(mockDialogs, "doPRRComposeSendItAnyway").mockImplementation(() => new Promise(resolve => resolve(composeOption)));
        jest.spyOn(event, "cancel");
        jest.spyOn(composeView, "getSubject").mockImplementation(() => subject);
        jest.spyOn(composeView, "getTextContent").mockImplementation(() => body);
        jest.spyOn(composeView, "send");

        const mockModel = (toxic) ? mockBackgroundCommunicatorToxic : mockBackgroundComnunicatorClean;

        const handler = new InBoxComposeViewHandler(mockModel, mockDialogs, mockEventHandler);

        return {handler, composeView, mockDialogs, event, mockEventHandler};
    };
})
