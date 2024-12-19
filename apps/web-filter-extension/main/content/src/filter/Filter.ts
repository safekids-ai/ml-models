import {Logger} from '@shared/logging/ConsoleLogger';
import {PredictionRequest, PredictionResponse} from '@shared/types/messages';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {ImageUtils} from '@shared/utils/ImageUtils';

type IFilter = {
  reset: () => void;
};

type FilterRequestCacheValue = Array<
  Array<{
    resolve: (value: PredictionResponse) => void;
    reject: (error: PredictionRequest) => void;
  }>
>;

export type IObjectFilter = {
  analyze: (element: HTMLElement | HTMLElement[], srcAttribute?: boolean) => void;
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
  private readonly requestCache: Map<string, FilterRequestCacheValue>;

  constructor(protected logger: Logger) {
    this.counter = 0;
    this.violationCounter = 0;
    this.requestCache = new Map();
  }

  public reset(url?: string) {
    this.counter = 0;
    this.violationCounter = 0;
    if (url) {
      // @ts-ignore
      this.requestCache.set(url, null);
    }
  }

  /* istanbul ignore next */
  protected async requestToAnalyzeImage(request: PredictionRequest): Promise<PredictionResponse> {
    return new Promise((resolve, reject) => {
      const queueName = request.url;
      if (this.requestCache.has(queueName)) {
        this.requestCache.get(queueName)?.push([{resolve, reject}]);
      } else {
        this.requestCache.set(queueName, [[{resolve, reject}]]);
        try {
          this._requestToAnalyzeImage(request);
        } catch (error) {
          if (this.requestCache.has(queueName)) {
            const queue = this.requestCache.get(queueName);
            if (queue != null) {
              for (const [{reject}] of queue) {
                reject(request);
              }
            } else {
              throw new Error('unable to fetch queue after requestToAnalyzeImage');
            }
          }
        }
      }
    });
  }

  protected _requestToAnalyzeImage(value: PredictionRequest): void {
    const request = {type: value.type, value};

    chrome.runtime.sendMessage(request, (response: PredictionResponse) => {
      if (chrome.runtime.lastError !== null && chrome.runtime.lastError !== undefined) {
        throw new Error('unable to get response.');
      }
      const url = this.requestCache.get(value.url);
      if (url != null) {
        for (const [{resolve}] of url) {
          resolve(response);
        }
      } else {
        /* istanbul ignore next */
        throw new Error('unable to get url after call to private _requestToAnalyzeImage');
      }

      this.requestCache.delete(value.url);
    });
  }
}
