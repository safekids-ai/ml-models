import OpenAI from "openai";
import {WebCategoryType, SAFE_KIDS_CATEGORY_TYPES, DETAIL_WEB_CATEGORY_TYPES} from "./web-category-types";

const CATEGORIES = SAFE_KIDS_CATEGORY_TYPES

const categoryDescriptions = CATEGORIES.map(cat => cat.description).join(", ");

class WebCategorizer {
  api: OpenAI
  initialized: boolean

  constructor(private readonly apiKey: string) {
    this.api = new OpenAI({apiKey: apiKey});
  }

  async categorize(title: string, url?: string): Promise<WebCategoryType[]> {
    try {
      const response = await this.api.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You will help categorize website content according to the following categories:",
          },
          {
            role: "user",
            content: categoryDescriptions,
          },
          {
            role: "user",
            content: `Categorize the following title and URL, and return multiple categories if applicable: "${title}"${url ? ` and URL: "${url}"` : ''}`,
          },
        ],
      });

      const categoriesFromResponse = response.choices[0].message?.content
        .split(",")
        .map(category => category.trim());

      const matchedCategories = CATEGORIES.filter(cat =>
        categoriesFromResponse?.includes(cat.description)
      );
      return matchedCategories
    } catch (error) {
      throw new Error(`Unable to categorize title ${title} due to ${error}`)
    }
  }
}

export {WebCategoryType, SAFE_KIDS_CATEGORY_TYPES, WebCategorizer}
