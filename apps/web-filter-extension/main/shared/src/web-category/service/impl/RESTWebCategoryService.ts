import {LRUCache} from '@shared/cache/LRUCache';
import {Logger} from '@shared/logging/ConsoleLogger';
import {WebCategoryConfig} from '@shared/web-category/domain/web-category.config';
import {HttpException, HttpNotFoundException, RESTService} from "@shared/rest/RestService";
import {WebCategoryType, HTMLWebData} from "@safekids-ai/web-category-types";
import {IWebCategory} from "@shared/web-category/types/web-category.types";
import {WebCategoryApiResponse} from "@shared/web-category/domain/WebCategoryApiResponse";
import {HttpUtils} from "@shared/utils/HttpUtils";
import {AbortError} from "redis";

type hasName = {
  name: string;
};

export class RESTWebCategoryService {
  constructor(private readonly cache: LRUCache<string, IWebCategory>,
              private readonly restService: RESTService,
              private readonly log: Logger) {
  }

  private hasName(obj: unknown): obj is hasName {
    return (obj as hasName).name !== undefined;
  }

  async getHostCategoryCodes(url: string, webCategoryConfig: WebCategoryConfig, meta?: HTMLWebData): Promise<IWebCategory> {
    const cacheResult = this.cache.get(url);
    if (cacheResult == null) {
      const result = await this.getWebCategoryCategoryByUrl(url, webCategoryConfig, meta);
      this.log.info(`category results after fetching url, ${JSON.stringify(result)}`);
      if (result && result.categories) {
        this.cache.set(url, result);
        return result;
      }
      return null;
    }
    this.log.info(`cache return codes, ${JSON.stringify(cacheResult)}`);
    return cacheResult;
  }

  readonly getWebCategoryCategoryByUrl = async (url: string, webCategoryConfig: WebCategoryConfig, meta?: HTMLWebData): Promise<IWebCategory | undefined> => {
    try {
      return await this.lookupUrl(url, webCategoryConfig, meta);
    } catch (error) {
      // longer than 5 seconds
      if (this.hasName(error) && error.name === 'AbortError') {
        this.log.error(`WebCategory Api Failed to Response back in 5s for url:${url}:`);
        return undefined;
      }
      this.log.error(`WebCategory lookup error for ${url}`, error);
      return undefined;
    }
  };

  lookupUrl = async (url: string, webCategoryConfig: WebCategoryConfig, meta?: HTMLWebData): Promise<IWebCategory> => {
    // // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    // const api = `${webCategoryConfig.url}?` + new URLSearchParams(params);
    const options = {timeout: 5000};
    return await this.fetchWithTimeout(webCategoryConfig, url, options, meta);
  };

  private readonly fetchWithTimeout = async (config: WebCategoryConfig, url, options: {
    timeout: number
  }, htmlData?: HTMLWebData) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout);
    let response: WebCategoryApiResponse = null;

    try {
      const baseUrl = HttpUtils.getBaseUrl(url);
      const isRoot = HttpUtils.isRootDomain(baseUrl);

      this.log.debug(`[CategoryRequest] for baseUrl:${baseUrl} and url=${url}`, htmlData);
      const htmlTextTrimmed = (htmlData?.htmlText) ? htmlData.htmlText.substring(0, Math.min(1000, htmlData.htmlText.length)) : undefined;
      const htmlDataTrimmed = {...htmlData, htmlText: htmlTextTrimmed};
      response = await this.restService.doPost(config.url,
        {
          url: url,
          htmlMeta: (isRoot) ? htmlDataTrimmed : null
        },
        {signal: controller.signal});

      this.log.debug(`[CategoryResponse] for url=${url} meta=${JSON.stringify(htmlData)}`, response);
    } catch (error) {
      if (error instanceof HttpNotFoundException) {
        this.log.log(`Did not find category for url ${url} received: ${error.httpCode}`);
      } else if (error instanceof HttpException) {
        this.log.error(`Unable to get category url ${url} due to HTTP code: ${error.httpCode} description:${error.httpDescription}`, error);
      } else {
        this.log.error(`Unable to get category url ${url} due ${error}`, error);
      }
      clearTimeout(id);
      return undefined;
    }
    // const response = await fetch(api, {
    //     signal: controller.signal,
    // });
    clearTimeout(id);
    if (response) {
      return {
        aiGenerated: response.aiGenerated,
        verified: response.verified,
        probability: response.probability,
        categories: response.categories
      } as IWebCategory
    }
    return null;
  };
}
