import { ChromeCommonUtils } from '@src/shared/chrome/utils/ChromeCommonUtils';
import { Logger } from '@src/shared/logging/ConsoleLogger';
import { ContentResult } from '@src/shared/types/ContentResult';
import { UrlStatus } from '@src/shared/types/UrlStatus';
import { PrrCategory } from '@src/shared/types/PrrCategory';
import { PrrLevel } from '@src/shared/types/PrrLevel';
import { ZveloCategoryCodes } from '@src/shared/zvelo/utils/ZveloCategoryCodes';

export class LocalZveloCategoriesService {
    private zveloCategories: any;

    constructor(private readonly log: Logger) {}

    async initialize(): Promise<void> {
        this.zveloCategories = await this.initializeZveloCategories();
    }

    private readonly initializeZveloCategories = async (): Promise<void> => {
        const ZVELO_CATEGORY_PATH = chrome.runtime.getURL('src/pages/data.json');
        //const ZVELO_CATEGORY_PATH = 'src/pages/content/data.json';
        try {
            const response = await fetch(ZVELO_CATEGORY_PATH);
            if (response.ok) {
                this.log.info('Zvelo categories initialized successfully...');
                return await response.json();
            } else {
                this.log.error(`An error occurred while initializing Zvelo Categories: ,${JSON.stringify(response)}`);
                // try until it is connected
                this.log.debug('Loading zvelo categories again...');
                setTimeout(this.initializeZveloCategories, 5000);
            }
        } catch (error) {
            this.log.error(`Error occurred in catch in initialize Zvelo All Categories: ,${JSON.stringify(error)}`);
            // try until it is connected
            this.log.debug('Loading zvelo categories again...');
            setTimeout(this.initializeZveloCategories, 5000);
        }
    };

    getHostCategoryCodes = async (host: string): Promise<number[]> => {
        const allCategories = this.getZveloCategories();
        return allCategories[host] || [];
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
