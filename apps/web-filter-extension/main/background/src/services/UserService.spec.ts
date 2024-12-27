import {Logger, ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {UserService, UserServiceImpl} from './UserService';
import {FetchApiService, RESTService} from '@shared/rest/RestService';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {jest} from '@jest/globals';
import {PRR_INFORM_EXT_DISABLE} from './endpoints';
import {PrrCategory} from '@shared/types/PrrCategory';

describe('User service test', () => {
  let service: UserService;
  const logger: Logger = new ConsoleLogger();
  const localStorageManager = new LocalStorageManager();
  const chromeUtils = new ChromeUtils(logger, localStorageManager);
  const restService: RESTService = new FetchApiService(chromeUtils);

  beforeEach(async () => {
    service = new UserServiceImpl(logger, restService, localStorageManager);
  });

  describe('Update access', () => {
    test('it should update user access', async () => {
      //given
      const accessLimited = true;

      //mock dependencies
      const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {
      });
      const localStorageManagerRemoveSpy = jest.spyOn(localStorageManager, 'remove').mockImplementation(async (value: any) => {
      });
      const httpRequestSpy = jest.spyOn(restService, 'doPatch').mockResolvedValue(true);

      //when
      await service.updateAccess(accessLimited, PrrCategory.SEX_EDUCATION);

      //then
      expect(httpRequestSpy).toBeCalledTimes(1);
      expect(localStorageManagerSetSpy).toBeCalledTimes(2);
      expect(localStorageManagerRemoveSpy).toBeCalledTimes(0);
    });

    test('it should update user access', async () => {
      //given
      const accessLimited = false;

      //mock dependencies
      const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {
      });
      const localStorageManagerRemoveSpy = jest.spyOn(localStorageManager, 'remove').mockImplementation(async (value: any) => {
      });
      const httpRequestSpy = jest.spyOn(restService, 'doPatch').mockResolvedValue(false);

      //when
      await service.updateAccess(accessLimited, 'PrrCategory.SEX_EDUCATION');

      //then
      expect(httpRequestSpy).toBeCalledTimes(1);
      expect(localStorageManagerSetSpy).toBeCalledTimes(4);
      expect(localStorageManagerRemoveSpy).toBeCalledTimes(3);
    });

    test('it should fail request while updating user access', async () => {
      //given
      const accessLimited = true;

      //mock dependencies
      const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {
      });
      const localStorageManagerRemoveSpy = jest.spyOn(localStorageManager, 'remove').mockImplementation(async (value: any) => {
      });
      const httpRequest = jest.spyOn(restService, 'doPatch').mockImplementation(async () => {
        throw new Error('Dummy error');
      });

      //when
      let failed = false;
      await service.updateAccess(accessLimited, 'PrrCategory.SEX_EDUCATION').catch((error) => {
        failed = error;
      });

      //then
      expect(failed).toBeTruthy();
      expect(httpRequest).toBeCalledTimes(1);
      expect(localStorageManagerSetSpy).toBeCalledTimes(2);
      expect(localStorageManagerRemoveSpy).toBeCalledTimes(0);
    });
  });

  describe('Check user access', () => {
    test('it should get user access status true', async () => {
      //given
      const response = {accessLimited: true};

      //mock dependencies
      const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {
      });
      const localStorageManagerRemoveSpy = jest.spyOn(localStorageManager, 'remove').mockImplementation(async (value: any) => {
      });
      const httpRequest = jest.spyOn(restService, 'doGet').mockResolvedValueOnce(response);

      //when
      const result = await service.getUserAccess();

      //then
      expect(result).toBeTruthy();
      expect(httpRequest).toBeCalledTimes(1);
      expect(localStorageManagerSetSpy).toBeCalledTimes(2);
      expect(localStorageManagerRemoveSpy).toBeCalledTimes(0);
    });

    test('it should get user access status false', async () => {
      //given
      const response = {accessLimited: false};

      //mock dependencies
      const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {
      });
      const localStorageManagerRemoveSpy = jest.spyOn(localStorageManager, 'remove').mockImplementation(async (value: any) => {
      });
      const httpRequest = jest.spyOn(restService, 'doGet').mockResolvedValueOnce(response);

      //when
      const result = await service.getUserAccess();

      //then
      expect(result).toBeFalsy();
      expect(httpRequest).toBeCalledTimes(1);
      expect(localStorageManagerSetSpy).toBeCalledTimes(4);
      expect(localStorageManagerRemoveSpy).toBeCalledTimes(3);
    });

    test('it should fail request while getting user access', async () => {
      //mock dependencies
      const httpRequest = jest.spyOn(restService, 'doGet').mockImplementation(async () => {
        throw new Error('dummy error');
      });

      //when
      let failed = false;
      const result = await service.getUserAccess().catch(() => {
        failed = true;
      });

      //then
      expect(result).toBeFalsy();
      expect(failed).toBeTruthy();
      expect(httpRequest).toBeCalledTimes(1);
    });
  });

  describe('Get parents list', () => {
    test('it should get user parents list -> parent count = 0', async () => {
      //given
      const response: string[] = [];

      //mock dependencies
      jest.spyOn(restService, 'doGet').mockResolvedValueOnce(response);

      //when
      const result: any = await service.getParentsList();

      //then
      expect(result).toBeTruthy();
    });

    test('it should get user parents list -> parent count > 0', async () => {
      //given
      const parentObj = {
        id: 'id',
        email: 'mocked@safekids.biz',
        avatar: 'mockedAvatar',
        firstName: 'safekids',
        lastName: 'admin',
      };
      const response = [parentObj];

      //mock dependencies
      jest.spyOn(restService, 'doGet').mockResolvedValueOnce(response);

      //when
      const result: [] = await service.getParentsList();

      //then
      expect(result).toBeTruthy();
      expect(result).toBe(response);
    });

    test('it should fail request while fetching parents list', async () => {
      //mock dependencies
      const httpRequest = jest.spyOn(restService, 'doGet').mockImplementation(async () => {
        throw new Error('dummy error');
      });

      //when
      let failed = false;
      const result = await service.getParentsList().catch(() => {
        failed = true;
      });

      //then
      expect(result).toBeFalsy();
      expect(failed).toBeTruthy();
      expect(httpRequest).toBeCalledTimes(1);
    });

    test('it should call notify api', async () => {
      const spy = jest.spyOn(restService, 'doPost');

      service.notifyParents();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(PRR_INFORM_EXT_DISABLE);
    });

    test('it should throw error when request fails', async () => {
      jest.spyOn(restService, 'doPost').mockImplementation(() => {
        throw new Error('');
      });
      expect(() => service.notifyParents()).toThrowError();
    });
  });

  describe('Reset Prr counters', () => {
    test('it should reset Prr counters', async () => {
      const localStorageManagerSetSpy = jest.spyOn(localStorageManager, 'set').mockImplementation(async (value: any) => {
      });
      const localStorageManagerRemoveSpy = jest.spyOn(localStorageManager, 'remove').mockImplementation(async (value: any) => {
      });

      service.resetPRRCounters();

      expect(localStorageManagerSetSpy).toBeCalledTimes(3);
      expect(localStorageManagerRemoveSpy).toBeCalledTimes(3);
    });
  });
});
