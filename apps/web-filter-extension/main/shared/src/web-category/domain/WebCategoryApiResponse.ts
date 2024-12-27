import {WebCategoryType} from "@safekids-ai/web-category-types";

export type WebCategoryApiResponse = {
  aiGenerated: boolean;
  verified: boolean,
  probability: number[],
  categories: number[];
};
