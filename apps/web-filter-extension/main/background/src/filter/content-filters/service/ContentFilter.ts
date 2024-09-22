import {ContentResult} from '@shared/types/ContentResult';

export type ContentFilter = {
  filter: (host: string, url: string) => Promise<ContentResult>;
};
