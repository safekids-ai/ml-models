import {WebCategoryProviderType} from "./web-category-types";
import {WebCategorizer} from "@safekids-ai/web-categorize";
import {OpenAIWebCategorizer} from "./impl/openai-web-categorizer";
import * as Logger from 'abstract-logging';
import {GroqWebCategorizer} from "./impl/groq-web-categorizer";

class WebCategoryFactory {
  public static create(providerString: string, apiKey, model, logger?: Logger): WebCategorizer {
    const available = providerString in WebCategoryProviderType
    if (!available) {
      throw new Error(`Provider specified ${providerString} is not available in the list ${WebCategoryProviderType}`)
    }
    const providerType: WebCategoryProviderType = WebCategoryProviderType[providerString]
    switch (providerType) {
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
