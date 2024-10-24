import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {Logger} from '@shared/logging/ConsoleLogger';
import {ContentResult} from '@shared/types/ContentResult';
import {UrlStatus} from '@shared/types/UrlStatus';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {WebCategoryCodes} from '@shared/web-category/utils/WebCategoryCodes';
import {IWebCategory} from "@shared/web-category/types/web-category.types";

export class LocalWebCategoryCategoriesService {
  private webCategoryCategories: Map<string, number[]>;

  constructor(private readonly log: Logger) {
  }

  async initialize(): Promise<void> {
    this.webCategoryCategories = await this.initializeWebCategoryCategories();
  }

  private readonly initializeWebCategoryCategories = async (): Promise<Map<string, number[]>> => {
    const WEB_CATEGORY_PATH = chrome.runtime.getURL('/data/data.json');

    try {
      const response = await fetch(WEB_CATEGORY_PATH);
      if (response.ok) {
        this.log.info('WebCategory categories initialized successfully...');
        const result = await response.json();
        const startTime = new Date();
        const urlCategoryMap = new Map<string, number[]>();
        for (const item of result) {
          urlCategoryMap.set(item['url'], item['codes']);
        }
        const endTime = new Date();
        const timeDiff = endTime.getTime() - startTime.getTime();
        this.log.info(`Loaded categories in ${timeDiff} milliseconds...`);
        return urlCategoryMap;
      } else {
        this.log.error(`An error occurred while initializing WebCategory Categories: ,${JSON.stringify(response)}`);
        // try until it is connected
        this.log.debug('Loading webCategory categories again...');
        setTimeout(this.initializeWebCategoryCategories, 5000);
      }
    } catch (error) {
      this.log.error('Error in catch in initialize load categories', error)
      this.log.error(`Error occurred in catch in initialize All Categories: ,${JSON.stringify(error)}`);
      // try until it is connected
      this.log.debug('Loading webCategory categories again...');
      setTimeout(this.initializeWebCategoryCategories, 5000);
    }
  };

  getHostCategoryCodes = async (host: string): Promise<IWebCategory> => {
    const localCategories = this.webCategoryCategories.get(host);
    this.log.info(`Found the following Local Category Cache for ${host} -> ${localCategories}`)
    if (localCategories) {
      return {
        aiGenerated: false,
        verified: true,
        categories: localCategories,
        probability: (localCategories).map(c => 1.0)
      }
    }
    return null;
  };

  getCategoryByCodes = (host: string, result: IWebCategory): ContentResult => {
    if (!result || !result.categories) {
      return {
        host,
        status: UrlStatus.ALLOW,
        category: PrrCategory.UN_KNOWN,
        level: PrrLevel.ZERO,
        key: PrrCategory.UN_KNOWN,
        name: PrrCategory.UN_KNOWN
      };
    }

    let {aiGenerated, verified} = result;
    let codesAndProbability: Array<[string, number]> =
      result.categories.map((element, index): [string, number] => [String(element), result.probability[index]]);

    const metaFields = {
      aiGenerated,
      verified
    }

    const [isEdu, eduProbability] = ChromeCommonUtils.inEducationalCodes(result);
    if (isEdu) {
      return {
        host,
        status: UrlStatus.ALLOW,
        category: PrrCategory.EDUCATIONAL,
        level: PrrLevel.ZERO,
        key: PrrCategory.EDUCATIONAL,
        name: PrrCategory.EDUCATIONAL,
        ...metaFields,
        probability: eduProbability
      };
    }

    const webCategoryCodes = WebCategoryCodes.get();
    const categories: any = codesAndProbability
      .filter(([code, probability]): any => {
        return WebCategoryCodes.hasCode(code) && probability >=webCategoryCodes[code].minProbability
      })
      .map(([code, probability]): any => {
        return { ...webCategoryCodes[code], probability };
      })
      .sort((a: any, b: any) => (a.level > b.level ? -1 : 1))

    const blockedCategory = categories.find((c: ContentResult) => c.status === UrlStatus.BLOCK);
    if (blockedCategory && Object.keys(blockedCategory).length > 0) {
      return {
        host,
        status: blockedCategory.status,
        category: blockedCategory.category,
        level: blockedCategory.level,
        key: blockedCategory.key?.toUpperCase(),
        name: blockedCategory.name,
        ...metaFields,
        probability: blockedCategory.probability
      };
    }
    return {
      host,
      status: categories.length > 0 ? categories[0].status : UrlStatus.ALLOW,
      category: categories.length > 0 && categories[0].category ? categories[0].category : '',
      level: categories.length > 0 ? categories[0].level : PrrLevel.ONE,
      key: categories.length > 0 && categories[0].key ? categories[0].key.toUpperCase() : '',
      name: categories.length > 0 && categories[0].name ? categories[0].name.toUpperCase() : '',
      ...metaFields
    };
  };

  getWebCategoryCategories() {
    return this.webCategoryCategories;
  }
}
