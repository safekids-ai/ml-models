import {ComposeView, Contact, MessageView, SimpleElementView, ThreadRowView, ThreadView} from "@inboxsdk/core";
import {mock, instance, when, verify, anything, deepEqual} from 'ts-mockito';
import {InboxThreadViewHandler} from "./InboxThreadViewHandler";
import {IInboxEventHandler} from "./InBoxEventHandler";
import {ComposeOption} from "@src/InBoxSdkHandler";
import {EmailNotificationEvent, EventType, Flag} from "@shared/types/events.types";

function createClassFromType<T>(defaults: Partial<T>): new () => T {
  return class {
    constructor() {
      Object.assign(this, defaults);
    }
  } as any;
}

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

    const threadRowViewInstance = setup.instanceThreadRowView;
    const eventHandlerInstance = setup.instanceEventHandler;

    await setup.handler.onInBoxSubject(threadRowViewInstance);

    verify(setup.mockThreadRowView.addLabel(anything())).never();
    verify(setup.mockEventHandler.notifyActivity(anything())).never();
  });

  test('toxic message on thread view', async () => {
    const setup = mockThreadRowViewHandler("test", true, false);

    const threadRowViewInstance = setup.instanceThreadRowView;
    const eventHandlerInstance = setup.instanceEventHandler;

    await setup.handler.onInBoxSubject(threadRowViewInstance);

    verify(setup.mockThreadRowView.addLabel(anything())).once();
    verify(setup.mockEventHandler.notifyActivity(anything())).once();

    const notificationEvent: EmailNotificationEvent = {
      eventTypeId: EventType.EMAIL_THREAD_READ_EVENT,
      messageId: null,
      threadId: "T1",
      mlFlag: Flag.UNKIND,
    }

    verify(setup.mockEventHandler.notifyActivity(deepEqual(notificationEvent))).once();
  });

  test('toxic message on thread view but view is closed', async () => {
    const setup = mockThreadRowViewHandler("test", true, true);
    const threadRowViewInstance = setup.instanceThreadRowView;
    const eventHandlerInstance = setup.instanceEventHandler;

    await setup.handler.onInBoxSubject(threadRowViewInstance);

    verify(setup.mockThreadRowView.addLabel(anything())).never();
  });

  let mockThreadRowViewHandler = (subject: string, toxic: boolean, destroyView: boolean) => {
    const mockEventHandler = mock<IInboxEventHandler>();
    const ThreadRowViewClass = createClassFromType<ThreadRowView>({
      destroyed: destroyView
    });

    const threadRowViewInstance = new ThreadRowViewClass();
    const mockThreadRowView = mock<typeof threadRowViewInstance>();
    when(mockThreadRowView.destroyed).thenReturn(destroyView);

    //create fake message
    when(mockThreadRowView.getSubject()).thenReturn(subject);
    when(mockThreadRowView.getThreadIDAsync()).thenReturn(Promise.resolve("T1"));

    // jest.spyOn(mockThreadRowView, "getSubject").mockImplementation(() => subject);
    // jest.spyOn(mockThreadRowView, "getThreadID").mockImplementation(() => "T1");
    jest.spyOn(mockEventHandler, "notifyActivity");

    let mockModel = (toxic) ? mockModelToxic : mockModelClean;
    const instanceEventHandler = instance(mockEventHandler);
    const instanceThreadRowView = instance(mockThreadRowView);

    const handler = new InboxThreadViewHandler(mockModel, instanceEventHandler);

    return {
      handler,
      mockThreadRowView,
      mockEventHandler,
      instanceThreadRowView,
      instanceEventHandler
    };
  };
})
