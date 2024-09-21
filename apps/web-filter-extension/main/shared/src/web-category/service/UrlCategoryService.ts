import { ContentResult } from '@shared/types/ContentResult';
import { WebCategoryConfig } from '@shared/web-category/domain/web-category.config';

export type UrlCategoryService = {
    /** Initialize categories
     * @param  webCategoryConfig
     */
    initialize: (webCategoryConfig: WebCategoryConfig) => void;

    /** Get category code from given url
     * @param  url
     * @returns number[]
     */
    getHostCategoryCodes: (url: string) => Promise<number[]>;

    /** Get category from code list
     * @param  host
     * @param  codes
     * @returns ContentResult
     */
    getCategoryByCodes: (host: string, codes: number[]) => ContentResult;
};
