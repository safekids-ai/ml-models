import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {LoggingService} from "../logger/logging.service";
import {WebCategoryType, WebMeta, WEB_CATEGORY_TYPES, WebCategoryProviderType} from "@safekids-ai/web-category-types";
import {WebCategorizer, WebContentScraper} from "@safekids-ai/web-category";
import {WebCategory} from "./entities/web-category-entity";
import {WEBCATEGORY_REPOSITORY, WEBTIME_REPOSITORY} from "../constants";

@Injectable()
export class WebCategoryService {

  constructor(@Inject(WEBCATEGORY_REPOSITORY) private readonly repository: typeof WebCategory,
              private readonly log: LoggingService,
              private readonly webCategorizer: WebCategorizer) {
  }

  public getProviderName(): WebCategoryProviderType {
    return this.webCategorizer.getProviderName();
  }

  async findByUrl(url: string): Promise<WebCategoryType[] | null> {
    const result = await this.repository.findOne({
      where: {url},
      attributes: ['category']
    });
    if (result && result.category) {
      const category = result.getCategory()
      return category.map(id => {
        return WEB_CATEGORY_TYPES.find(category => category.id === id);
      }).filter(category => category !== undefined) as WebCategoryType[];
    }
    return null;
  }

  async categorize(url: string, meta?: WebMeta): Promise<WebCategoryType[]> {
    //return if exists in database
    const dbValue = await this.findByUrl(url)
    if (dbValue) {
      this.log.debug(`Database hit`, url, dbValue)
      return dbValue
    }

    //lets categorize it
    let text = null
    if (!url && !meta) {
      throw new Error(`Please provide either a url or text. Provided url:${url},meta:${meta}`)
    }

    if (!meta) {
      this.log.debug("No text provided. Extracting it from url:", url)
      meta = await this.getMeta(url)
    }

    if (meta.description) {
      text = meta.description
    } else if (meta.title) {
      text = meta.title
    } else {
      throw new NotFoundException(`Unable to get title or description for url: ${url}`)
    }

    this.log.debug("Running the following through AI", {url: url, text: text})
    const result = await this.webCategorizer.categorize(text, url)
    this.log.debug("Found the following categories:", {url: url, text: text, result: result})

    const source = WebCategoryProviderType[this.getProviderName()]

    const dbStore = await WebCategory.create({
      url: url,
      meta: meta,
      source: source,
      category: result.map(category => category.id),
      wrongCategory: false,
      createdBy: "user",
      updatedBy: "user"
    })
    this.log.debug("Stored web category", dbStore)
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
