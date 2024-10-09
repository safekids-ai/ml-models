import {ContentResult} from '@shared/types/ContentResult';
import {WebCategoryConfig} from '@shared/web-category/domain/web-category.config';
import {WebMeta} from "@safekids-ai/web-category-types";
import {IWebCategory} from "@shared/web-category/types/web-category.types";

export type UrlCategoryService = {
  /** Initialize categories
   * @param  webCategoryConfig
   */
  initialize: (webCategoryConfig: WebCategoryConfig) => void;

  /** Get category code from given url
   * @param  url
   * @returns number[]
   */
  getHostCategoryCodes: (host: string, url: string, meta?: WebMeta) => Promise<IWebCategory>;

  /** Get category from code list
   * @param  host
   * @param  codes
   * @returns ContentResult
   */
  getCategoryByCodes: (host: string, result: IWebCategory) => ContentResult;
};
