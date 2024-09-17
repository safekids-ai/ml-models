import {UserService, UserServiceImpl} from './UserService';
import {ActivityService, ActivityServiceImpl} from './ActivityService';
import {ConfigurationServiceImpl} from './ConfigurationService';
import {PrrReports} from '@shared/prr/PrrReports';
import {PrrReportManager} from '../prr/PrrReportManager';
import {PrrReport} from '../prr/monitor/PrrMonitor';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {ConsoleLogger, Logger} from '@shared/logging/ConsoleLogger';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {EventType, PrrTrigger} from '@shared/types/message_types';
import {WebUsageTypeDto} from '@shared/types/WebUsage.type';
import {InterceptTimeService} from './InterceptTimeService';
import {FetchApiService, RESTService} from '@shared/rest/RestService';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {jest} from '@jest/globals';
import {ActiveWebUsageDto} from '@shared/types/ActiveWebUsage.type';
import {PrrLevel} from '@shared/types/PrrLevel';
import {PrrCategory} from '@shared/types/PrrCategory';

describe('Activity service test', () => {
  let service: ActivityService;
  const logger: Logger = new ConsoleLogger();
  const store: ReduxStorage = TestUtils.buildSettingsState();
  const localStorageManager = new LocalStorageManager();
  const chromeUtils = new ChromeUtils(logger, localStorageManager);
  const restService: RESTService = new FetchApiService(chromeUtils);
  const userService: UserService = new UserServiceImpl(logger, restService, localStorageManager);
  const configurationService = new ConfigurationServiceImpl(store, logger, restService, localStorageManager, userService);
  const storageManager = TestUtils.getChromeStorage();
  const prrReports = new PrrReports();
  const prrReportManager = new PrrReportManager(prrReports);
  const interceptTimeService = new InterceptTimeService(logger, store);

  beforeEach(async () => {
    service = new ActivityServiceImpl(
      store,
      logger,
      chromeUtils,
      storageManager as LocalStorageManager,
      restService,
      configurationService,
      prrReportManager,
      interceptTimeService
    );
  });

  describe('reportFalsePositiveReport', () => {
    test('it should report false postives', async () => {
      // given
      const tabId: number = 1;
      const response: PrrReport = {
        level: PrrLevel.ONE,
        texts: [],
        images: [],
        prrTriggerId: PrrTrigger.URL_INTERCEPTED,
        url: '',
        fullWebUrl: '',
        tabId: 1,
      };

      //mock dependencies
      jest.spyOn(prrReportManager, 'getReport').mockReturnValue(response);
      jest.spyOn(storageManager, 'get').mockResolvedValue('dummy_value' as never);
      jest.spyOn(restService, 'doPost').mockResolvedValue(true);

      //when
      await service.reportFalsePositiveReport(tabId);

      //then
      expect(prrReportManager.getReport).toBeCalledTimes(1);
      expect(storageManager.get).toBeCalledTimes(1);
      expect(restService.doPost).toBeCalledTimes(1);
    });
  });

  describe('reportEvent', () => {
    test('it should report event', async () => {
      //given
      const tabId: number = 1;
      const message: any = {
        prrLevelId: '',
        host: '',
        type: EventType.PRR_TRIGGER,
        category: '',
        prrTriggerId: '',
      };
      const request: PrrReport = {
        level: PrrLevel.ONE,
        texts: [],
        images: [],
        prrTriggerId: PrrTrigger.URL_INTERCEPTED,
        url: '',
        fullWebUrl: '',
        tabId: 1,
      };

      //received
      const webUsageDto = {
        prrActivityTypeId: EventType.PRR_TRIGGER,
        webUrl: '',
        webTitle: '',
        fullWebUrl: '',
        prrLevelId: PrrLevel.ONE,
        prrTriggerId: PrrTrigger.AI_VISION,
        prrCategoryId: PrrCategory.ALLOWED,
        teacherId: '',
        webActivityTypeId: EventType.PRR_TRIGGER,
        webCategoryId: PrrCategory.ALLOWED,
        accessLimited: true,
      } as WebUsageTypeDto;

      //mock dependencies
      jest.spyOn(prrReportManager, 'getReport').mockReturnValue(request);
      jest.spyOn(service, 'saveActivity').mockResolvedValue(webUsageDto);

      //when
      await service.reportEvent(message, tabId);

      //then
      expect(restService.doPost).toBeCalledTimes(0);
    });
  });

  describe('prrTriggered', () => {
    test('it should save ppr triggered event activity', async () => {
      //given
      const message: any = {
        prrLevelId: '',
        host: '',
        type: EventType.PRR_TRIGGER,
        category: '',
        prrTriggerId: '',
      };
      const prrReport: PrrReport = {
        level: PrrLevel.ONE,
        texts: [],
        images: [],
        prrTriggerId: PrrTrigger.URL_INTERCEPTED,
        url: '',
        fullWebUrl: '',
        tabId: 1,
      };

      //received
      const webUsageDto = {
        prrActivityTypeId: EventType.PRR_TRIGGER,
        webUrl: '',
        webTitle: '',
        fullWebUrl: '',
        prrLevelId: PrrLevel.TWO,
        prrTriggerId: PrrTrigger.AI_NLP_VISION,
        prrCategoryId: PrrCategory.ALLOWED,
        prrImages: prrReport.images,
        prrTexts: prrReport.texts,
        teacherId: '',
        webActivityTypeId: EventType.PRR_TRIGGER,
        webCategoryId: PrrCategory.ALLOWED,
        accessLimited: true,
      } as WebUsageTypeDto;

      //mock dependencies
      jest.spyOn(prrReportManager, 'getReport').mockReturnValue(prrReport);
      jest.spyOn(restService, 'doPost').mockResolvedValue(true);
      jest.spyOn(service, 'saveActivity').mockResolvedValue(webUsageDto);

      //when
      await service.prrTriggered(prrReport);

      //then
      expect(service.saveActivity).toBeCalledTimes(1);
    });
  });

  describe('savePageVisit', () => {
    test('it should save page visit activity', async () => {
      //given
      const message: any = {
        prrLevelId: '',
        host: '',
        type: EventType.PRR_TRIGGER,
        category: '',
        prrTriggerId: '',
      };

      //received
      const webUsageDto: WebUsageTypeDto = {
        webCategoryId: PrrCategory.ALLOWED,
        webActivityTypeId: EventType.PRR_TRIGGER,
        webUrl: '',
        webTitle: '',
        fullWebUrl: '',
        accessLimited: false,
      };

      //mock dependencies
      jest.spyOn(restService, 'doPost').mockResolvedValue(true);
      jest.spyOn(service, 'saveActivity').mockResolvedValue(webUsageDto);

      //when
      await service.savePageVisit(message);

      //then
      expect(service.saveActivity).toBeCalledTimes(1);
    });
  });

  describe('saveTitleClick', () => {
    test('it should save title click activity', async () => {
      //given
      const message: any = {
        webCategoryId: PrrCategory.ALLOWED,
        webActivityTypeId: EventType.TITLE_CLICK,
        webUrl: 'https://www.google.com',
        webTitle: 'Home',
        fullWebUrl: 'https://www.google.com?action=1',
        accessLimited: false,
      };

      //received
      const webUsageDto: WebUsageTypeDto = {
        webCategoryId: PrrCategory.ALLOWED,
        webActivityTypeId: EventType.TITLE_CLICK,
        webUrl: 'https://www.google.com',
        webTitle: 'Home',
        fullWebUrl: 'https://www.google.com?action=1',
        accessLimited: false,
      };

      //mock dependencies
      jest.spyOn(restService, 'doPost').mockResolvedValue(true);
      jest.spyOn(service, 'saveActivity').mockResolvedValue(webUsageDto);

      //when
      await service.saveTitleClick(message);

      //then
      expect(service.saveActivity).toBeCalledTimes(1);
    });
  });

  describe('sendTeacherMessage', () => {
    test('it should save send teacher message activity', async () => {
      //given
      const message: any = {
        prrActivityTypeId: EventType.MESSAGE_TEACHER,
        webActivityTypeId: EventType.PRR_TRIGGER,
        webUrl: 'https://www.google.com',
        fullWebUrl: 'https://www.google.com?action=1',
        prrMessages: ['message1', 'message2'],
        prrLevelId: PrrLevel.ONE,
        prrTriggerId: PrrTrigger.AI_NLP_VISION,
        prrCategoryId: PrrCategory.EXPLICIT,
        webCategoryId: PrrCategory.EXPLICIT,
        accessLimited: true,
        teacherId: '11111',
      };

      //received
      const webUsageDto = {
        prrActivityTypeId: EventType.MESSAGE_TEACHER,
        webActivityTypeId: EventType.PRR_TRIGGER,
        webUrl: 'https://www.google.com',
        fullWebUrl: 'https://www.google.com?action=1',
        prrMessages: message.messages,
        prrLevelId: message.prrLevelId,
        prrTriggerId: PrrTrigger.AI_NLP_VISION,
        prrCategoryId: PrrCategory.EXPLICIT,
        webCategoryId: PrrCategory.EXPLICIT,
        accessLimited: true,
      } as WebUsageTypeDto;
      const tabId = 111;
      //mock dependencies
      jest.spyOn(prrReportManager, 'getReport').mockReturnValue(message);
      jest.spyOn(service, 'saveActivity').mockResolvedValue(webUsageDto);

      //when
      await service.sendTeacherMessage(tabId, message);

      //then
      expect(service.saveActivity).toBeCalledTimes(1);
    });
  });

  describe('saveWebSearch', () => {
    test('it should save web search activity', async () => {
      //given
      let webURL =
        'https://www.google.com/search?q=facebook.com&oq=facebook.com&aqs=chrome..69i58j69i57j69i60l5j69i65.160272j1j7&sourceid=chrome&ie=UTF-8';

      //received
      const webUsageDto = {
        webCategoryId: 'PERMISSIBLE',
        webActivityTypeId: EventType.WEB_SEARCH,
        webUrl: '',
        fullWebUrl: '',
        webTitle: 'facebook',
        accessLimited: false,
      } as WebUsageTypeDto;

      //mock dependencies
      jest.spyOn(service, 'saveActivity').mockResolvedValue(webUsageDto);

      //when
      await service.saveWebSearch(webURL);

      webURL = 'https://www.bing.com/search?k=facebook.com&oq=facebook.com&aqs=chrome..69i58j69i57j69i60l5j69i65.160272j1j7&sourceid=chrome&ie=UTF-8';

      //when
      await service.saveWebSearch(webURL);

      webURL = 'https://www.duckduckgo.com/search?keyword=poodle';

      //when
      await service.saveWebSearch(webURL);

      //then
      expect(service.saveActivity).toBeCalledTimes(3);
    });
  });

  describe('saveAlertEvent', () => {
    test('it should save alert event activity', async () => {
      //received
      const webUsageDto = {
        userDeviceLinkId: 1,
        alertType: 'Extension-Updated',
      } as WebUsageTypeDto;

      //mock dependencies
      jest.spyOn(storageManager, 'get').mockResolvedValue('dummy_value' as never);
      jest.spyOn(service, 'saveActivity').mockResolvedValue(webUsageDto);

      //when
      await service.saveAlertEvent();

      //then
      expect(storageManager.get).toBeCalledTimes(1);
      expect(service.saveActivity).toBeCalledTimes(1);
    });
  });

  describe('saveActivity', () => {
    test('it should save activity', async () => {
      // given & received
      const webUsageDto = {
        prrActivityTypeId: EventType.MESSAGE_TEACHER,
        webActivityTypeId: EventType.PRR_TRIGGER,
        webUrl: '',
        webTitle: '',
        fullWebUrl: '',
        accessLimited: false,
      } as WebUsageTypeDto;

      const manifest = {
        name: 'my chrome extension',
        manifest_version: 2,
        version: '1.0.0',
      };

      //mock dependencies
      jest.spyOn(chromeUtils, 'getManifest').mockImplementation(() => manifest);
      jest.spyOn(restService, 'doPost').mockResolvedValue(webUsageDto);
      jest.spyOn(interceptTimeService, 'getOffTimes').mockResolvedValue({isOffDay: true, isOffTime: true});

      //when
      await service.saveActivity(webUsageDto);

      //then
      expect(restService.doPost).toBeCalledTimes(1);
    });
  });

  describe('saveActiveWebUsageTime', () => {
    test('it should save active webUsage time activity', async () => {
      //received
      const activeWebUsageDto = {
        tabId: 1,
        fullUrl: 'string',
        hostname: 'string',
        duration: 1,
        extensionVersion: 'string',
        browserVersion: 'string',
        mlVersion: 'string',
        nlpVersion: 'string',
        browser: 'string',
        ip: 'string',
        location: 'string',
        userDeviceLinkId: 'string',
      } as ActiveWebUsageDto;

      const manifest = {
        name: 'my chrome extension',
        manifest_version: 2,
        version: '1.0.0',
      };

      //mock dependencies
      jest.spyOn(chromeUtils, 'getManifest').mockImplementation(() => manifest);
      jest.spyOn(restService, 'doPost').mockResolvedValue(activeWebUsageDto);

      //when
      await service.saveActiveWebUsageTime(activeWebUsageDto);

      //then
      expect(restService.doPost).toBeCalledTimes(1);
    });
  });
});
