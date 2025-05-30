import OpenAI from "openai";
import {WebCategorizer} from "../web-categorizer";
import {
  WebCategoryType,
  WebCategoryProviderType,
  WebCategoryResponse,
  WebCategoryResponseItem
} from "@safekids-ai/web-category-types";
import * as Logger from 'abstract-logging';

class OpenAIWebCategorizer extends WebCategorizer {
  api: OpenAI

  constructor(apiKey: string, model: string, logger?: Logger) {
    super(apiKey, model, logger)
    this.api = new OpenAI({apiKey: apiKey});
  }

  public getProviderName() : WebCategoryProviderType {
    return WebCategoryProviderType.OPENAI;
  }

  async categorize(websiteText: string, url?: string): Promise<WebCategoryResponse> {
    try {
      const response = await this.api.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "You will help categorize website content according to the following categories:",
          },
          {
            role: "user",
            content: this.getInstructCategoryDescriptions(),
          },
          {
            role: "user",
            content: `Categorize the following website text and URL, and return multiple categories if applicable along with a probability, e.g. Adult Sexual Content:0.5,Gambling:0.3 etc.):: "${websiteText}"${url ? ` and URL: "${url}"` : ''}`,
          },
        ],
      });

      const categoriesFromResponse = response.choices[0].message?.content
        .split(",")
        .map(category => {
          const [type,probability] = category.split(":");
          return {
            type: type,
            probability: (probability) ? parseFloat(probability) : 0.5
          }
        });

      const matchedCategories: WebCategoryResponseItem[] = categoriesFromResponse
        .filter(i => this.getCategoriesAsString().includes(i.type))
        .map(j => {
          return {
            category: this.getCategories().find(c => c.description === j.type),
            probability: j.probability
          }
        });

      return {
        categories: matchedCategories
      };
    } catch (error) {
      throw new Error(`Unable to categorize title ${websiteText} due to ${error}`)
    }
  }
}

export {OpenAIWebCategorizer}
