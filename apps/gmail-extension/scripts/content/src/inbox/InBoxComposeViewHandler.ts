import { ComposeView } from "@inboxsdk/core";
import { EmailNotificationEvent, EventType, Flag } from "../../../common/types/events.types";
import { PrrUserAction } from "../../../common/enum/prrAction";
import { EmailMessage } from "../../../common/types/EmailMessage";
import { ComposeOption } from "../InBoxSdkHandler";
import { InboxBackgroundCommunicator } from "./InboxBackgroundCommunicator";
import { IInboxEventHandler } from "./InBoxEventHandler";
import { IdleTimer } from "./IdleTimer";
import { IInboxDialogs } from "./InboxDialogs";
import { DOMUtils } from "../utils/DOMUtils";
import { v4 as uuidv4 } from 'uuid';

export class InBoxComposeViewHandler {
  set modelRunner(value: InboxBackgroundCommunicator) {
    this._modelRunner = value;
  }

  private maxForcedRetries = 0;
  private _threadId = "sf-" + uuidv4();
  private messsageClean: boolean = false;
  private _attemptsToChangeMessage: number = 0;
  private _modelRunner: InboxBackgroundCommunicator;
  private prrDialog: IInboxDialogs;
  private eventHandler: IInboxEventHandler;
  private idleTimer: IdleTimer;
  private interval: any;
  private oldComposeText: string;
  private composeView: ComposeView | null;

  // Set to store dismissed text
  private dismissedText = new Set<String>();

  constructor(modelRunner: InboxBackgroundCommunicator, prrDialog: IInboxDialogs, eventHandler: IInboxEventHandler) {
    this._modelRunner = modelRunner;
    this.eventHandler = eventHandler;
    this.prrDialog = prrDialog;
  }

  register(composeView: ComposeView) {
    const myself = this;
    //run to monitor keyboard changes
    this.idleTimer = new IdleTimer(3000, composeView, async () => {
      const newComposeText = composeView.getTextContent();
      if (this.oldComposeText != newComposeText) {
        this.messsageClean = false;
        this.oldComposeText = newComposeText;
        await this.highlightToxicText(composeView);
      }
    });
    this.idleTimer.startMonitoring();

    // Clear dismissed text on start
    this.dismissedText.clear();

    //add button to check compose message
    composeView.addButton({
      title: 'Check Language',
      iconUrl: chrome.runtime.getURL('public/images/icons/icon64.png'),
      //@typescript-eslint/no-unused-vars
      onClick() {
        myself.highlightToxicText(composeView);
      }
    });

    composeView.on("presending", function (event) {
      myself.onInBoxCompose(composeView, event);
    });

    composeView.on("bodyChanged", function () {
      if (myself.composeView == null) {
        myself.composeView = composeView;
      }

      myself.onInBoxComposeBodyChange(composeView);
    });

    composeView.on("destroy", function () {
      myself.composeView = null;

      //reset on destroy
      myself.resetParams();

      // Clear dismissed text on destroy
      myself.dismissedText.clear();

      if (myself.interval != null) {
        clearInterval(myself.interval);
      }
    });

  }

  onInBoxComposeBodyChange(composeView: ComposeView): void {
    this.composeView = composeView;
  }

  resetParams() {
    this.messsageClean = false;
    this._attemptsToChangeMessage = 0;
    this._threadId = "sf-" + uuidv4();
  }

