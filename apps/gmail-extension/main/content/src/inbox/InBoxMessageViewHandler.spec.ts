import {IInboxDialogs} from "./InboxDialogs";
import {IInboxEventHandler} from "./InBoxEventHandler";
import {Contact, MessageView, SimpleElementView, ThreadView} from "@inboxsdk/core";
import {anything, capture, deepEqual, instance, mock, verify, when} from 'ts-mockito';
import {InBoxMessageViewHandler} from "./InBoxMessageViewHandler";
import {EventType, Flag} from "@shared/types/events.types";
import {EmailContact, EmailMessage} from "@shared/types/EmailMessage";

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
    verify(setup.mockDialogs.doPRROnRead()).never();
    verify(setup.mockEventHandler.notifyActivity(anything())).once();
    verify(setup.mockEventHandler.notifyActivity(deepEqual({
      eventTypeId: EventType.EMAIL_READ_EVENT,
      messageId: "M1",
      mlFlag: Flag.KIND,
      threadId: "T1",
    }))).once();
  });

  test('toxic message with PRR but user decides to close it', async () => {
    const setup = mockMessageViewHandler("test", "test", true, true, true, false);
    await setup.handler.onInBoxReadMessage(setup.messageView);

    verify(setup.mockDialogs.doPRROnRead()).once();
    verify(setup.mockThreadView.addNoticeBar()).never();
    verify(setup.mockEventHandler.notifyActivity(anything())).once();
    verify(setup.mockEventHandler.notifyActivity(deepEqual({
      eventTypeId: EventType.EMAIL_READ_PRR_EVENT,
      messageId: "M1",
      mlFlag: Flag.UNKIND,
      threadId: "T1",
      prrAction: "MESSAGE_ACTION_YES_PLEASE_CLOSE_IT",
      prrMessage: "Yes, Please",
      prrTriggered: true
    }))).once();
  });

  test('toxic message with PRR but user decides not to close it', async () => {
    const setup = mockMessageViewHandler("test", "test", true, true, false, false);
    await setup.handler.onInBoxReadMessage(setup.messageView);

    verify(setup.mockDialogs.doPRROnRead()).once();
    verify(setup.mockThreadView.addNoticeBar()).once();
    expect(setup.noticeBarHTMLElement.appendChild).toHaveBeenCalledTimes(3);
    verify(setup.mockEventHandler.notifyActivity(anything())).once();
    verify(setup.mockEventHandler.notifyActivity(deepEqual({
      eventTypeId: EventType.EMAIL_READ_PRR_EVENT,
      messageId: "M1",
      mlFlag: Flag.UNKIND,
      threadId: "T1",
      prrAction: "MESSAGE_ACTION_NO_LEAVE_IT_OPEN",
      prrMessage: "No, leave it open",
      prrTriggered: true,
      emailMessage: new EmailMessage(
        new EmailContact("John Doe", "johndoe@cache.com"),
        null,
        'test',
        'test',
        undefined,
        undefined
      ),
    }))).once();
  });

  test('toxic message but the user moves away from the message before PRR popup', async () => {
    const setup = mockMessageViewHandler("test", "test", true, true, true, true);
    await setup.handler.onInBoxReadMessage(setup.messageView);

    verify(setup.mockDialogs.doPRROnRead()).never();
    verify(setup.mockThreadView.addNoticeBar()).never();
    verify(setup.mockEventHandler.notifyActivity(anything())).once();

    // const [actualArgs] = capture(setup.mockEventHandler.notifyActivity).last();
    // const test = actualArgs;
    // console.log(test)

    verify(setup.mockEventHandler.notifyActivity(deepEqual({
      eventTypeId: EventType.EMAIL_READ_EVENT,
      messageId: "M1",
      threadId: "T1",
      mlFlag: Flag.KIND
    }))).once();
  });

  const mockMessageViewHandler = (subject: string, body: string, isLoaded: boolean, toxic: boolean, closeMessageOnPRR: boolean, destroyAfterModel: boolean) => {
    const mockEventHandler = mock<IInboxEventHandler>();
    const mockDialogs = mock<IInboxDialogs>();
    const mockEvent = mock<StubEvent>();
    const mockMessageView = mock<MessageView>();
    const mockThreadView = mock<ThreadView>();
    const mockFromContact = mock<Contact>();
    const mockHtmlBodyElement = mock<HTMLElement>();
    const mockNoticeBarElement = mock<SimpleElementView>();

    const noticeBarHTMLElement = document.createElement("div");

    const instanceEventHandler = instance(mockEventHandler);
    const instanceDialogs = instance(mockDialogs);
    const instanceEvent = instance(mockEvent);
    const instanceMessageView = instance(mockMessageView);
    const instanceThreadView = instance(mockThreadView);
    const instanceFromContact = instance(mockFromContact);
    const instanceHtmlBodyElement = instance(mockHtmlBodyElement);
    const instanceNoticeBarElement = instance(mockNoticeBarElement);

    //html body
    instanceHtmlBodyElement.textContent = body;
    instanceHtmlBodyElement.innerText = body;

    //create fake contact from
    instanceFromContact.name = "John Doe";
    instanceFromContact.emailAddress = "johndoe@cache.com";

    //event handler for notifications
    jest.spyOn(mockEventHandler, "notifyActivity");

    //create fake message
    when(mockMessageView.getSender()).thenReturn(instanceFromContact);
    when(mockMessageView.getThreadView()).thenReturn(instanceThreadView);
    when(mockMessageView.getMessageIDAsync()).thenReturn(Promise.resolve("M1"));
    when(mockMessageView.isLoaded()).thenReturn(isLoaded);
    when(mockMessageView.getBodyElement()).thenReturn(instanceHtmlBodyElement);

    //create fake thread view
    when(mockThreadView.getThreadIDAsync()).thenReturn(Promise.resolve("T1"));
    when(mockThreadView.getSubject()).thenReturn(subject);
    when(mockThreadView.addNoticeBar()).thenReturn(instanceNoticeBarElement);

    //create fake dialogs
    when(mockDialogs.doPRROnRead()).thenReturn(Promise.resolve(closeMessageOnPRR));

    //notice bar
    instanceNoticeBarElement.el = noticeBarHTMLElement;
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

    const handler = new InBoxMessageViewHandler(mockModel, instanceDialogs, instanceEventHandler);

    return {
      handler,
      messageView: instanceMessageView,
      threadView: instanceThreadView,
      noticeBarElement: instanceNoticeBarElement,
      dialogs: instanceDialogs,
      eventHandler: instanceEventHandler,
      noticeBarHTMLElement,
      mockMessageView,
      mockThreadView,
      mockNoticeBarElement,
      mockDialogs,
      mockEventHandler,
      mockModel,
    };
  };
})
