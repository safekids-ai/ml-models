import {ContentResult} from '@shared/types/ContentResult';
import {WebCategoryConfig} from '@shared/web-category/domain/web-category.config';
import {UrlCategoryService} from '@shared/web-category/service/UrlCategoryService';

import {LocalWebCategoryCategoriesService} from '@shared/web-category/service/impl/LocalWebCategoryCategoriesService';
import {RESTWebCategoryService} from '@shared/web-category/service/impl/RESTWebCategoryService';
import {HTMLWebData} from "@safekids-ai/web-category-types";
import {IWebCategory} from "@shared/web-category/types/web-category.types";

export class WebUrlCategoriesService implements UrlCategoryService {
  private webCategoryConfig: WebCategoryConfig = {
    url: '',
    key: '',
  };
  constructor(
    private readonly localWebCategoryCategoriesService: LocalWebCategoryCategoriesService,
    private readonly restWebCategoryCategoriesService: RESTWebCategoryService
  ) {
  }

  async initialize(webCategoryConfig: WebCategoryConfig): Promise<void> {
    this.webCategoryConfig = webCategoryConfig;
    await this.localWebCategoryCategoriesService.initialize();
  }

  async getHostCategoryCodes(host: string, url: string, meta?: HTMLWebData): Promise<IWebCategory> {
    const result = await this.localWebCategoryCategoriesService.getHostCategoryCodes(host);
    if (result && result.categories) {
      return result;
    }
    const response = await this.restWebCategoryCategoriesService.getHostCategoryCodes(url, this.webCategoryConfig, meta);
    return response;
  }

  getCategoryByCodes(host: string, result: IWebCategory): ContentResult {
    const ret = this.localWebCategoryCategoriesService.getCategoryByCodes(host, result);
    return ret;
  }
}
