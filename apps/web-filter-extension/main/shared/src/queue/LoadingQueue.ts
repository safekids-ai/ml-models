import {Logger} from '@shared/logging/ConsoleLogger';
import {MLModel} from '@shared/types/MLModel.type';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {ImageUtils} from '@shared/utils/ImageUtils';
import {ConcurrentQueue} from './ConcurrentQueue';
import {PredictionQueue} from './PredictionQueue';
import {requestQueueValue, TabIdUrl} from './QueueBase';

type HandlerParams = {
  url: string;
  image: ImageData | HTMLImageElement | string;
  tabIdUrl: TabIdUrl;
  type: string;
  data?: string;
  error: Error;
};

type OnProcessParam = Pick<HandlerParams, 'url' | 'tabIdUrl' | 'type' | 'data'>;
type OnSuccessParam = Pick<HandlerParams, 'url' | 'tabIdUrl' | 'image' | 'type'>;
type OnFailureParam = Pick<HandlerParams, 'url' | 'error'>;

export type CallbackFunction = (err: OnFailureParam | undefined, result: OnSuccessParam | undefined) => void;

export class LoadingQueue extends PredictionQueue {
  private readonly IMAGE_SIZE: number;
  private readonly LOADING_TIMEOUT: number;
  protected readonly loadingQueue: ConcurrentQueue<OnProcessParam>;

  constructor(models: Map<string, MLModel>, logger: Logger, store: ReduxStorage) {
    super(models, logger, store);
    this.IMAGE_SIZE = 224;
    this.LOADING_TIMEOUT = 1000;
    this.loadingQueue = new ConcurrentQueue(
      {
        concurrency: 100, // We need another concurrent IO job if image stuck for 1 sec with loading timeout
        timeout: 0,
        onProcess: this.onLoadingProcess.bind(this),
        onSuccess: this.onLoadingSuccess.bind(this),
        onFailure: this.onLoadingFailure.bind(this),
      },
      logger
    );
  }

  /* istanbul ignore next */
  private async loadImage(url: string, data?: string): Promise<ImageData | string> {
    let byteArray: Uint8Array;
    let imageType: string;
    if (data) {
      let receivedData = JSON.parse(data);
      imageType = receivedData.contentType;
      byteArray = new Uint8Array(receivedData.data);
    } else {
      imageType = url.substring('data:image/'.length, url.indexOf(';base64'));
      const byteCharacters = atob(url.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      byteArray = new Uint8Array(byteNumbers);
    }
    /* istanbul ignore next */
    return new Promise((resolve, reject) => {
      ImageUtils.byteArrayToImageData(byteArray, imageType)
        .then((imageData: any) => {
          resolve(imageData);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /* istanbul ignore next */
  private onLoadingProcess({url, tabIdUrl, type, data}: OnProcessParam, callback: CallbackFunction): void {
    if (!this._checkCurrentTabIdUrlStatus(tabIdUrl)) {
      callback(
        {
          url,
          error: new Error('User closed tab or page where this url located'),
        },
        undefined
      );
      return;
    }

    if (type === 'NLP') {
      callback(undefined, {url, image: url, tabIdUrl, type: 'NLP'});
    } else {
      this.loadImage(url, data)
        .then((image) => {
          callback(undefined, {url, image, tabIdUrl, type: 'ML'});
        })
        .catch((error: Error) => {
          this.logger.error('Error occurred while loading image queue.', error);
          callback({url, error}, undefined);
        });
    }
  }

  /* istanbul ignore next */
  private onLoadingSuccess({url, image, tabIdUrl, type}: OnSuccessParam): void {
    if (!this._checkUrlStatus(url)) return;

    // @ts-expect-error
    this.predictionQueue.add({url, image, tabIdUrl, type});
  }

  /* istanbul ignore next */
  private onLoadingFailure({url, error}: OnFailureParam): void {
    if (!this._checkUrlStatus(url)) return;

    for (const [{reject}] of this.requestMap.get(url) as requestQueueValue) {
      reject(error);
    }

    this.cache.set(url, false);
    this.requestMap.delete(url);
  }
}
