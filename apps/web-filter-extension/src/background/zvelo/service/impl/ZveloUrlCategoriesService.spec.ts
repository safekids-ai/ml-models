import {LocalZveloCategoriesService} from '@shared/zvelo/service/impl/LocalZveloCategoriesService';
import {PrrCategory} from '@shared/types/PrrCategory';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {ZveloUrlCategoriesService} from '@shared/zvelo/service/impl/ZveloUrlCategoriesService';
import {UrlCategoryService} from '@shared/zvelo/service/UrlCategoryService';
import {LRUCache} from '@shared/cache/LRUCache';
import {RESTZveloCategoriesService} from '@shared/zvelo/service/impl/RESTZveloCategoriesService';
import {ContentResult} from '@shared/types/ContentResult';
import {PrrLevel} from '@shared/types/PrrLevel';
import {jest} from '@jest/globals';
import {UrlStatus} from '@shared/types/UrlStatus';

describe('Zvelo url category service test', () => {
  let service: UrlCategoryService;
  const logger = new ConsoleLogger();
  const lruCache = new LRUCache<string, number[]>(200);
  const localUrlCategoryService = new LocalZveloCategoriesService(logger);
  const restZveloCategoriesService = new RESTZveloCategoriesService(lruCache, logger);
  beforeEach(async () => {
    service = new ZveloUrlCategoriesService(localUrlCategoryService, restZveloCategoriesService);
  });

  describe('Initialize zvelo categories from local zvelo service', () => {
    it('Should initialize zvelo categories from local zvelo service', async () => {
      //mock dependencies
      jest.spyOn(localUrlCategoryService, 'initialize').mockResolvedValueOnce();

      //when
      await service.initialize({url: '', key: ''});

      //then
      expect(localUrlCategoryService.initialize).toBeCalledTimes(1);
    });
  });

  describe('Get category by codes', () => {
    it('Should get codes from local zvelo service', async () => {
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
      jest.spyOn(restZveloCategoriesService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);

      //when
      const result = await service.getHostCategoryCodes(host);

      //then
      expect(result).toBeTruthy();
      // expect(result).toEqual(codes)
      expect(localUrlCategoryService.getHostCategoryCodes).toBeCalledTimes(1);
      expect(localUrlCategoryService.getHostCategoryCodes).toBeCalledWith(host);
      expect(restZveloCategoriesService.getHostCategoryCodes).toBeCalledTimes(1);
    });

    it('Should not call remote service if codes available in local file', async () => {
      //given
      const host = 'fake.com';
      const codes = [];

      //mock dependencies
      jest.spyOn(localUrlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce([10094]);
      const restZveloCategoriesServiceSpy = jest.spyOn(restZveloCategoriesService, 'getHostCategoryCodes');

      //when
      const result = await service.getHostCategoryCodes(host);

      //then
      expect(result).toBeTruthy();
      // expect(result).toEqual(codes)
      expect(localUrlCategoryService.getHostCategoryCodes).toBeCalledTimes(1);
      expect(localUrlCategoryService.getHostCategoryCodes).toBeCalledWith(host);
      expect(restZveloCategoriesServiceSpy).toBeCalledTimes(0);
    });
  });
});
