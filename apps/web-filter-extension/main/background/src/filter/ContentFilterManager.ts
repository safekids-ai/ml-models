import {ContentResult} from '@shared/types/ContentResult';
import {ContentFilterChain} from './ContentFilterChain';
import {WebMeta} from "@safekids-ai/web-category-types";

export type FilterManager = {
  filterUrl: (url: string, meta?: WebMeta) => Promise<ContentResult>;
};

/**
 * Responsible for filtering Urls
 */
export class ContentFilterManager implements FilterManager {
  constructor(private readonly chain: ContentFilterChain) {
  }

  async filterUrl(url: string, meta?: WebMeta): Promise<ContentResult> {
    return await this.chain.execute(url, meta);
  }
}