  async onInBoxCompose(composeView: ComposeView, event: any): Promise<void> {
    console.log("onInBoxCompose");

    if (!this.messsageClean) {
      event.cancel();
    }

    if (this.messsageClean) {
      this.resetParams();

      // Clear dismissed text on reset
      this.dismissedText.clear();
      return;
    }

    const message = { subject: composeView.getSubject(), body: composeView.getTextContent() };
    const toxic = await this._modelRunner.isToxicAsync(null, null, message.subject + "." + message.body, 300, true);

    if (!toxic) {
      console.log("Clean Compose:" + message.subject + "." + message.body);
      if (composeView.destroyed) {
        this.resetParams();
        return;
      }

      const emailEvent: EmailNotificationEvent = {
        eventTypeId: EventType.EMAIL_SEND_EVENT
      }
      emailEvent.mlFlag = Flag.KIND
      emailEvent.threadId = this._threadId;
      this.eventHandler.notifyActivity(emailEvent)

      //reset params
      //this.resetParams();
      this.messsageClean = true;
      composeView.send();
    } else {
      this.messsageClean = false;
      if (composeView.destroyed) {
        this.resetParams();
        return;
      }
      event.mlFlag = Flag.UNKIND

      await this.highlightToxicText(composeView);

      const forceToChangeMessage = (this._attemptsToChangeMessage < this.maxForcedRetries);
      const prrResponse = forceToChangeMessage ? await this.prrDialog.doPRRComposeForceChange() :
        await this.prrDialog.doPRRComposeSendItAnyway();
      this._attemptsToChangeMessage++;

      const emailEvent: EmailNotificationEvent = {
        eventTypeId: EventType.EMAIL_SEND_EVENT,
        prrTriggered: true,
        threadId: this._threadId,
        mlFlag: Flag.UNKIND
      }
      switch (prrResponse) {
        case ComposeOption.MISTAKE: {
          emailEvent.prrMessage = "Yes, it's fine";
          emailEvent.userFlag = Flag.KIND;
          emailEvent.prrAction = PrrUserAction.COMPOSE_ACTION_YES_ITS_FINE;
          emailEvent.emailMessage = new EmailMessage(null, null, message.subject, message.body);
          this.eventHandler.notifyActivity(emailEvent);
          this.messsageClean = true;
          composeView.send();
          break;
        }
        case ComposeOption.NO_MISTAKE: {
          emailEvent.prrAction = PrrUserAction.COMPOSE_ACTION_NO_TRY_AGAIN;
          emailEvent.prrMessage = "No, let me try again";
          if (!forceToChangeMessage) {
            emailEvent.userFlag = Flag.UNKIND;
          }
          this.eventHandler.notifyActivity(emailEvent);
          break;
        }
      }
      //this.highlightToxicText(composeView); //run highlight while user decides
    }
  }

