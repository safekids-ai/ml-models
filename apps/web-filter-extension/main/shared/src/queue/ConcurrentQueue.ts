import {Logger} from '@shared/logging/ConsoleLogger';
import {OnSuccessParam, OnFailureParam} from './PredictionQueue';

type ConcurrentQueueParams = {
  concurrency: number;
  timeout: number;
  onProcess: Function;
  onSuccess: Function;
  onFailure: Function;
  onDone?: Function;
  onDrain?: Function;
};

type IConcurrentQueue<Task> = {
  add: (task: Task) => void;
  pause: () => void;
  resume: () => void;
};

export class ConcurrentQueue<Task> implements IConcurrentQueue<Task> {
  private readonly concurrency: number;
  private readonly TIMEOUT: number;
  private count: number;
  private readonly waiting: Task[];
  private paused: boolean;
  private readonly logger: Logger;

  private readonly onProcess: Function;
  private readonly onSuccess: Function;
  private readonly onFailure: Function;
  private readonly onDone?: Function;
  private readonly onDrain?: Function;

  constructor({
                concurrency,
                timeout,
                onProcess,
                onSuccess,
                onFailure,
                onDone,
                onDrain
              }: ConcurrentQueueParams, logger: Logger) {
    this.concurrency = concurrency;
    this.TIMEOUT = timeout;
    this.count = 0;
    this.waiting = [];
    this.paused = false;

    this.onProcess = onProcess;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.onDone = onDone;
    this.logger = logger;
    if (onDrain !== undefined) this.onDrain = onDrain;
  }

  /* istanbul ignore next */
  public add(task: Task): void {
    const hasChannel = this.count < this.concurrency;

    if (hasChannel) {
      this.next(task);
      return;
    }

    this.waiting.push(task);
  }

  /* istanbul ignore next */
  private next(task: Task): void {
    this.count++;
    this.onProcess(task, (err: OnFailureParam | undefined, result: OnSuccessParam | undefined) => {
      /* istanbul ignore next */
      if (err !== undefined) {
        this.onFailure(err);
      } else {
        this.onSuccess(result);
      }

      if (this.onDone !== undefined) this.onDone(err !== undefined ? err : result);

      this.count--;
      /* istanbul ignore next */
      if (!this.paused && this.waiting.length > 0) {
        const task = this.waiting.shift() as Task;
        setTimeout(() => this.next(task), this.TIMEOUT);
        return;
      }

      if (this.count === 0 && this.waiting.length === 0) {
        if (this.onDrain !== undefined) this.onDrain();
      }
    });
  }

  /* istanbul ignore next */
  public pause(): void {
    this.paused = true;
  }

  /* istanbul ignore next */
  public resume(): void {
    if (this.waiting.length > 0) {
      const channels = this.concurrency - this.count;

      for (let i = 0; i < channels; i++) {
        const task = this.waiting.shift() as Task;
        this.next(task);
      }
    }
    this.paused = false;
  }
}
