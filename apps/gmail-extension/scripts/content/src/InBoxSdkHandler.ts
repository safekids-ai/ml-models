import * as InboxSDK from '@inboxsdk/core';
import {
  ToolbarButtonOnClickEvent
} from '@inboxsdk/core';
import {InboxDialogs} from "./inbox/InboxDialogs";
import {InboxBackgroundCommunicator} from "./inbox/InboxBackgroundCommunicator";
import {InboxThreadViewHandler} from "./inbox/InboxThreadViewHandler";
import {InBoxMessageViewHandler} from "./inbox/InBoxMessageViewHandler";
import {InBoxEventHandler} from "./inbox/InBoxEventHandler";
import {InBoxComposeViewHandler} from "./inbox/InBoxComposeViewHandler";
import {InBoxToolbarHandler} from "./inbox/InBoxToolbarHandler";

export class InBoxSdkHandler {
  private SDK: InboxSDK.InboxSDK;
  private prrDialog: InboxDialogs;
  private backgroundCommunicator: InboxBackgroundCommunicator;
  private threadViewHandler: InboxThreadViewHandler;
  private messageViewHandler: InBoxMessageViewHandler;
  private eventHandler: InBoxEventHandler;
  private composeEventHandler: InBoxComposeViewHandler;
  private toolbarHandler: InBoxToolbarHandler;

  constructor() {
  }

  public async load() {
    const inboxOpts = {};
    const prrScriptUrl = chrome.runtime.getURL("webPageScript.js");

    this.SDK = await InboxSDK.load(2, "sdk_safekids-ai_b61c1f6d1c", inboxOpts);

    this.backgroundCommunicator = new InboxBackgroundCommunicator();
    this.eventHandler = new InBoxEventHandler(this.backgroundCommunicator);
    this.prrDialog = new InboxDialogs(this.SDK, this, this.eventHandler);
    await this.prrDialog.doLoad();

    this.threadViewHandler = new InboxThreadViewHandler(this.backgroundCommunicator, this.eventHandler);
    this.messageViewHandler = new InBoxMessageViewHandler(this.backgroundCommunicator, this.prrDialog, this.eventHandler);
    this.composeEventHandler = new InBoxComposeViewHandler(this.backgroundCommunicator, this.prrDialog, this.eventHandler);
    this.toolbarHandler = new InBoxToolbarHandler(this.prrDialog, this.eventHandler, this.backgroundCommunicator);

    let myself = this;


    /**
     * Gets call on listing of subject
     */
    this.SDK.Lists.registerThreadRowViewHandler((threadRowView) => {
      myself.threadViewHandler.onInBoxSubject(threadRowView);
    });

    /**
     * Gets call on presending on Compose
     */
    this.SDK.Compose.registerComposeViewHandler((composeView) => {
      myself.composeEventHandler.register(composeView);
    });

    /**
     * Gets called when you open the message
     */
    this.SDK.Conversations.registerMessageViewHandler((messageView) => {
      myself.messageViewHandler.onInBoxReadMessage(messageView);
    });

    this.SDK.Toolbars.registerThreadButton({
      title: "Flag as unkind",
      iconUrl: chrome.runtime.getURL('public/images/icons/icon64.png'),
      positions: ["THREAD", "ROW", "LIST"],
      onClick(event: ToolbarButtonOnClickEvent) {
        myself.toolbarHandler.handleToolbarButtonClick(event);
      },
      hasDropdown: false
    })
  }
}

export enum ComposeOption {
  MISTAKE,
  NO_MISTAKE,
}

export enum FlagOption {
  INAPPROPRIATE,
  APPROPRIATE,
}
