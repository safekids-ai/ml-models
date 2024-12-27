import {LocalWebCategoryCategoriesService} from '@shared/web-category/service/impl/LocalWebCategoryCategoriesService';
import {PrrCategory} from '@shared/types/PrrCategory';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {WebCategoryUrlCategoriesService} from '@shared/web-category/service/impl/WebCategoryUrlCategoriesService';
import {UrlCategoryService} from '@shared/web-category/service/UrlCategoryService';
import {LRUCache} from '@shared/cache/LRUCache';
import {RESTWebCategoryCategoriesService} from '@shared/web-category/service/impl/RESTWebCategoryCategoriesService';
import {ContentResult} from '@shared/types/ContentResult';
import {PrrLevel} from '@shared/types/PrrLevel';
import {jest} from '@jest/globals';
import {UrlStatus} from '@shared/types/UrlStatus';

describe('WebCategory url category service test', () => {
  let service: UrlCategoryService;
  const logger = new ConsoleLogger();
  const lruCache = new LRUCache<string, number[]>(200);
  const localUrlCategoryService = new LocalWebCategoryCategoriesService(logger);
  const restWebCategoryCategoriesService = new RESTWebCategoryCategoriesService(lruCache, logger);
  beforeEach(async () => {
    service = new WebCategoryUrlCategoriesService(localUrlCategoryService, restWebCategoryCategoriesService);
  });

  describe('Initialize webCategory categories from local webCategory service', () => {
    it('Should initialize webCategory categories from local webCategory service', async () => {
      //mock dependencies
      jest.spyOn(localUrlCategoryService, 'initialize').mockResolvedValueOnce();

      //when
      await service.initialize({url: '', key: ''});

      //then
      expect(localUrlCategoryService.initialize).toBeCalledTimes(1);
    });
  });

  describe('Get category by codes', () => {
    it('Should get codes from local webCategory service', async () => {
      //given
      const host = 'facebook.com';
      const codes = [10094];

      //mock dependencies
      const expected = {
        host,
        status: UrlStatus.ALLOW,
        category: PrrCategory.EDUCATIONAL,
        level: PrrLevel.ZERO,
        key: PrrCategory.EDUCATIONAL,
        name: PrrCategory.EDUCATIONAL,
      } as ContentResult;
      jest.spyOn(localUrlCategoryService, 'getCategoryByCodes').mockReturnValueOnce(expected);

      //when
      const result = service.getCategoryByCodes(host, codes);

      //then
      expect(localUrlCategoryService.getCategoryByCodes).toBeCalledTimes(1);
      expect(localUrlCategoryService.getCategoryByCodes).toBeCalledWith(host, codes);
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
  });

  describe('Get codes by host', () => {
    it('Should get codes by host from remote service', async () => {
      //given
      const host = 'facebook.com';
      const codes = [10094];

      //mock dependencies
      jest.spyOn(localUrlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce([]);
      jest.spyOn(restWebCategoryCategoriesService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);

      //when
      const result = await service.getHostCategoryCodes(host);

      //then
      expect(result).toBeTruthy();
      // expect(result).toEqual(codes)
      expect(localUrlCategoryService.getHostCategoryCodes).toBeCalledTimes(1);
      expect(localUrlCategoryService.getHostCategoryCodes).toBeCalledWith(host);
      expect(restWebCategoryCategoriesService.getHostCategoryCodes).toBeCalledTimes(1);
    });

    it('Should not call remote service if codes available in local file', async () => {
      //given
      const host = 'fake.com';
      const codes = [];

      //mock dependencies
      jest.spyOn(localUrlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce([10094]);
      const restWebCategoryCategoriesServiceSpy = jest.spyOn(restWebCategoryCategoriesService, 'getHostCategoryCodes');

      //when
      const result = await service.getHostCategoryCodes(host);

      //then
      expect(result).toBeTruthy();
      // expect(result).toEqual(codes)
      expect(localUrlCategoryService.getHostCategoryCodes).toBeCalledTimes(1);
      expect(localUrlCategoryService.getHostCategoryCodes).toBeCalledWith(host);
      expect(restWebCategoryCategoriesServiceSpy).toBeCalledTimes(0);
    });
  });
});
