import {ContentResult} from '@shared/types/ContentResult';
import {WebMeta} from "@safekids-ai/web-category-types";

export type ContentFilter = {
  filter: (host: string, url: string, meta?: WebMeta) => Promise<ContentResult>;
};
