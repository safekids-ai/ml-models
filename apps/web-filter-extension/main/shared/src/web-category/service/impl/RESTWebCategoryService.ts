import {LRUCache} from '@shared/cache/LRUCache';
import {Logger} from '@shared/logging/ConsoleLogger';
import {WebCategoryConfig} from '@shared/web-category/domain/web-category.config';
import {WebCategoryApiResponse} from '@shared/web-category/domain/WebCategoryApiResponse';
import {RESTService} from "@shared/rest/RestService";
import {WebCategoryType} from "@safekids-ai/web-category-types";

type hasName = {
  name: string;
};

export class RESTWebCategoryService {
  constructor(private readonly cache: LRUCache<string, number[]>,
              private readonly restService: RESTService,
              private readonly log: Logger) {
  }

  private hasName(obj: unknown): obj is hasName {
    return (obj as hasName).name !== undefined;
  }

  async getHostCategoryCodes(url: string, webCategoryConfig: WebCategoryConfig): Promise<number[]> {
    const cacheCategoryCodes = this.cache.get(url);
    if (cacheCategoryCodes == null) {
      const newCategory = await this.getWebCategoryCategoryByUrl(url, webCategoryConfig);
      this.log.info(`new category after fetching url, ${JSON.stringify(newCategory)}`);
      if (newCategory != null && newCategory.codes) {
        this.cache.set(url, newCategory.codes);
        return newCategory.codes;
      }
      return [];
    }
    this.log.info(`cache return codes, ${JSON.stringify(cacheCategoryCodes)}`);
    return cacheCategoryCodes;
  }

  readonly getWebCategoryCategoryByUrl = async (url: string, webCategoryConfig: WebCategoryConfig): Promise<WebCategoryApiResponse | undefined> => {
    try {
      return await this.lookupUrl(url, webCategoryConfig);
    } catch (error) {
      // longer than 5 seconds
      if (this.hasName(error) && error.name === 'AbortError') {
        this.log.error('WebCategory Api Failed to Response back in 5s:');
        return undefined;
      } else {
        this.log.error(`Some error occurred in webCategory Api: error, ${error}`);
        return await this.lookupUrl(url, webCategoryConfig);
      }
    }
  };

  lookupUrl = async (url: string, webCategoryConfig: WebCategoryConfig): Promise<WebCategoryApiResponse> => {
    // const params = {
    //     apiKey: webCategoryConfig.key,
    // };
    // // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    // const api = `${webCategoryConfig.url}?` + new URLSearchParams(params);
    const options = {timeout: 5000};
    return await this.fetchWithTimeout(webCategoryConfig, url, options);
  };

  private readonly fetchWithTimeout = async (config: WebCategoryConfig, url, options: { timeout: number }) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout);
    console.log("ABBAS-Calling Fetch with " + config.url + " and looking up:" + url);
    const response:WebCategoryType[] = await this.restService.doPost(config.url,
      {
        url: url
      },
      {signal: controller.signal});

    console.log("************************")
    console.log("************************")
    console.log("************************")
    console.log(response)
    const codes: number[] = response.map(item => item.id);

    // const response = await fetch(api, {
    //     signal: controller.signal,
    // });
    clearTimeout(id);
    return {codes: codes};
  };
}
