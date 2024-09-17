import {OnBoardingService, OnBoardingServiceImpl} from './OnBoardingService';
import {AxiosApiService, RESTService} from '@shared/rest/RestService';
import {ConsoleLogger, Logger} from '@shared/logging/ConsoleLogger';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {jest} from '@jest/globals';
import {ChromeTabHelper} from '@shared/chrome/tabs/ChromeTabHelper';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';

describe('OnBoarding service test', () => {
  let onBoardingServiceImpl: OnBoardingService;
  const logger: Logger = new ConsoleLogger();
  const store = TestUtils.buildSettingsState();
  const localStorageManager = new LocalStorageManager();
  const chromeUtils = new ChromeUtils(logger, localStorageManager);
  const chromeTabHelper = new ChromeTabHelper(logger, store);
  const restService: RESTService = new AxiosApiService(chromeUtils);

  beforeEach(async () => {
    onBoardingServiceImpl = new OnBoardingServiceImpl(logger, chromeTabHelper, chromeUtils, restService);
  });

  describe('starting onboarding', () => {
    test('it should start onboarding ', async () => {
      const getUserCredentialsSpy = jest.spyOn(chromeUtils, 'getUserCredentials').mockResolvedValueOnce({
        accessCode: '',
      });
      jest.spyOn(chromeTabHelper, 'create').mockImplementation(() => {
      });

      onBoardingServiceImpl.onBoard();

      expect(getUserCredentialsSpy).toBeCalledTimes(1);
    });
    test('it should not start onboarding if credentials are present ', async () => {
      const getUserCredentialsSpy = jest.spyOn(chromeUtils, 'getUserCredentials').mockResolvedValueOnce({
        accessCode: '1111',
      });
      jest.spyOn(chromeTabHelper, 'create').mockImplementation(() => {
      });

      onBoardingServiceImpl.onBoard();

      expect(getUserCredentialsSpy).toBeCalledTimes(1);
    });
  });

  describe('Get onboadring status', () => {
    test('it should get user onboadring status', async () => {
      //given
      const response = {status: 'IN_PROGRESS', step: 1};

      //mock dependencies
      jest.spyOn(restService, 'doGet').mockResolvedValueOnce(response);

      //when
      const result = await onBoardingServiceImpl.getOnboardingStatus();

      //then
      expect(result).toBeTruthy();
      expect(result).toBe(response);
    });
    test('it should fail request while getting onboadring status', async () => {
      //mock dependencies
      jest.spyOn(restService, 'doGet').mockImplementation(async () => {
        throw new Error('dummy error');
      });

      //when
      let failed = false;
      const result = await onBoardingServiceImpl.getOnboardingStatus().catch(() => {
        failed = true;
      });

      //then
      expect(result).not.toBeTruthy();
      expect(failed).toBeTruthy();
    });
  });

  describe('Update onboadring status', () => {
    test('it should update user onboadring status', async () => {
      //given
      const request = {status: 'IN_PROGRESS', step: 1};
      const response = {status: 'IN_PROGRESS', step: 1};

      //mock dependencies
      jest.spyOn(restService, 'doPut').mockResolvedValueOnce(response);

      //when
      const result = await onBoardingServiceImpl.saveOnboardingStatus(request);

      //then
      expect(result).toBeTruthy();
      expect(result).toBe(response);
    });

    test('it should fail request while updating onboadring status', async () => {
      //given
      const request = {status: 'IN_PROGRESS', step: 1};

      //mock dependencies
      jest.spyOn(restService, 'doPut').mockImplementation(async () => {
        throw new Error('dummy error');
      });

      //when
      let failed = false;
      const result = await onBoardingServiceImpl.saveOnboardingStatus(request).catch(() => {
        failed = true;
      });

      //then
      expect(result).not.toBeTruthy();
      expect(failed).toBeTruthy();
    });
  });
});
