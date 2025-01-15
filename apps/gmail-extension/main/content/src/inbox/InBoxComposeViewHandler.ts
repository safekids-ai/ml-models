import { ComposeView } from '@inboxsdk/core';
import {
  EmailNotificationEvent,
  EventType,
  Flag,
} from '@shared/types/events.types';
import { PrrUserAction } from '@shared/enum/prrAction';
import { EmailMessage } from '@shared/types/EmailMessage';
import { ComposeOption } from '@src/InBoxSdkHandler';
import { InboxBackgroundCommunicator } from '@src/inbox/InboxBackgroundCommunicator';
import { IInboxEventHandler } from '@src/inbox/InBoxEventHandler';
import { IdleTimer } from '@src/inbox/IdleTimer';
import { IInboxDialogs } from '@src/inbox/InboxDialogs';
import { DOMUtils } from '@src/utils/DOMUtils';
import { v4 as uuidv4 } from 'uuid';

export class InBoxComposeViewHandler {
  set modelRunner(value: InboxBackgroundCommunicator) {
    this._modelRunner = value;
  }

  private maxForcedRetries = 0;
  private _threadId = 'sf-' + uuidv4();
  private messsageClean: boolean = false;
  private _attemptsToChangeMessage: number = 0;
  private _modelRunner: InboxBackgroundCommunicator;
  private prrDialog: IInboxDialogs;
  private eventHandler: IInboxEventHandler;
  private idleTimer: IdleTimer;
  private interval: any;
  private oldComposeText: string;
  private composeView: ComposeView | null;

