import {WebCategoryProviderType} from "@safekids-ai/web-category-types";
import {WebCategorizer} from "./web-categorizer";
import {OpenAIWebCategorizer} from "./impl/openai-web-categorizer";
import * as Logger from 'abstract-logging';
import {GroqWebCategorizer} from "./impl/groq-web-categorizer";
import {GoogleWebCategorizer} from "libs/web-category/src/lib/impl/google-web-categorizer";

class WebCategoryFactory {
  public static create(providerString: string, apiKey, model, logger?: Logger): WebCategorizer {
    const available = providerString in WebCategoryProviderType
    if (!available) {
      throw new Error(`Provider specified ${providerString} is not available in the list ${WebCategoryProviderType}`)
    }
    const providerType: WebCategoryProviderType = WebCategoryProviderType[providerString]
    switch (providerType) {
      case WebCategoryProviderType.GOOGLE:
        return new GoogleWebCategorizer(apiKey, model, logger)
      case WebCategoryProviderType.OPENAI:
        return new OpenAIWebCategorizer(apiKey, model, logger)
      case WebCategoryProviderType.GROQ:
        return new GroqWebCategorizer(apiKey, model, logger)
      default:
        throw new Error(`Provider ${providerType} not currently supported`)
    }
  }
}

export {WebCategoryFactory}
