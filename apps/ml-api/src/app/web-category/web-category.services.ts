import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {LoggingService} from "../logger/logging.service";
import {WebContentScraper, WebMeta} from "@safekids-ai/web-categorize";
import {WebCategoryType, WebCategorizer} from "@safekids-ai/web-categorize";
import {OpenAIConfig} from "../config/openai";

@Injectable()
export class WebCategoryService {
  webCategorizer: WebCategorizer;
  apiConfig: OpenAIConfig

  constructor(
    private readonly config: ConfigService,
    private readonly log: LoggingService,
  ) {
    this.apiConfig = config.get<OpenAIConfig>("openAiConfig")
    this.webCategorizer = new WebCategorizer(this.apiConfig.api_key)
  }

  async categorize(url?: string, text?: string): Promise<WebCategoryType[]> {
    if (!url && !text) {
      throw new Error(`Please provide either a url or text. Provided url:${url},text:${text}`)
    }
    if (!text) {
      this.log.debug("No text provided. Extracting it from url:", url)
      const webMeta = await this.getMeta(url)
      if (webMeta.description) {
        text = webMeta.description
      } else if (webMeta.title) {
        text = webMeta.title
      }
    }
    this.log.debug("Running the following through OpenAI", {url: url, text: text})
    const result = await this.webCategorizer.categorize(text, url)
    this.log.debug("Found the following categories:", {url: url, text:text, result: result})
    return result
  }

  async getMeta(url: string): Promise<WebMeta> {
    const helper = new WebContentScraper()
    return helper.getMetadata(url)
  }

  async getCategory(title: string): Promise<WebCategoryType[]> {
    return this.webCategorizer.categorize(title)
  }
}
