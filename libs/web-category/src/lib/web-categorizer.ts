import {WebCategoryType, WEB_CATEGORY_TYPES, WebCategoryProviderType} from "@safekids-ai/web-category-types";
import * as Logger from 'abstract-logging';

const CATEGORIES = WEB_CATEGORY_TYPES
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

  getInstructCategoryDescriptions(): string {
    return CATEGORY_DESCRIPTIONS
  }

  abstract categorize(title: string, url?: string): Promise<WebCategoryType[]>
}

export {WebCategorizer}