  constructor(
    modelRunner: InboxBackgroundCommunicator,
    prrDialog: IInboxDialogs,
    eventHandler: IInboxEventHandler,
  ) {
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

    //add button to check compose message
    composeView.addButton({
      title: 'Check Language',
      iconUrl: chrome.runtime.getURL('icon64.png'),
      //@typescript-eslint/no-unused-vars
      onClick() {
        myself.highlightToxicText(composeView);
      },
    });

    composeView.on('presending', function (event) {
      myself.onInBoxCompose(composeView, event);
    });

    composeView.on('bodyChanged', function () {
      if (myself.composeView == null) {
        myself.composeView = composeView;
      }

      myself.onInBoxComposeBodyChange(composeView);
    });

    composeView.on('destroy', function () {
      myself.composeView = null;

      //reset on destroy
      myself.resetParams();

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
    this._threadId = 'sf-' + uuidv4();
  }

  async onInBoxCompose(composeView: ComposeView, event: any): Promise<void> {
    if (!this.messsageClean) {
      event.cancel();
    }

    if (this.messsageClean) {
      this.resetParams();
      return;
    }

    const message = {
      subject: composeView.getSubject(),
      body: composeView.getTextContent(),
    };
    const toxic = await this._modelRunner.isToxicAsync(
      null,
      null,
      message.subject + '.' + message.body,
      300,
      true,
    );

    if (!toxic) {
      console.log('Clean Compose:' + message.subject + '.' + message.body);
      if (composeView.destroyed) {
        this.resetParams();
        return;
      }

      const emailEvent: EmailNotificationEvent = {
        eventTypeId: EventType.EMAIL_SEND_EVENT,
      };
      emailEvent.mlFlag = Flag.KIND;
      emailEvent.threadId = this._threadId;
      this.eventHandler.notifyActivity(emailEvent);
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
      event.mlFlag = Flag.UNKIND;
      const forceToChangeMessage =
        this._attemptsToChangeMessage < this.maxForcedRetries;
      const prrResponse = forceToChangeMessage
        ? await this.prrDialog.doPRRComposeForceChange()
        : await this.prrDialog.doPRRComposeSendItAnyway();
      this._attemptsToChangeMessage++;

      const emailEvent: EmailNotificationEvent = {
        eventTypeId: EventType.EMAIL_SEND_EVENT,
        prrTriggered: true,
        threadId: this._threadId,
        mlFlag: Flag.UNKIND,
      };
      switch (prrResponse) {
        case ComposeOption.MISTAKE: {
          emailEvent.prrMessage = "Yes, it's fine";
          emailEvent.userFlag = Flag.KIND;
          emailEvent.prrAction = PrrUserAction.COMPOSE_ACTION_YES_ITS_FINE;
          emailEvent.emailMessage = new EmailMessage(
            null,
            null,
            message.subject,
            message.body,
          );
          this.eventHandler.notifyActivity(emailEvent);
          this.messsageClean = true;
          composeView.send();
          break;
        }
        case ComposeOption.NO_MISTAKE: {
          emailEvent.prrAction = PrrUserAction.COMPOSE_ACTION_NO_TRY_AGAIN;
          emailEvent.prrMessage = 'No, let me try again';
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
        const plainText = node.textContent;
        const toxic = await this._modelRunner.isToxicAsync(
          null,
          null,
          plainText,
          100,
          true,
        );
        if (toxic) {
          nodesToHighlight.add(node);
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
          if (htmlNode.classList.contains('sk_toxic')) {
            htmlNode.classList.remove('sk_toxic');
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
        let span: HTMLSpanElement | undefined;
        if (htmlElement.classList.contains('sk_modify')) {
          htmlElement.classList.add('sk_toxic');
          span = htmlElement;
        } else {
          //create a new span
          span = document.createElement('span');
          span.classList.add('sk_toxic', 'sk_modify');
          node.parentNode.insertBefore(span, node);
          span.appendChild(node);
        }
        let hasCreatedTooltip = false;
        let isMouseOverTooltip = false;
        let isMouseOverSpan = true;

        span.addEventListener('mouseover', () => {
          isMouseOverSpan = true;
          if (hasCreatedTooltip) return;
          if (span.classList.contains('sk_toxic')) {
            hasCreatedTooltip = true;
            span.classList.add('span_hover');

            function positionTooltip(div: HTMLDivElement) {
              const rect = span.getBoundingClientRect();
              const parentRect = span.parentElement.getBoundingClientRect()
              const tooltipWidth = 250;
              const min = parentRect.left
              const max = parentRect.left + parentRect.width - tooltipWidth;

              let positionLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
              let positionTop = rect.top + rect.height + 10;

              if (positionLeft < min) {
                positionLeft = min;
              }

              if (positionLeft > max) {
                positionLeft = max;
              }

              div.style.left = `${positionLeft}px`;
              div.style.top = `${positionTop}px`;
              div.style.width = `${tooltipWidth}px`;
            }

            function createButtonGroup(parentDiv: HTMLDivElement) {
              const noButton = document.createElement('button');
              const yesButton = document.createElement('button');
              noButton.className = 'tooltipBtn';
              noButton.textContent = `✓ I'll fix it`;

              noButton.onclick = () => {
                document.body.removeChild(parentDiv);
                span.classList.remove('span_hover');
                isMouseOverSpan = false;
                isMouseOverTooltip = false;
                hasCreatedTooltip = false;
              };

              yesButton.className = 'tooltipBtn';
              yesButton.textContent = `🗑️ This text is kind`;

              yesButton.onclick = () => {
                document.body.removeChild(parentDiv);
                isMouseOverSpan = false;
                isMouseOverTooltip = false;
                hasCreatedTooltip = false;

                const parentElement = span.parentElement;
                const textContent = span.textContent;
                const textNode = document.createTextNode(textContent);
                parentElement.replaceChild(textNode, span);
                // Make API Call
              };

              const buttonGroupDiv = document.createElement('div');
              buttonGroupDiv.className = 'tooltipBtnGroup';
              buttonGroupDiv.appendChild(noButton);
              buttonGroupDiv.appendChild(yesButton);

              return buttonGroupDiv;
            }
            function createTooltip(): {
              parentDiv: HTMLDivElement;
              div: HTMLDivElement;
            } {
              const div = document.createElement('div');
              div.className = 'tooltip';
              div.innerHTML = `<p>This text doesn't look kind</p>`;

              const parentDiv = document.createElement('div');
              parentDiv.setAttribute('contenteditable', 'false');
              parentDiv.className = 'tooltip_container';

              const buttonGroupDiv = createButtonGroup(parentDiv);

              const logo = document.createElement('div');
              logo.className = 'tooltip_logo';
              const logoImg = document.createElement('img');
              logoImg.src = chrome.runtime.getURL('images/logo.svg');
              logoImg.alt = 'Logo';
              logo.appendChild(logoImg);

              div.appendChild(buttonGroupDiv);
              div.appendChild(logo);

              parentDiv.appendChild(div);
              document.body.appendChild(parentDiv);

              return { parentDiv, div };
            }

            const { parentDiv, div } = createTooltip();
            positionTooltip(div);

            function handleResize() {
              positionTooltip(div);
            }

            window.addEventListener('resize', handleResize);

            function removeTooltip(parentDiv: HTMLDivElement) {
              setTimeout(() => {
                if (!isMouseOverTooltip && !isMouseOverSpan) {
                  if (!document.body.contains(parentDiv)) return;
                  document.body.removeChild(parentDiv);
                  span.classList.remove('span_hover');
                  isMouseOverSpan = false;
                  isMouseOverTooltip = false;
                  hasCreatedTooltip = false;
                  window.removeEventListener('resize', handleResize);
                }
              }, 800);
            }

            div.addEventListener('mouseleave', () => {
              isMouseOverTooltip = false;
              removeTooltip(parentDiv);
            });
            div.addEventListener('mouseover', () => {
              isMouseOverTooltip = true;
            });
            span.addEventListener('mouseleave', () => {
              isMouseOverSpan = false;
              if (span.classList.contains('sk_toxic')) {
                removeTooltip(parentDiv);
              }
            });
          }
        });
      }
    }
  }

  get threadId(): string {
    return this._threadId;
  }

  get attemptsToChangeMessage(): number {
    return this._attemptsToChangeMessage;
  }
}
