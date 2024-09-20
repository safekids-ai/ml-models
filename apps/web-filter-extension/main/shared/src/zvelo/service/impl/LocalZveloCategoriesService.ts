import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {Logger} from '@shared/logging/ConsoleLogger';
import {ContentResult} from '@shared/types/ContentResult';
import {UrlStatus} from '@shared/types/UrlStatus';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {ZveloCategoryCodes} from '@shared/zvelo/utils/ZveloCategoryCodes';
import url from "url";

export class LocalZveloCategoriesService {
  private zveloCategories: Map<string, number[]>;

  constructor(private readonly log: Logger) {
  }

  async initialize(): Promise<void> {
    this.zveloCategories = await this.initializeZveloCategories();
  }

  private readonly initializeZveloCategories = async (): Promise<Map<string, number[]>> => {
    const ZVELO_CATEGORY_PATH = chrome.runtime.getURL('/data/data.json');
    //const ZVELO_CATEGORY_PATH = 'src/pages/content/data.json';
    try {
      const response = await fetch(ZVELO_CATEGORY_PATH);
      if (response.ok) {
        this.log.info('Zvelo categories initialized successfully...');
        const result =  await response.json();

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
        this.log.error(`An error occurred while initializing Zvelo Categories: ,${JSON.stringify(response)}`);
        // try until it is connected
        this.log.debug('Loading zvelo categories again...');
        setTimeout(this.initializeZveloCategories, 5000);
      }
    } catch (error) {
      this.log.error('Error in catch in initialize zvello', error)
      this.log.error(`Error occurred in catch in initialize Zvelo All Categories: ,${JSON.stringify(error)}`);
      // try until it is connected
      this.log.debug('Loading zvelo categories again...');
      setTimeout(this.initializeZveloCategories, 5000);
    }
  };

  getHostCategoryCodes = async (host: string): Promise<number[]> => {
    const localCategories = this.zveloCategories.get(host);
    this.log.info(`Found the following Local Category Cache for ${host} -> ${localCategories}`)
    return localCategories || [];
  };

  getCategoryByCodes = (host: string, codes: number[]): ContentResult => {
    if (ChromeCommonUtils.inEducationalCodes(codes)) {
      return {
        host,
        status: UrlStatus.ALLOW,
        category: PrrCategory.EDUCATIONAL,
        level: PrrLevel.ZERO,
        key: PrrCategory.EDUCATIONAL,
        name: PrrCategory.EDUCATIONAL,
      };
    }

    const zveloCodes = ZveloCategoryCodes.get();
    const categories: any = codes
      .map((code: number): any => {
        if (Object.prototype.hasOwnProperty.call(zveloCodes, code)) {
          return zveloCodes[code];
        }
        return undefined;
      })
      .filter((c) => c)
      .sort((a: any, b: any) => (a.level > b.level ? -1 : 1));

    const blockedCategory = categories.find((c: ContentResult) => c.status === UrlStatus.BLOCK);

    if (blockedCategory && Object.keys(blockedCategory).length > 0) {
      return {
        host,
        status: blockedCategory.status,
        category: blockedCategory.category,
        level: blockedCategory.level,
        key: blockedCategory.key?.toUpperCase(),
        name: blockedCategory.name,
      };
    }
    return {
      host,
      status: categories.length > 0 ? categories[0].status : UrlStatus.ALLOW,
      category: categories.length > 0 && categories[0].category ? categories[0].category : '',
      level: categories.length > 0 ? categories[0].level : PrrLevel.ONE,
      key: categories.length > 0 && categories[0].key ? categories[0].key.toUpperCase() : '',
      name: categories.length > 0 && categories[0].name ? categories[0].name.toUpperCase() : '',
    };
  };

  getZveloCategories() {
    return this.zveloCategories;
  }
}
