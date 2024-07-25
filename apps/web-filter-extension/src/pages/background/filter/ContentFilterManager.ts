import { ContentResult } from '../../../shared/types/ContentResult';
import { ContentFilterChain } from './ContentFilterChain';

export type FilterManager = {
    filterUrl: (url: string) => Promise<ContentResult>;
};

/**
 * Responsible for filtering Urls
 */
export class ContentFilterManager implements FilterManager {
    constructor(private readonly chain: ContentFilterChain) {}

    async filterUrl(url: string): Promise<ContentResult> {
        return await this.chain.execute(url);
    }
}
