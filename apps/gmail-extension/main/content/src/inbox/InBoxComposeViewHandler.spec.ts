import {InBoxComposeViewHandler} from "./InBoxComposeViewHandler";
import {IInboxDialogs} from "./InboxDialogs";
import {IInboxEventHandler} from "./InBoxEventHandler";
import {ComposeOption} from "../InBoxSdkHandler";
import {ComposeView} from "@inboxsdk/core";
import {anything, capture, deepEqual, instance, mock, verify, when} from 'ts-mockito';
import {EmailNotificationEvent, EventType, Flag} from "@shared/types/events.types";
import {EmailMessage} from "@shared/types/EmailMessage";

function createClassFromType<T>(defaults: Partial<T>): new () => T {
  return class {
    constructor() {
      Object.assign(this, defaults);
    }
  } as any;
}

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
    const instanceComposeView = setup.instanceComposeView;
    const instanceEvent = setup.instanceEvent;

    await setup.handler.onInBoxCompose(instanceComposeView, instanceEvent);
    await setup.handler.onInBoxCompose(instanceComposeView, instanceEvent);

    const expected: EmailNotificationEvent = {
      eventTypeId: EventType.EMAIL_SEND_EVENT,
      mlFlag: Flag.KIND,
      threadId: threadId,
    }

    verify(setup.mockEvent.cancel()).once();
    verify(setup.mockComposeView.send()).once();
    verify(setup.mockEventHandler.notifyActivity(deepEqual(expected))).once();
    expect(setup.handler.threadId).not.toBe(threadId);
  });

  test('clean message not sent since compose was closed', async () => {
    const setup = mockComposeViewHandler("test", "test", ComposeOption.NO_MISTAKE, false, true);
    const threadId = setup.handler.threadId;

    const instanceComposeView = setup.instanceComposeView;
    const instanceEvent = setup.instanceEvent;

    await setup.handler.onInBoxCompose(instanceComposeView, instanceEvent);
    verify(setup.mockEvent.cancel()).once();
    verify(setup.mockComposeView.send()).never();
    expect(setup.handler.attemptsToChangeMessage).toEqual(0);
    expect(setup.handler.threadId).not.toBe(threadId);
  });

  test('toxic message with prr sent due to mistake', async () => {
    const setup = mockComposeViewHandler("test", "test", ComposeOption.MISTAKE, true, false);
    const threadId = setup.handler.threadId;

    const instanceComposeView = setup.instanceComposeView;
    const instanceEvent = setup.instanceEvent;

    //1st to cancel send event and show a forced PRR
    //2nd is to send
    await setup.handler.onInBoxCompose(instanceComposeView, instanceEvent);
    await setup.handler.onInBoxCompose(instanceComposeView, instanceEvent);

    const expected: EmailNotificationEvent = {
      eventTypeId: EventType.EMAIL_SEND_EVENT,
      prrTriggered: true,
      threadId: threadId,
      mlFlag: Flag.UNKIND,
      prrMessage: "Yes, it's fine",
      userFlag: Flag.KIND,
      prrAction: "COMPOSE_ACTION_YES_ITS_FINE",
      emailMessage: new EmailMessage(
        null,
        null,
        'test',
        'test',
        undefined,
        undefined
      ),
    }


    //initial forced PRR
    verify(setup.mockEvent.cancel()).once();
    verify(setup.mockDialogs.doPRRComposeForceChange()).never();
    verify(setup.mockDialogs.doPRRComposeSendItAnyway()).once();
    verify(setup.mockComposeView.send()).once();
    verify(setup.mockEventHandler.notifyActivity(anything())).once();
    verify(setup.mockEventHandler.notifyActivity(deepEqual(expected))).once();
  })

  test('toxic message with prr not sent since view was closed', async () => {
    const setup = mockComposeViewHandler("test", "test", ComposeOption.MISTAKE, true, true);

    const instanceComposeView = setup.instanceComposeView;
    const instanceEvent = setup.instanceEvent;

    await setup.handler.onInBoxCompose(instanceComposeView, instanceEvent);

    verify(setup.mockEvent.cancel()).once();
    verify(setup.mockDialogs.doPRRComposeForceChange()).never();
    verify(setup.mockDialogs.doPRRComposeSendItAnyway()).never();
    verify(setup.mockComposeView.send()).never();
    verify(setup.mockEventHandler.notifyActivity(anything())).never();
    expect(setup.handler.attemptsToChangeMessage).toEqual(0);
  });


  test('toxic message with prr not sent since it was a bad message', async () => {
    const setup = mockComposeViewHandler("test", "test", ComposeOption.NO_MISTAKE, true, false);
    const threadId = setup.handler.threadId;

    const instanceComposeView = setup.instanceComposeView;
    const instanceEvent = setup.instanceEvent;

    //1st is the forced PRR
    //2nd one is a clean message
    //3rd one is a send event
    await setup.handler.onInBoxCompose(instanceComposeView, instanceEvent);
    setup.handler.modelRunner = mockBackgroundComnunicatorClean;
    await setup.handler.onInBoxCompose(instanceComposeView, instanceEvent);

    verify(setup.mockEvent.cancel()).twice();
    verify(setup.mockComposeView.send()).once();
    verify(setup.mockDialogs.doPRRComposeForceChange()).never();
    verify(setup.mockDialogs.doPRRComposeSendItAnyway()).once();
    verify(setup.mockEventHandler.notifyActivity(anything())).twice();

    const first: EmailNotificationEvent = {
      eventTypeId: EventType.EMAIL_SEND_EVENT,
      prrTriggered: true,
      threadId: threadId,
      mlFlag: Flag.UNKIND,
      prrMessage: "No, let me try again",
      userFlag: Flag.UNKIND,
      prrAction: "COMPOSE_ACTION_NO_TRY_AGAIN"
    }

    const second: EmailNotificationEvent = {
      eventTypeId: EventType.EMAIL_SEND_EVENT,
      threadId: threadId,
      mlFlag: Flag.KIND,
    }

    verify(setup.mockEventHandler.notifyActivity(deepEqual(first))).once();
    verify(setup.mockEventHandler.notifyActivity(deepEqual(second))).once();

    // const [actualArgs] = capture(setup.mockEventHandler.notifyActivity).last();
    // const test = actualArgs;
    // console.log(test)

  });

  const mockComposeViewHandler = (subject: string, body: string, composeOption: ComposeOption, toxic: boolean, destroyView: boolean) => {
    const mockEventHandler = mock<IInboxEventHandler>();
    const mockDialogs = mock<IInboxDialogs>();
    const mockEvent = mock<StubEvent>();
    const ComposeViewClass = createClassFromType<ComposeView>({
      destroyed: destroyView
    });

    const composeViewInstance = new ComposeViewClass();
    const mockComposeView = mock<typeof composeViewInstance>();
    when(mockComposeView.destroyed).thenReturn(destroyView);

    jest.spyOn(mockEventHandler, "notifyActivity");
    when(mockDialogs.doPRRComposeForceChange()).thenResolve(ComposeOption.NO_MISTAKE)
    when(mockDialogs.doPRRComposeSendItAnyway()).thenResolve(composeOption);
    jest.spyOn(mockEvent, "cancel");
    when(mockComposeView.getSubject()).thenReturn(subject);
    when(mockComposeView.getTextContent()).thenReturn(body);
    jest.spyOn(mockComposeView, "send");

    const mockModel = (toxic) ? mockBackgroundCommunicatorToxic : mockBackgroundComnunicatorClean;

    const instanceComposeView = instance(mockComposeView);
    const instanceEvent = instance(mockEvent);
    const instanceMockEventHandler = instance(mockEventHandler);
    const instanceMockDialogs = instance(mockDialogs);

    const handler = new InBoxComposeViewHandler(mockModel, instanceMockDialogs, instanceMockEventHandler);

    return {
      handler,
      mockComposeView,
      mockDialogs,
      mockEvent,
      mockEventHandler,
      instanceComposeView,
      instanceEvent,
      instanceMockEventHandler
    };
  };
})
