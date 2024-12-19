import {Logger} from '@shared/logging/ConsoleLogger';
import {MLModel} from '@shared/types/MLModel.type';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {ConcurrentQueue} from './ConcurrentQueue';
import {QueueBase, TabIdUrl} from './QueueBase';

type HandlerParams = {
  url: string;
  tabIdUrl: TabIdUrl;
  image: ImageData | string;
  result: boolean;
  error: Error;
  type: string;
};

type OnProcessParam = Pick<HandlerParams, 'url' | 'image' | 'tabIdUrl' | 'type'>;
export type OnSuccessParam = Pick<HandlerParams, 'url' | 'result'>;
export type OnFailureParam = Pick<HandlerParams, 'url' | 'error'>;
type OnDoneParam = Pick<HandlerParams, 'url'>;

export type CallbackFunction = (err: unknown | undefined, result: unknown | undefined) => undefined;

export class PredictionQueue extends QueueBase {
  protected readonly predictionQueue: ConcurrentQueue<OnProcessParam>;

  constructor(models: Map<string, MLModel>, logger: Logger, store: ReduxStorage) {
    super(models, logger, store);

    this.predictionQueue = new ConcurrentQueue(
      {
        concurrency: 1, // We dont need more concurrent jobs here because this queue does CPU-bound task, it means that it blocks event loop anyway
        timeout: 0,
        onProcess: this.onProcess.bind(this),
        onSuccess: this.onSuccess.bind(this),
        onFailure: this.onFailure.bind(this),
        onDone: this.onDone.bind(this),
        onDrain: this.onDrain.bind(this),
      },
      logger
    );
  }

  /* istanbul ignore next */
  private onProcess({url, image, type, tabIdUrl}: OnProcessParam, callback: CallbackFunction): void {
    if (!this._checkCurrentTabIdUrlStatus(tabIdUrl)) {
      callback({url, error: new Error('User closed tab or page where this url located')}, undefined);
      return;
    }
    const model = this.models.get(type);
    if (model != null) {
      model
        .predict(image, url)
        .then((result) => callback(undefined, {url, result}))
        .catch((error: Error) => callback({url, error}, undefined));
    } else {
      throw new Error('unable to get model!');
    }
  }

  /* istanbul ignore next */
  private onSuccess({url, result}: OnSuccessParam): void {
    if (!this._checkUrlStatus(url)) return;

    if (result) this.totalBlocked++;
    this.cache.set(url, result);

    const fetchedUrl = this.requestMap.get(url);
    if (fetchedUrl != null) {
      for (const [{resolve}] of fetchedUrl) {
        resolve(result);
      }
    } else {
      throw new Error('unable to get url after onSuccess call!');
    }
  }

  /* istanbul ignore next */
  private onFailure({url, error}: OnFailureParam): void {
    if (!this._checkUrlStatus(url)) return;

    this.cache.set(url, false);

    const fetchedUrl = this.requestMap.get(url);
    if (fetchedUrl != null) {
      for (const [{reject}] of fetchedUrl) {
        reject(error);
      }
    } else {
      throw new Error('unable to fetch url after onFailure call!');
    }
  }

  private onDone({url}: OnDoneParam): void {
    this.requestMap.delete(url);
  }

  private onDrain(): void {
    // @DOCS Async operations
    // const tmpTotalBlocked = this.totalBlocked;
  }
}
