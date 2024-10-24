import {ContentResult} from '@shared/types/ContentResult';
import {ContentFilterChain} from './ContentFilterChain';
import {HTMLWebData} from "@safekids-ai/web-category-types";
import {IWebCategory} from "@shared/web-category/types/web-category.types";

export type FilterManager = {
  filterUrl: (url: string, htmlData?: HTMLWebData, category?: IWebCategory) => Promise<ContentResult>;
};

/**
 * Responsible for filtering Urls
 */
export class ContentFilterManager implements FilterManager {
  constructor(private readonly chain: ContentFilterChain) {
  }

  async filterUrl(url: string, htmlData?: HTMLWebData, category?: IWebCategory): Promise<ContentResult> {
    return await this.chain.execute(url, htmlData, category);
  }
}
