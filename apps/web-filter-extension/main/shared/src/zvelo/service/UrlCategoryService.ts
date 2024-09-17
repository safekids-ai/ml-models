import { ContentResult } from '@shared/types/ContentResult';
import { ZveloConfig } from '@shared/zvelo/domain/zvelo.config';

export type UrlCategoryService = {
    /** Initialize categories
     * @param  zveloConfig
     */
    initialize: (zveloConfig: ZveloConfig) => void;

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
