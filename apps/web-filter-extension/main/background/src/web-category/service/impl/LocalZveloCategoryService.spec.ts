import {LocalWebCategoryCategoriesService} from '@shared/web-category/service/impl/LocalWebCategoryCategoriesService';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {jest} from '@jest/globals';
import {UrlStatus} from '@shared/types/UrlStatus';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {ContentResult} from '@shared/types/ContentResult';

function mockFetchResponse(data: any, status: boolean = true) {
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      ok: status,
    })
  ) as jest.Mock;
}

function mockFetchCallFailure() {
  // @ts-ignore
  global.fetch = jest.fn(() => {
    throw new Error();
  }) as jest.Mock;
}

describe('Local WebCategory category service test', () => {
  let service: LocalWebCategoryCategoriesService;
  const logger = new ConsoleLogger();
  beforeEach(async () => {
    service = new LocalWebCategoryCategoriesService(logger);
  });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('LOCAL - Initialize webCategory categories from file', () => {
    it('Should initialize webCategory categories from file', async () => {
      //given
      const categories = {
        url: 'facebook.com',
        codes: [10094],
      };
      mockFetchResponse(categories);

      //when
      await service.initialize();

      //then
      expect(service.getWebCategoryCategories()).toBeTruthy();
      expect(service.getWebCategoryCategories()).toBe(categories);
    });

    it('Should retry to initialize webCategory categories from file', async () => {
      //given
      const categories = {
        url: 'facebook.com',
        codes: [10094],
      };

      mockFetchResponse({}, false);

      //when
      await service.initialize();
    });

    it('Should retry to initialize webCategory categories from file if loading fails', async () => {
      //given
      const categories = {
        url: 'facebook.com',
        codes: [10094],
      };

      mockFetchCallFailure();

      //when
      await service.initialize().catch(() => {
      });
    });
  });

  describe('LOCAL - Get category by codes', () => {
    it('Should get education category if codes are educational', async () => {
      //given
      const host = 'fitpeople.com';
      const codes = [10106];

      //when
      const result = service.getCategoryByCodes(host, codes);

      //then
      const expected = {
        host,
        status: UrlStatus.ALLOW,
        category: PrrCategory.EDUCATIONAL,
        level: PrrLevel.ZERO,
        key: PrrCategory.EDUCATIONAL,
        name: PrrCategory.EDUCATIONAL,
      } as ContentResult;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    it('Should get Gambling category if codes are of gambling', async () => {
      //given
      const host = 'gambling.com';
      const codes = [10005];

      //when
      const result = service.getCategoryByCodes(host, codes);

      //then
      const expected = {
        host,
        level: PrrLevel.ONE,
        key: 'gambling'.toUpperCase(),
        category: PrrCategory.GAMBLING,
        name: 'Gambling',
        status: UrlStatus.BLOCK,
      };
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    it('Should get Tobacco category if codes are of tobacco', async () => {
      //given
      const host = '10014tobacco.com';
      const codes = [10014];

      //when
      const result = service.getCategoryByCodes(host, codes);

      //then
      const expected = {
        host,
        level: PrrLevel.ONE,
        key: 'tobacco'.toUpperCase(),
        category: PrrCategory.DRUGS_ALCOHOL_TOBACCO,
        name: 'Drug, Alcohol or Tobacco Related',
        status: UrlStatus.BLOCK,
      };
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    it('Should get empty category if no code is returned from zvello codes', async () => {
      //given
      const host = '10014tobacco.com';
      const codes = [100144];

      //when
      const result = service.getCategoryByCodes(host, codes);
      //then
      const expected = {
        host,
        level: PrrLevel.ONE,
        key: '',
        category: '',
        name: '',
        status: UrlStatus.ALLOW,
      };
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
  });

  describe('LOCAL - Get codes by host', () => {
    it('Should get codes by host from local', async () => {
      //given
      const host = 'facebook.com';
      const codes = [10094];
      const categories = {'facebook.com': codes};

      //mock dependencies
      jest.spyOn(service, 'getWebCategoryCategories').mockReturnValue(categories);

      //when
      const result = await service.getHostCategoryCodes(host);

      //then
      expect(result).toBeTruthy();
      expect(result).toEqual(codes);
    });

    it('Should get empty array of codes if not found locally', async () => {
      //given
      const host = 'newHost.com';

      //mock dependencies
      jest.spyOn(service, 'getWebCategoryCategories').mockReturnValue([]);

      //when
      const result = await service.getHostCategoryCodes(host);

      //then
      expect(result).toBeTruthy();
      expect(result).toEqual([]);
    });
  });
});
