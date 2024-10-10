import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {LoggingService} from "../logger/logging.service";
import {
  HTMLMetaClassifier,
  WEB_CATEGORY_TYPES,
  WebCategoryHelper,
  WebCategoryProviderType, WebCategoryResponse,
  WebCategoryType,
  WebCategoryTypesEnum,
  WebMeta
} from "@safekids-ai/web-category-types";
import {WebCategorizer, WebContentScraper} from "@safekids-ai/web-category";
import {WebCategoryUrl} from "./entities/web-category-url-entity";
import {WEBCATEGORY_URL_REPOSITORY, WEBCATEGORY_HOST_REPOSITORY} from "../constants";
import {WebCategoryUrlResponseDto} from "./dto/web-category-url.dto";
import {CacheTTL} from "@nestjs/cache-manager";
import {WebCategoryHost} from "./entities/web-category-host-entity";
import {hasQueryParams, isRootURL} from "apps/ml-api/src/app/utils/http.util";

@Injectable()
export class WebCategoryService {
  private readonly MATURE_CODES = [WebCategoryTypesEnum.WEAPONS, WebCategoryTypesEnum.INAPPROPRIATE_FOR_MINORS, WebCategoryTypesEnum.EXPLICIT];

  constructor(@Inject(WEBCATEGORY_URL_REPOSITORY) private readonly repository: typeof WebCategoryUrl,
              @Inject(WEBCATEGORY_HOST_REPOSITORY) private readonly hostRepository: typeof WebCategoryHost,
              private readonly log: LoggingService,
              private readonly webCategorizer: WebCategorizer) {
  }


  public getProviderName(): WebCategoryProviderType {
    return this.webCategorizer.getProviderName();
  }

  getHost(url: string) {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  }

  @CacheTTL(1)
  async getHostCategory(host: string): Promise<WebCategoryType[]> {
    const result = await this.hostRepository.findOne({
      where: {host},
      attributes: ['category']
    });

    if (result && result.category) {
      return result.category.map(id => WEB_CATEGORY_TYPES.find(category => category.id === id));
    }

    return null;
  }


  @CacheTTL(1)
  async getURL(url: string): Promise<WebCategoryUrlResponseDto | null> {
    const result = await this.repository.findOne({
      where: {url},
      attributes: ['aiGenerated', 'verified', 'category', 'probability']
    });

    if (result && result.category) {
      const categories = result.getCategory()
      const probability = result.getProbability()

      return {
        aiGenerated: result.aiGenerated,
        verified: result.verified,
        categories: categories,
        probability: probability
      }
    }
    return null;
  }

  async categorize(url: string, meta?: WebMeta): Promise<WebCategoryUrlResponseDto> {
    const queryParams = hasQueryParams(url);

    if (queryParams && !meta) {
      throw new NotFoundException("Cannot categories a url with query parameters and without meta provided. Provided " + url);
    }

    const host = this.getHost(url);
    const hostCategory = await this.getHostCategory(host);

    if (hostCategory) {
      return {
        aiGenerated: false,
        verified: true,
        categories: (hostCategory) ? hostCategory.map(cat => cat.id) : [],
        probability: [1]
      }
    }

    //return if exists in database
    const dbValue = await this.getURL(url)
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
    } else if (meta.title && meta.title.length > 50) {
      text = meta.title
    } else if (!meta.rating) {
      throw new NotFoundException(`Unable to get title or description for url: ${url}`)
    }

    const isAdultMeta = HTMLMetaClassifier.isAdultMeta(meta);
    const isWeaponsMeta = HTMLMetaClassifier.isWeaponsMeta(meta);

    let result: WebCategoryResponse = undefined;

    let aiGenerated = false;
    let verified = false;
    let probability: number[] = null;
    let codes: number[] = null;

    this.log.debug("Running the following through AI", {url: url, text: text})
    try {
      result = await this.webCategorizer.categorize(text, url);
      if (!result || result.length == 0) {
        throw new NotFoundException(`Unable to find categories for ${url}`);
      }
      aiGenerated = true;
      verified = false;
      probability = result.map(item => item.probability);
      codes = result.map(item => item.category.id);

      if (isAdultMeta) {
        verified = true;
        probability = [1];
        if (!codes || !this.MATURE_CODES.some(code => codes.includes(code))) {
          codes = (isWeaponsMeta) ? [WebCategoryTypesEnum.WEAPONS] : [WebCategoryTypesEnum.EXPLICIT];
        }
      }
    } catch (error) {
      if (isAdultMeta) {
        this.log.debug(`Ignoring error in classifier since adult meta: ${url} -> ${meta}`, error);
        const category = (isWeaponsMeta) ? WebCategoryTypesEnum.WEAPONS : WebCategoryTypesEnum.INAPPROPRIATE_FOR_MINORS;
        aiGenerated = false;
        verified = true;
        probability = [1];
        codes = [WebCategoryHelper.getWebCategory(category).id];
      } else {
        throw error;
      }
    }

    this.log.debug("Found the following categories:", {url: url, text: text, result: result})

    const source = WebCategoryProviderType[this.getProviderName()]
    try {
      if (url.length < 255 && !queryParams) {
        const dbStore = WebCategoryUrl.findOrCreate({
          where: {url},
          defaults: {
            meta: meta,
            source: source,
            category: codes,
            aiGenerated: aiGenerated,
            verified: verified,
            probability: probability,
            wrongCategory: false,
            createdBy: "user",
            updatedBy: "user"
          }
        })
        this.log.debug("Stored web category", dbStore)
      }
      return {
        aiGenerated, verified, probability, categories: codes
      }
    } catch (error) {
      throw error;
    }
  }

  async getMeta(url: string): Promise<WebMeta> {
    const helper = new WebContentScraper()
    return helper.getMetadata(url)
  }
}
