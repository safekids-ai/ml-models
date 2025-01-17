import {
  WebCategoryType,
  WEB_CATEGORY_TYPES,
  WebCategoryProviderType,
  WebCategoryResponse
} from "@safekids-ai/web-category-types";
import * as Logger from 'abstract-logging';

const CATEGORIES = WEB_CATEGORY_TYPES
const CATEGORY_AS_STRING = CATEGORIES.map(cat => cat.description);
const CATEGORY_DESCRIPTIONS = CATEGORIES.map(cat => cat.description).join(", ");

abstract class WebCategorizer {
  protected constructor(protected readonly apiKey: string,
                        protected readonly model: string,
                        protected readonly logger?: Logger) {
  }

  public abstract getProviderName(): WebCategoryProviderType;

  public getCategories(): WebCategoryType[] {
    return CATEGORIES;
  }

  public getCategoriesAsString(): string[] {
    return CATEGORY_AS_STRING;
  }

  getInstructCategoryDescriptions(): string {
    return CATEGORY_DESCRIPTIONS
  }

  abstract categorize(text: string, url?: string): Promise<WebCategoryResponse>
}

export {WebCategorizer}
