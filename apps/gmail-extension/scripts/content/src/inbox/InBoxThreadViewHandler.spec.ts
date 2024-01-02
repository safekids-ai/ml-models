import {ComposeView, Contact, MessageView, SimpleElementView, ThreadRowView, ThreadView} from "@inboxsdk/core";
import {createMock} from 'ts-auto-mock';
import {InboxThreadViewHandler} from "./InboxThreadViewHandler";
import {IInboxEventHandler} from "./InBoxEventHandler";

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

describe("content => InBoxThreadViewHandler", () => {
    test('clean message on thread view', async () => {
        const setup = mockThreadRowViewHandler("test", false, false);
        await setup.handler.onInBoxSubject(setup.threadRowView);

        expect(setup.threadRowView.addLabel).toHaveBeenCalledTimes(0);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenCalledTimes(0);
    });

    test('toxic message on thread view', async () => {
        const setup = mockThreadRowViewHandler("test", true, false);
        await setup.handler.onInBoxSubject(setup.threadRowView);
        expect(setup.threadRowView.addLabel).toHaveBeenCalledTimes(1);
        expect(setup.mockEventHandler.notifyActivity).toHaveBeenCalledTimes(1);
        expect(setup.mockEventHandler.notifyActivity).toBeCalledWith({
            eventTypeId: 'EMAIL_THREAD_READ_EVENT',
            messageId: null,
            mlFlag: 'UNKIND',
            threadId: "T1",
        });
    });

    test('toxic message on thread view but view is closed', async () => {
        const setup = mockThreadRowViewHandler("test", true, true);
        await setup.handler.onInBoxSubject(setup.threadRowView);
        expect(setup.threadRowView.addLabel).toHaveBeenCalledTimes(0);
    });

    let mockThreadRowViewHandler = (subject: string, toxic: boolean, destroyView: boolean) => {
        const mockEventHandler = createMock<IInboxEventHandler>();
        const threadRowView = createMock<ThreadRowView>({
            destroyed: destroyView
        });
        //create fake message
        jest.spyOn(threadRowView, "getSubject").mockImplementation(() => subject);
        jest.spyOn(threadRowView, "getThreadID").mockImplementation(() => "T1");
        jest.spyOn(mockEventHandler, "notifyActivity");

        let mockModel = (toxic) ? mockModelToxic : mockModelClean;
        const handler = new InboxThreadViewHandler(mockModel, mockEventHandler);

        return {handler, threadRowView, mockEventHandler};
    };
})
