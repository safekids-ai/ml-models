import {ContentResult} from '@shared/types/ContentResult';
import {HTMLWebData} from "@safekids-ai/web-category-types";
import {IWebCategory} from "@shared/web-category/types/web-category.types";

export type ContentFilter = {
  filter: (host: string, url: string, meta?: HTMLWebData) => Promise<ContentResult>;
};
