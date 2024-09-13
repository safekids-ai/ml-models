import {mock} from 'ts-mockito';
import {Logger} from '@shared/logging/ConsoleLogger';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ActivityService, ActivityServiceImpl} from '../../services/ActivityService';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {PrrCategory} from '@shared/types/PrrCategory';
import {InformEventHandler} from './InformEventHandler';
import {RESTService} from '@shared/rest/RestService';
import {ConfigurationService} from '../../services/ConfigurationService';
import {PrrReportManager} from '../../prr/PrrReportManager';
import {InterceptTimeService} from '../../services/InterceptTimeService';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {ChromeAlarmUtil} from '@shared/chrome/alarm/ChromeAlarmUtil';

describe('Test Inform Event Manager', () => {
  let instance: InformEventHandler;

  const logger: Logger = mock<Logger>();
  const localStorage = new LocalStorageManager();
  const restService: RESTService = mock<RESTService>();
  const configurationsService: ConfigurationService = mock<ConfigurationService>();
  const prrReportManager: PrrReportManager = mock<PrrReportManager>();
  const interceptionTimeService: InterceptTimeService = mock<InterceptTimeService>();
  const chromeUtils = mock<ChromeUtils>();
  let store: ReduxStorage = TestUtils.buildStore([], [], PrrCategory.ONLINE_GAMING, [], true, true);
  const activityService: ActivityService = new ActivityServiceImpl(
    store,
    logger,
    chromeUtils,
    localStorage,
    restService,
    configurationsService,
    prrReportManager,
    interceptionTimeService
  );

  jest.spyOn(ChromeAlarmUtil, 'create').mockImplementation(() => {
  });

  beforeEach(() => {
    instance = new InformEventHandler(logger, store, localStorage, activityService);
  });

  test('Should return true when tab id and url are undefined', async () => {
    //Arrange

    //Action
    const status = await instance.checkUrlStatus(undefined, undefined);
    //Assert
    expect(status.status).toBeTruthy();
  });
  describe('Test check tab status', () => {
    test('Should return false when tab is not inform event state', async () => {
      //Arrange
      jest.spyOn(localStorage, 'get').mockResolvedValue(undefined);
      jest.spyOn(instance, 'deleteInformUrl').mockImplementation(async () => {
      });
      jest.spyOn(instance, 'endEvent').mockImplementation(async () => {
      });
      //Action
      const status = await instance.checkUrlStatus(111, 'facebook.com');
      //Assert
      expect(status.status).toBeFalsy();
    });

    test('Should return true when tab is in inform event state and not timed out', async () => {
      //Arrange
      const timestamp = new Date().getTime();
      jest.spyOn(localStorage, 'get').mockResolvedValue({url: 'facebook.com', timestamp});
      jest.spyOn(localStorage, 'set').mockImplementation(async () => {
      });
      jest.spyOn(instance, 'endEvent').mockImplementation(async () => {
      });
      jest.spyOn(instance, 'getTabVisits').mockResolvedValue([{url: 'facebook.com', timestamp}]);
      //Action
      const status = await instance.checkUrlStatus(111, 'facebook.com');
      //Assert
      expect(status.status).toBeTruthy();
    });

    test('Should return false when tab is in inform event state and not timed out but visits exceeds the limit', async () => {
      //Arrange
      let store: ReduxStorage = TestUtils.buildStore([], [], PrrCategory.ONLINE_GAMING, [], true, true, 5, 2);
      instance = new InformEventHandler(logger, store, localStorage, activityService);
      const timestamp = new Date().getTime();
      jest.spyOn(instance, 'getInformUrls').mockResolvedValue({url: 'facebook.com', timestamp});
      jest.spyOn(instance, 'endEvent').mockImplementation(async () => {
      });
      jest.spyOn(instance, 'getTabVisits').mockResolvedValue([
        {
          url: 'facebook.com/ok',
          timestamp,
        },
        {url: 'facebook.com/3333', timestamp},
        {url: 'facebook.com/friends', timestamp},
      ]);
      //Action
      const status = await instance.checkUrlStatus(111, 'facebook.com');
      //Assert
      expect(status.status).toBeFalsy();
    });

    test('Should return false when tab is in inform event state and is timed out', async () => {
      //Arrange
      const time = new Date();
      const oldTime = time.setMinutes(time.getMinutes() - 10);
      jest.spyOn(localStorage, 'get').mockResolvedValue({url: 'facebook.com', timestamp: oldTime});
      jest.spyOn(instance, 'endEvent').mockImplementation(async () => {
      });
      //Action
      const status = await instance.checkUrlStatus(111, 'facebook.com');
      //Assert
      expect(status.status).toBeFalsy();
    });
  });

  describe('Test end Event', () => {
    test('Should end tab event and save tab visits to backend', async () => {
      const eventId = '111-facebookcom-123456';
      const time = new Date();
      const events = [
        {
          url: 'facebook.com/ok',
          timestamp: time.getTime(),
        },
        {url: 'facebook.com/3333', timestamp: time.getTime()},
        {url: 'facebook.com/friends', timestamp: time.getTime()},
      ];

      jest.spyOn(instance, 'getTabVisits').mockResolvedValue(events);
      jest.spyOn(instance, 'getInformUrls').mockResolvedValue({
        url: 'facebook.com/ok',
        timestamp: time.getTime(),
        eventId,
      });
      jest.spyOn(activityService, 'saveEvents').mockImplementation(async () => {
      });
      jest.spyOn(localStorage, 'remove').mockImplementation(async () => {
      });

      await instance.endEvent(111);

      expect(activityService.saveEvents).toBeCalledWith(eventId, events);
    });
  });

  describe('Test report event', () => {
    test('Should report tab event ', async () => {
      jest.spyOn(localStorage, 'set').mockImplementation(async () => {
      });
      jest.spyOn(localStorage, 'get').mockImplementation(async (key: string): Promise<any> => {
        console.log(`TAB ID ${key}`);
        return key === 'tab-visits-111' ? undefined : '';
      });

      await instance.reportEvent(111, 'facebook.com', '111-facebookcom-2312412412');

      expect(localStorage.set).toBeCalledTimes(2);
    });
  });
});
