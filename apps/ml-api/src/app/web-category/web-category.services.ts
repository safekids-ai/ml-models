import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {LoggingService} from "../logger/logging.service";
import {
  HTMLMetaClassifier,
  WEB_CATEGORY_TYPES,
  WebCategoryHelper,
  WebCategoryProviderType, WebCategoryResponse,
  WebCategoryType,
  WebCategoryTypesEnum,
  HTMLWebData
} from "@safekids-ai/web-category-types";
import {WebCategorizer, WebContentScraper} from "@safekids-ai/web-category";
import {WebCategoryUrl} from "./entities/web-category-url-entity";
import {WEBCATEGORY_URL_REPOSITORY, WEBCATEGORY_HOST_REPOSITORY} from "../constants";
import {WebCategoryUrlResponseDto} from "./dto/web-category-url.dto";
import {CacheTTL} from "@nestjs/cache-manager";
import {WebCategoryHost} from "./entities/web-category-host-entity";
import {hasQueryParams, isRootURL} from "apps/ml-api/src/app/utils/http.util";
import {StringUtils} from "../utils/stringUtils";

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
        probability: probability,
        rawCategory: null
      }
    }
    return null;
  }

  async categorizeText(_text: string, url?: string): Promise<WebCategoryUrlResponseDto> {
    const text = StringUtils.ltrim(_text, 1000);
    if (!text || text.length < 20) {
      throw Error(`Text is < 20 characters. Provide more. text:${text} url:${url}`);
    }

    let result: WebCategoryResponse = await this.webCategorizer.categorize(text);

    if (!result || !result.categories || result.categories.length == 0) {
      throw new NotFoundException(`Unable to find categories for text:${text} url:${url}`);
    }

    let probability = result.categories.map(item => item.probability);
    let categories = result.categories.map(item => item.category.id);
    let rawCategory = result.rawCategory;

    this.log.debug(`[AI Request]: text:${text} result:${rawCategory}`);

    return {
      aiGenerated: true, verified: false, probability, categories, rawCategory
    }
  }

  async categorize(url: string, htmlData: HTMLWebData): Promise<WebCategoryUrlResponseDto> {
    if (!url) {
      throw new Error(`Please provide either a url or text. Provided url:${url}`)
    }

    const host = this.getHost(url);

    //check if a host has a category (at the root level)
    const hostCategory = await this.getHostCategory(host);

    if (hostCategory) {
      return {
        aiGenerated: false,
        verified: true,
        categories: (hostCategory) ? hostCategory.map(cat => cat.id) : [],
        probability: [1]
      }
    }

    //return if url category exists in database
    const dbValue = await this.getURL(url)
    if (dbValue) {
      this.log.debug(`Database hit`, url, dbValue)
      return dbValue
    }

    const isHtmlData = (htmlData) ? htmlData.description || htmlData.htmlText || htmlData.ogDescription : false;

    if (!isHtmlData) {
      throw new NotFoundException(`No web html data provided for url:${url}`);
    }

    //extract html data if not provided
    // let scrapedHtmlData: HTMLWebData = null;
    //
    // try {
    //   scrapedHtmlData = await this.getHtmlData(url);
    //   htmlData = scrapedHtmlData;
    // } catch (error) {
    //   this.log.debug(`Unable to get html data for url:${url} due to ${error}`);
    //   if (!htmlData) {
    //     throw error;
    //   }
    // }

    let text = null;

    if (htmlData.description) {
      text = htmlData.description
    } else if (htmlData.ogDescription) {
      text = htmlData.ogDescription
    } else if (htmlData.title) {
      text = htmlData.title
    }

    //add keywords
    if (htmlData.keywords) {
      text = text + "\n" + htmlData.keywords;
    }

    //adjust for the content of the page
    if (htmlData.htmlText) {
      text = (text) ? text + "\n" + htmlData.htmlText : htmlData.htmlText;
    }

    const isAdultMeta = HTMLMetaClassifier.isAdultMeta(htmlData);
    const isWeaponsMeta = HTMLMetaClassifier.isWeaponsMeta(htmlData);

    let result: WebCategoryResponse = undefined;

    let aiGenerated = false;
    let verified = false;
    let probability: number[] = null;
    let codes: number[] = null;
    let rawCategoryJson: string = null;

    try {
      const resp = await this.categorizeText(text, url);
      ({aiGenerated, verified, probability, categories: codes, rawCategory: rawCategoryJson} = resp);

      if (!resp || !codes || codes.length == 0) {
        throw new NotFoundException(`Unable to find categories for ${url}`);
      }

      if (isAdultMeta) {
        verified = true;
        probability = [1];
        if (!codes || !this.MATURE_CODES.some(code => codes.includes(code))) {
          codes = (isWeaponsMeta) ? [WebCategoryTypesEnum.WEAPONS] : [WebCategoryTypesEnum.EXPLICIT];
        }
      }
    } catch (error) {
      if (isAdultMeta) {
        this.log.debug(`Ignoring error in classifier since adult meta: ${url}`, error);
        const category = (isWeaponsMeta) ? WebCategoryTypesEnum.WEAPONS : WebCategoryTypesEnum.INAPPROPRIATE_FOR_MINORS;
        aiGenerated = false;
        verified = true;
        probability = [1];
        codes = [WebCategoryHelper.getWebCategory(category).id];
      } else {
        throw error;
      }
    }

    const { htmlText, ...metaData } = htmlData;

    const source = WebCategoryProviderType[this.getProviderName()]
    try {
      if (url.length < 255) {
        // const dbStore = WebCategoryUrl.findOrCreate({
        //   where: {url},
        //   defaults: {
        //     meta: metaData,
        //     source: source,
        //     category: codes,
        //     rawCategory: rawCategoryJson,
        //     aiGenerated: aiGenerated,
        //     verified: verified,
        //     probability: probability,
        //     wrongCategory: false,
        //     createdBy: "user",
        //     updatedBy: "user"
        //   }
        // })
        //this.log.debug("Stored web category", dbStore)
      }
      return {
        aiGenerated, verified, probability, categories: codes
      }
    } catch (error) {
      throw error;
    }
  }

  async getHtmlData(url: string): Promise<HTMLWebData> {
    const helper = new WebContentScraper()
    return helper.getHtmlData(url)
  }
}
