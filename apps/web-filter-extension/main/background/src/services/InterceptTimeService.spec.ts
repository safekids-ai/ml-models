import {ConsoleLogger, Logger} from '@shared/logging/ConsoleLogger';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {InterceptTimeService} from './InterceptTimeService';
import {interceptTimeType} from 'apps/web-filter-extension/shared/redux/reducers/settings';

describe('InterceptTimeService test', () => {
  let interceptTimeService: InterceptTimeService;
  const logger: Logger = new ConsoleLogger();
  const schoolStartTime = '08:00:00';
  const schoolEndTime = '15:00:00';
  const sleepStartTime = '21:00:00';
  const sleepEndTime = '05:00:00';
  let schoolTime: interceptTimeType = {endTime: schoolEndTime, startTime: schoolStartTime};
  let sleepTime: interceptTimeType = {endTime: sleepEndTime, startTime: sleepStartTime};

  describe('Test Off Times', () => {
    test('Should return false for holiday and offtime', async () => {
      let store = TestUtils.buildInterceptTimeSetting(false, schoolTime, sleepTime);
      interceptTimeService = new InterceptTimeService(logger, store);

      const now = new Date();
      now.setHours(10);
      const result = await interceptTimeService.getOffTimes(now);
      expect(result.isOffDay).toBeFalsy();
      expect(result.isOffTime).toBeFalsy();
    });

    test('Should return false for holiday and true for offtime', async () => {
      let store = TestUtils.buildInterceptTimeSetting(false, schoolTime, sleepTime);
      interceptTimeService = new InterceptTimeService(logger, store);

      const now = new Date();
      now.setHours(18);
      const result = await interceptTimeService.getOffTimes(now);
      expect(result.isOffDay).toBeFalsy();
      expect(result.isOffTime).toBeTruthy();
    });

    test('Should result true for holiday', async () => {
      let store = TestUtils.buildInterceptTimeSetting(true, schoolTime, sleepTime);
      interceptTimeService = new InterceptTimeService(logger, store);

      const now = new Date();
      let result: any = await interceptTimeService.getOffTimes(now);
      expect(result.isOffDay).toBeTruthy();
    });
  });
  describe('Test Leisure Time', () => {
    test('Should result false for Leisure Time', async () => {
      let store = TestUtils.buildInterceptTimeSetting(false, schoolTime, sleepTime);
      interceptTimeService = new InterceptTimeService(logger, store);

      const now = new Date();
      now.setHours(10);
      const result = await interceptTimeService.isLeisureTime(now);

      expect(result).toBeFalsy();
    });

    test('Should result true for Leisure Time', async () => {
      let store = TestUtils.buildInterceptTimeSetting(true, schoolTime, sleepTime);
      interceptTimeService = new InterceptTimeService(logger, store);

      const now = new Date();
      now.setHours(10);
      const result = await interceptTimeService.isLeisureTime(now);

      expect(result).toBeTruthy();
    });

    test('Should result true for Leisure Time', async () => {
      let store = TestUtils.buildInterceptTimeSetting(false, schoolTime, sleepTime);
      interceptTimeService = new InterceptTimeService(logger, store);

      const now = new Date();
      now.setHours(17);
      const result = await interceptTimeService.isLeisureTime(now);

      expect(result).toBeTruthy();
    });
  });
});
