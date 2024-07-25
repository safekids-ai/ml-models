import { ConfigurationFilter } from '../../../../../../../src/pages/background/filter/content-filters/service/impl/ConfigurationFilter';
import { ZveloUrlCategoriesService } from '../../../../../../../src/shared/zvelo/service/impl/ZveloUrlCategoriesService';
import { LocalZveloCategoriesService } from '../../../../../../../src/shared/zvelo/service/impl/LocalZveloCategoriesService';
import { RESTZveloCategoriesService } from '../../../../../../../src/shared/zvelo/service/impl/RESTZveloCategoriesService';
import { LRUCache } from '../../../../../../../src/shared/cache/LRUCache';
import { UrlCategoryService } from '../../../../../../../src/shared/zvelo/service/UrlCategoryService';
import { ConsoleLogger } from '../../../../../../../src/shared/logging/ConsoleLogger';
import { ContentResult } from '../../../../../../../src/shared/types/ContentResult';
import { PrrLevel } from '../../../../../../../src/shared/types/PrrLevel';
import { PrrCategory } from '../../../../../../../src/shared/types/PrrCategory';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { jest } from '@jest/globals';
import { UrlStatus } from '../../../../../../../src/shared/types/UrlStatus';
import { LocalStorageManager } from '../../../../../../../src/shared/chrome/storage/ChromeStorageManager';
import { ChromeUtils } from '../../../../../../../src/shared/chrome/utils/ChromeUtils';
import moment from 'moment';

describe('Configuration filter service test', () => {
    let service: ConfigurationFilter;
    let urlCategoryService: UrlCategoryService;
    const logger = new ConsoleLogger();
    const localStorageManager = new LocalStorageManager();
    const chromeUtils = new ChromeUtils(logger, localStorageManager);
    const categories = [
        {
            level: PrrLevel.ONE,
            key: '',
            category: PrrCategory.GAMBLING,
            name: 'Gambling',
            status: UrlStatus.BLOCK,
        },
        {
            level: PrrLevel.ONE,
            key: 'gambling',
            category: PrrCategory.GAMBLING,
            name: 'Gambling',
            status: UrlStatus.BLOCK,
        },
    ];
    beforeEach(async () => {
        const localService = new LocalZveloCategoriesService(logger);
        const restService = new RESTZveloCategoriesService(new LRUCache<string, number[]>(200), logger);
        urlCategoryService = new ZveloUrlCategoriesService(localService, restService);
    });

    describe('Execute filter', () => {
        it.each(categories)('Should return blocked category if url is found in filtered categories', async (cat) => {
            //given
            const url = 'some-gambling.com';
            let store = TestUtils.buildStore({ GAMBLING: UrlStatus.BLOCK });
            service = new ConfigurationFilter(logger, store, urlCategoryService, chromeUtils);

            const codes = [10005];

            //mock dependencies
            jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
            jest.spyOn(urlCategoryService, 'getCategoryByCodes').mockReturnValueOnce(cat);
            const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue([]);
            const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});

            //when
            const result = await service.filter(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject(cat);
            expect(urlCategoryService.getHostCategoryCodes).toBeCalledTimes(1);
            expect(urlCategoryService.getCategoryByCodes).toBeCalledTimes(1);
            expect(urlCategoryService.getCategoryByCodes).toBeCalledWith(url, codes);
            expect(localStorageManagerGetSpy).toBeCalledTimes(1);
            expect(localStorageManagerSetSpy).toBeCalledTimes(0);
        });

        it('Should return allow category if url is found in filtered categories but url is educational', async () => {
            //given
            const url = 'some-gambling.com';
            let store = TestUtils.buildStore(['gambling']);
            service = new ConfigurationFilter(logger, store, urlCategoryService, chromeUtils);
            const category = {
                level: PrrLevel.ONE,
                key: 'education',
                category: PrrCategory.EDUCATIONAL,
                name: 'education',
                status: UrlStatus.ALLOW,
            } as ContentResult;
            const codes = [10118];

            //mock dependencies
            jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
            jest.spyOn(urlCategoryService, 'getCategoryByCodes').mockReturnValueOnce(category);
            const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue([]);
            const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});

            //when
            const result = await service.filter(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject(category);
            expect(urlCategoryService.getHostCategoryCodes).toBeCalledTimes(1);
            expect(urlCategoryService.getCategoryByCodes).toBeCalledTimes(1);
            expect(urlCategoryService.getCategoryByCodes).toBeCalledWith(url, codes);
            expect(localStorageManagerGetSpy).toBeCalledTimes(1);
            expect(localStorageManagerSetSpy).toBeCalledTimes(0);
        });

        it('Should return blocked category if code is found in educational codes but url is non permissible urls', async () => {
            //given
            const url = 'gambling.com';
            let store = TestUtils.buildStore(undefined, ['gambling.com']);
            service = new ConfigurationFilter(logger, store, urlCategoryService, chromeUtils);

            const category = {
                level: PrrLevel.ONE,
                key: 'gambling',
                category: PrrCategory.GAMBLING,
                name: 'Gambling',
                status: UrlStatus.BLOCK,
            } as ContentResult;
            const codes = [10118];

            //mock dependencies
            jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
            jest.spyOn(urlCategoryService, 'getCategoryByCodes').mockReturnValueOnce(category);
            const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue([]);
            const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});

            //when
            const result = await service.filter(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject(category);
            expect(urlCategoryService.getHostCategoryCodes).toBeCalledTimes(1);
            expect(urlCategoryService.getCategoryByCodes).toBeCalledTimes(1);
            expect(urlCategoryService.getCategoryByCodes).toBeCalledWith(url, codes);
            expect(localStorageManagerGetSpy).toBeCalledTimes(1);
            expect(localStorageManagerSetSpy).toBeCalledTimes(0);
        });

        it('Should return allow category if url is found in non permissible urls but url is educational host', async () => {
            //given
            const url = 'class.com';
            let store = TestUtils.buildStore(undefined, ['gambling.com']);
            service = new ConfigurationFilter(logger, store, urlCategoryService, chromeUtils);

            const category = {
                level: PrrLevel.ONE,
                key: 'gambling',
                category: PrrCategory.GAMBLING,
                name: 'Gambling',
                status: UrlStatus.BLOCK,
            } as ContentResult;
            const codes = [10118];

            //mock dependencies
            jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
            jest.spyOn(urlCategoryService, 'getCategoryByCodes').mockReturnValueOnce(category);
            const localStorageManagerGetSpy = jest.spyOn(localStorageManager, 'get').mockResolvedValue([]);
            const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {});

            //when
            const result = await service.filter(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject(category);
            expect(urlCategoryService.getHostCategoryCodes).toBeCalledTimes(1);
            expect(urlCategoryService.getCategoryByCodes).toBeCalledTimes(1);
            expect(urlCategoryService.getCategoryByCodes).toBeCalledWith(url, codes);
            expect(localStorageManagerGetSpy).toBeCalledTimes(1);
            expect(localStorageManagerSetSpy).toBeCalledTimes(0);
        });
    });
});
