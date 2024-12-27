import {LRUCache} from '@shared/cache/LRUCache';
import {Logger} from '@shared/logging/ConsoleLogger';
import {WebCategoryConfig} from '@shared/web-category/domain/web-category.config';
import {HttpException, HttpNotFoundException, RESTService} from "@shared/rest/RestService";
import {WebCategoryType, HTMLWebData} from "@safekids-ai/web-category-types";
import {IWebCategory} from "@shared/web-category/types/web-category.types";
import {WebCategoryApiResponse} from "@shared/web-category/domain/WebCategoryApiResponse";
import {HttpUtils} from "@shared/utils/HttpUtils";
import {AbortError} from "redis";
import {htmlToText} from 'html-to-text';

type hasName = {
  name: string;
};

export class RESTWebCategoryService {
  private readonly htmlTextOptions = {
    wordwrap: null, // Disable word wrapping for long text blocks
    selectors: [
      {selector: 'title', format: 'skip'},  // Skip <title> (can handle separately)
      {selector: 'h1', format: 'heading'},  // Handle <h1> headings
      {selector: 'h2', format: 'heading'},  // Handle <h2> headings
      {selector: 'div', format: 'block'},   // Include <div> elements
      {selector: 'span', format: 'inline'}, // Include <span> elements (inline text)
      {selector: 'p', format: 'paragraph'}, // Include paragraphs
      {selector: 'form', format: 'skip'},   // Skip forms
      {selector: 'select', format: 'skip'}, // Skip combo boxes
      {selector: 'input', format: 'skip'},  // Skip input fields
      {selector: 'button', format: 'skip'}, // Skip buttons
      {selector: 'img', format: 'skip'},    // Skip images (embedded data URI or otherwise)
      {selector: '[src^="data:"]', format: 'skip'},  // Skip any elements with base64-encoded data URIs
    ],
    limits: {maxInputLength: 1000000}, // Adjust to handle larger HTML input
  };

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

      let htmlDataModified = htmlData;
      this.log.debug(`[CategoryRequest] for baseUrl:${baseUrl} and url=${url}`, htmlData);

      if (htmlData?.htmlText) {
        let htmlText = htmlData.htmlText;
        htmlText = htmlText.substring(0, Math.min(10000, htmlText.length));
        htmlText = htmlToText(htmlText, this.htmlTextOptions);
        if (htmlText && htmlText.length > 0) {
          htmlText = htmlText.substring(0, Math.min(1000, htmlText.length));
        }
        htmlDataModified = {...htmlData, htmlText: htmlText};
      }

      response = await this.restService.doPost(config.url,
        {
          url: url,
          htmlMeta: (isRoot) ? htmlDataModified : null
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
