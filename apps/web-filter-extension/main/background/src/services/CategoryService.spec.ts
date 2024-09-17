import {CategoryService, CategoryServiceImpl} from './CategoryService';
import {ConsoleLogger, Logger} from '@shared/logging/ConsoleLogger';
import {FetchApiService, RESTService} from '@shared/rest/RestService';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';

describe('Category service test', () => {
  let service: CategoryService;
  const logger: Logger = new ConsoleLogger();
  const localStorageManager = new LocalStorageManager();
  const chromeUtils = new ChromeUtils(logger, localStorageManager);
  const restService: RESTService = new FetchApiService(chromeUtils);

  beforeEach(async () => {
    service = new CategoryServiceImpl(logger, restService);
  });

  describe('update categories', () => {
    test('it should update category status', async () => {
      //given
      const payload = {categoryId: 'ADULT_SEXUAL_CONTENT', status: 'INFORM'};

      //mock dependencies
      jest.spyOn(restService, 'doPut').mockResolvedValueOnce(true);

      //when
      const result = await service.updateCategories(payload);

      //then
      expect(result).toBeTruthy();
    });

    test('it should not update category status', async () => {
      //given
      const payload = {categoryId: 'ADULT_SEXUAL_CONTENT'};

      //mock dependencies
      jest.spyOn(restService, 'doPut').mockResolvedValueOnce(false);

      //when
      const result = await service.updateCategories(payload);

      //then
      expect(result).toBeFalsy();
    });

    test('it should fail request while updating category status', async () => {
      //given
      const payload = {categoryId: 'ADULT_SEXUAL_CONTENT'};

      //mock dependencies
      jest.spyOn(restService, 'doPut').mockImplementation(async () => {
        throw new Error('dummy error');
      });

      //when
      let failed = false;
      const result = await service.updateCategories(payload).catch(() => {
        failed = true;
      });

      //then
      expect(result).not.toBeTruthy();
      expect(failed).toBeTruthy();
    });
  });

  describe('update categories time and offtime', () => {
    test('it should update categories time and offtime', async () => {
      //given
      const offTime = '12:00';
      const payload = [
        {categoryId: 'ADULT_SEXUAL_CONTENT', timeDuration: 60},
        {categoryId: 'ONLINE_GAMING', timeDuration: 20},
      ];

      //mock dependencies
      jest.spyOn(restService, 'doPut').mockResolvedValueOnce(true);

      //when
      const result = await service.updateCategoriesTime(payload, offTime);

      //then
      expect(result).toBeTruthy();
    });

    test('it should not update categories time and offtime', async () => {
      //given -> invalid payload
      const offTime = '12:00';
      const payload = [{categoryId: 'ONLINE_GAMING'}];

      //mock dependencies
      jest.spyOn(restService, 'doPut').mockResolvedValueOnce(false);

      //when
      const result = await service.updateCategoriesTime(payload, offTime);

      //then
      expect(result).toBeFalsy();
    });

    test('it should fail request while updating categories time', async () => {
      //given -> invalid payload
      const offTime = '12:00';
      const payload = [
        {categoryId: 'ADULT_SEXUAL_CONTENT', timeDuration: 60},
        {categoryId: 'ONLINE_GAMING', timeDuration: 20},
      ];

      //mock dependencies
      jest.spyOn(restService, 'doPut').mockImplementation(async () => {
        throw new Error('dummy error');
      });

      //when
      let failed = false;
      const result = await service.updateCategoriesTime(payload, offTime).catch(() => {
        failed = true;
      });

      //then
      expect(result).not.toBeTruthy();
      expect(failed).toBeTruthy();
    });
  });
});