  async highlightToxicText(_composeView: ComposeView) {
    const textContent: string = _composeView.getTextContent();
    const htmlRoot: HTMLElement = _composeView.getBodyElement();
    const nodes: Set<Node> = new Set<Node>();
    const nodesToHighlight: Set<Node> = new Set<Node>();
    DOMUtils.getChildElements(nodes, htmlRoot);

    for (const node of nodes) {
      //console.log("Node:" + node.nodeName + "->" + node.nodeType);
      if (node.nodeType == Node.TEXT_NODE) {
        const plainText = node.textContent.replace(/\n/g, "").trim();
        if (!this.dismissedText.has(plainText)) {
          const toxic = await this._modelRunner.isToxicAsync(null, null, plainText, 100, true);
          if (toxic) {
            nodesToHighlight.add(node);
          }
        }
      }
    }


    //if something changed ignore the update
    if (textContent != _composeView.getTextContent()) {
      return;
    }

    //remove all dom toxic elements
    for (const node of nodes) {
      if (node.nodeType == Node.TEXT_NODE) {
        if (node.parentNode instanceof HTMLElement) {
          const htmlNode = node.parentNode as HTMLElement;
          if (htmlNode.classList.contains("sk_toxic")) {
            htmlNode.classList.remove("sk_toxic");
          }
        }
      }
    }

    //add toxic span
    for (const node of nodesToHighlight) {
      //console.log("Highlighting  node text:" + node.textContent);
      if (node.parentNode instanceof HTMLElement) {
        const htmlElement = node.parentNode as HTMLElement;
        //console.log("Parent node is " + htmlElement.tagName);
        //did we insert this ourselves
        if (htmlElement.classList.contains("sk_modify")) {
          htmlElement.classList.add("sk_toxic");
        } else {
          //create a new span
          const span = document.createElement("span");
          span.classList.add("sk_toxic", "sk_modify");
          node.parentNode.insertBefore(span, node);
          span.appendChild(node);
        }
      }
    }

    document.querySelectorAll(".sk_toxic").forEach(item => {
      const handleMouseEnter = () => {
        console.log("MOUSE EVENT ALIVE");
        // Create hover panel
        const panel = document.createElement('div');
        panel.className = 'hover-panel';

        // Add content
        const content = document.createElement('div');
        content.className = "hover-panel-content";
        content.textContent = "This sentence doesn't look kind";

        // Add button
        const button = document.createElement('button');
        button.className = 'hover-panel-button';
        button.textContent = '🗑️Dismiss';
        // Add logo
        const logo = document.createElement('div');
        logo.className = 'hover-panel-logo';
        const logoImg = document.createElement('img');
        logoImg.src = chrome.runtime.getURL('public/html/logo.svg');
        logoImg.alt = 'Logo';
        logo.appendChild(logoImg);

        // Assemble panel
        panel.appendChild(content);
        panel.appendChild(button);
        panel.appendChild(logo);

        // Add panel to element
        item.appendChild(panel);

        // Create an invisible area between text and panel
        const buffer = document.createElement('div');
        buffer.style.position = 'absolute';
        buffer.style.top = '100%';
        buffer.style.left = '0';
        buffer.style.width = '100%';
        buffer.style.height = '8px'; // Same as margin-top of panel
        item.appendChild(buffer);

        // const rect = panel.getBoundingClientRect();

        // if (rect.right > window.innerWidth) {
        //   panel.style.left = 'auto';
        //   panel.style.right = '0';
        // }

        // if (rect.bottom > window.innerHeight) {
        //   panel.style.top = 'auto';
        //   panel.style.bottom = '100%';
        //   panel.style.marginTop = '0';
        //   panel.style.marginBottom = '8px';
        // }

        // Add hover handlers to keep panel visible
        let timeoutId = null;
        const hidePanel = () => {
          timeoutId = setTimeout(() => {
            if (panel && panel.parentNode) {
              panel.remove();
            }
            if (buffer && buffer.parentNode) {
              buffer.remove();
            }
          }, 200);
        };

        const cancelHide = () => {
          clearTimeout(timeoutId);
        };

        panel.addEventListener('mousedown', (e) => {
          e.preventDefault();
        });

        panel.addEventListener('mouseenter', cancelHide);
        panel.addEventListener('mouseleave', hidePanel);
        buffer.addEventListener('mouseenter', cancelHide);
        buffer.addEventListener('mouseleave', hidePanel);
        item.addEventListener('mouseleave', hidePanel);

        // Add click handler
        button.addEventListener('click', async () => {
          item.classList.remove("sk_toxic");

          let originalText = '';

          // Find the text node (should be the first child due to how we structured it)
          if (item.firstChild && item.firstChild.nodeType === Node.TEXT_NODE) {
            originalText = item.firstChild.textContent;
          } else {
            // If somehow the structure is different, get text content excluding the panel
            originalText = Array.from(item.childNodes)
              .filter(node => node.nodeType === Node.TEXT_NODE)
              .map(node => node.textContent)
              .join('');
          }

          // Create new text node with original text only
          const textNode = document.createTextNode(originalText);

          // Replace the span with just the text
          if (item.parentNode) {
            item.parentNode.replaceChild(textNode, item);
            this.dismissedText.add(originalText.replace(/\n/g, "").trim());
          }

          // item.removeEventListener('mouseenter', handleMouseEnter);
          hidePanel();

          await this.highlightToxicText(_composeView);
        });
      }

      item.addEventListener('mouseenter', handleMouseEnter);
    });
  }

  get threadId(): string {
    return this._threadId;
  }

  get attemptsToChangeMessage(): number {
    return this._attemptsToChangeMessage;
  }
}
