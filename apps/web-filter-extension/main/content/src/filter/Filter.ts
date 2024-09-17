import {Logger} from '@shared/logging/ConsoleLogger';
import {PredictionRequest, PredictionResponse} from '@shared/types/messages';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {ImageUtils} from '@shared/utils/ImageUtils';

type IFilter = {
  reset: () => void;
};

type FilterRequestQueueValue = Array<
  Array<{
    resolve: (value: PredictionResponse) => void;
    reject: (error: PredictionRequest) => void;
  }>
>;

export type IObjectFilter = {
  analyze: (element: HTMLElement, srcAttribute?: boolean) => void;
  setSettings: (settings: FilterSettingsType) => void;
};
export type FilterSettingsType = {
  filterEffect: 'blur' | 'hide' | 'none';
  analyzeLimit: number;
  prThreshold?: number;
  processLimit?: number;
  showClean?: boolean;
  environment: string;
};

export class Filter implements IFilter {
  protected counter: number;
  protected violationCounter: number;
  private readonly requestQueue: Map<string, FilterRequestQueueValue>;

  constructor(protected logger: Logger) {
    this.counter = 0;
    this.violationCounter = 0;
    this.requestQueue = new Map();
  }

  public reset(url?: string) {
    this.counter = 0;
    this.violationCounter = 0;
    if (url) {
      // @ts-ignore
      this.requestQueue.set(url, null);
    }
  }

  /* istanbul ignore next */
  protected async requestToAnalyzeImage(request: PredictionRequest): Promise<PredictionResponse> {
    return new Promise((resolve, reject) => {
      const queueName = request.url;
      try {
        if (this.requestQueue.has(queueName)) {
          this.requestQueue.get(queueName)?.push([{resolve, reject}]);
        } else {
          this.requestQueue.set(queueName, [[{resolve, reject}]]);
          if (ImageUtils.isBase64(request.url)) {
            this.logger.debug(`sending Base64 image request.`);
            this._requestToAnalyzeImage(request);
          } else {
            fetch(request.url)
              .then((response) => {
                response
                  .blob()
                  .then((blob) => {
                    const type = blob.type;
                    blob.arrayBuffer()
                      .then((arrayBuffer: ArrayBuffer) => {
                        this.logger.debug(`Sending blob image request.`);
                        let data = {
                          // @ts-ignore
                          data: Array.apply(null, new Uint8Array(arrayBuffer)),
                          contentType: type,
                        };
                        let transportData = JSON.stringify(data);
                        request.data = transportData;
                        this._requestToAnalyzeImage(request);
                      })
                      .catch((e) => {
                        /* istanbul ignore next */
                        this.logger.error(`Failed to process image. ${e}`);
                        reject(request);
                      });
                  })
                  .catch((e) => {
                    /* istanbul ignore next */
                    this.logger.error(`Failed to process image. ${e}`);
                    reject(request);
                  });
              })
              .catch((e) => {
                /* istanbul ignore next */
                reject(request);
                this.logger.error(`Failed to process image. ${e}`);
              });
          }
        }
      } catch {
        if (this.requestQueue.has(queueName)) {
          const queue = this.requestQueue.get(queueName);
          if (queue != null) {
            for (const [{reject}] of queue) {
              reject(request);
            }
          } else {
            throw new Error('unable to fetch queue after requestToAnalyzeImage');
          }
        } else {
          /* istanbul ignore next */
          reject(request);
        }
        this.requestQueue.delete(queueName);
      }
    });
  }

  protected _requestToAnalyzeImage(value: PredictionRequest): void {
    const request = {type: value.type, value};
    chrome.runtime.sendMessage(request, (response: PredictionResponse) => {
      if (chrome.runtime.lastError !== null && chrome.runtime.lastError !== undefined) {
        throw new Error('unable to get response.');
      }
      const url = this.requestQueue.get(value.url);
      if (url != null) {
        for (const [{resolve}] of url) {
          resolve(response);
        }
      } else {
        /* istanbul ignore next */
        throw new Error('unable to get url after call to private _requestToAnalyzeImage');
      }

      this.requestQueue.delete(value.url);
    });
  }
}
