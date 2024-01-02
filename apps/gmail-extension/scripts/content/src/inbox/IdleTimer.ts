import {ComposeView} from "@inboxsdk/core";

interface IdleTimeoutEvent {
  (): void;
}

export class IdleTimer {
  private runEveryMs = 2000;
  private idleTime = 0;
  private totalIdleTime = 0;
  private idleInterval: NodeJS.Timer;
  private callback: IdleTimeoutEvent;
  private element: HTMLElement;
  private composeView: ComposeView;

  constructor(idleTime: number, composeView: ComposeView, callback: IdleTimeoutEvent) {
    this.composeView = composeView;
    this.element = composeView.getElement();
    this.callback = callback;
    this.idleTime = idleTime;

    this.element.addEventListener("keydown", (e => {
      this.resetTimer();
    }));
  }

  startMonitoring = () => {
    const myself = this;
    this.idleInterval = setInterval(myself.timeIncrement, 2000);
  }

  timeIncrement = () => {
    if (this.composeView.destroyed) {
      this.stopTimer();
    }

    this.totalIdleTime += 2000;
    if (this.totalIdleTime > this.idleTime) {
      this.resetTimer();
      this.callback();
    }
  }

  resetTimer = () => {
    this.totalIdleTime = 0;
  }

  stopTimer = () => {
    clearInterval(this.idleInterval);
    this.totalIdleTime = 0;
  }
}
