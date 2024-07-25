import { ContentResult } from '../../../../../shared/types/ContentResult';

export type ContentFilter = {
    filter: (url: string) => Promise<ContentResult>;
};
