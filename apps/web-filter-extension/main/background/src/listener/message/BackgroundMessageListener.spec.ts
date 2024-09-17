import {PRRActionService, PRRActionServiceImpl} from '../../services/PRRActionService';
import {CategoryService, CategoryServiceImpl} from '../../services/CategoryService';
import {PredictionRequestHandler} from './handler/PredictionRequestHandler';
import {ConsoleLogger, Logger} from '@shared/logging/ConsoleLogger';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {QueueWrapper} from 'apps/web-filter-extension/shared/queue/QueueWrapper';
import {PrrMonitor, PrrReport} from '../../prr/monitor/PrrMonitor';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {BackgroundMessageListener} from './BackgroundMessageListener';
import {ActivityService, ActivityServiceImpl} from '../../services/ActivityService';
import {ChromeTabHelper} from '@shared/chrome/tabs/ChromeTabHelper';
import {ContentFilterManager, FilterManager} from '../../filter/ContentFilterManager';
import {UserService, UserServiceImpl} from '../../services/UserService';
import {PrrReportManager} from '../../prr/PrrReportManager';
import {AuthenticationService, AuthenticationServiceImpl} from '../../services/AuthenticationService';
import {OnBoardingService, OnBoardingServiceImpl} from '../../services/OnBoardingService';
import {ContentFilterChain} from '../../filter/ContentFilterChain';
import {RESTService} from '@shared/rest/RestService';
import {ConfigurationService} from '../../services/ConfigurationService';
import {PrrReports} from '@shared/prr/PrrReports';
import {InterceptTimeService} from '../../services/InterceptTimeService';
import {Runtime} from 'jest-chrome/types/jest-chrome';
import {EventType, MessageTypes} from '@shared/types/message_types';
import {PredictionRequest, PredictionResponse} from '@shared/types/messages';
import {PrrLevel} from '@shared/types/PrrLevel';
import {PrrCategory} from '@shared/types/PrrCategory';
import {jest} from '@jest/globals';
import {mock} from 'ts-mockito';
import MessageSender = Runtime.MessageSender;
import {UrlStatus} from '@shared/types/UrlStatus';
import {FilteredCategory} from '@shared/types/FilteredCategory.type';
import {PrrInform} from '@shared/types/PrrInform.type';
import {PrrAsk} from '@shared/types/PrrAsk.type';
import {MLPrrMonitor} from '../../prr/monitor/MLPrrMonitor';
import {PrrTriggerService} from '../../prr/PrrTriggerService';
import {InformEventHandler} from '../../event/handler/InformEventHandler';
import {PrrCrisis} from '@shared/types/PrrCrisis.type';

describe('Background Message Listener test ', () => {
  let logger: Logger = new ConsoleLogger();
  let localStorage = new LocalStorageManager();
  const store = TestUtils.buildSettingsState();
  const chromeUtils = new ChromeUtils(logger, localStorage);
  const filterChain = mock<ContentFilterChain>();
  let restService = mock<RESTService>();
  let configurationService = mock<ConfigurationService>();
  let prrReports = mock<PrrReports>();
  let prrTriggerService: PrrTriggerService = mock(PrrTriggerService);
  let prrMonitor: PrrMonitor = new MLPrrMonitor(logger, store, prrTriggerService, localStorage);
  let prrReportManager: PrrReportManager = new PrrReportManager(prrReports);
  let interceptionService: InterceptTimeService = mock<InterceptTimeService>();
  let activityService: ActivityService = new ActivityServiceImpl(
    store,
    logger,
    chromeUtils,
    localStorage,
    restService,
    configurationService,
    prrReportManager,
    interceptionService
  );
  let chromeTabHelper: ChromeTabHelper = new ChromeTabHelper(logger, store);
  let contentFilterManager: FilterManager = new ContentFilterManager(filterChain);
  let userService: UserService = new UserServiceImpl(logger, restService, localStorage);

  let queue: QueueWrapper = mock<QueueWrapper>();
  let predictionRequestHandler: PredictionRequestHandler = new PredictionRequestHandler(logger, store, queue, prrMonitor, chromeUtils);
  let authenticationService: AuthenticationService = new AuthenticationServiceImpl(logger, localStorage, chromeUtils, restService);
  let onBoardingService: OnBoardingService = new OnBoardingServiceImpl(logger, chromeTabHelper, chromeUtils, restService);
  let categoryService: CategoryService = new CategoryServiceImpl(logger, restService);
  let tabVisitManager = mock<InformEventHandler>();
  let prrActionService: PRRActionService = new PRRActionServiceImpl(logger, restService, chromeUtils, chromeTabHelper, tabVisitManager);
  let backgroundMessageListener: BackgroundMessageListener;

  const tab = TestUtils.buildChromeTab(111, 'youtube.com');
  const sender: MessageSender = {tab};

  beforeEach(async () => {
    backgroundMessageListener = new BackgroundMessageListener(
      logger,
      store,
      activityService,
      chromeTabHelper,
      chromeUtils,
      contentFilterManager,
      prrReportManager,
      prrMonitor,
      predictionRequestHandler,
      authenticationService,
      onBoardingService,
      categoryService,
      userService,
      prrActionService,
      tabVisitManager
    );

    jest.spyOn(chromeUtils, 'getSubscriptionStatus').mockResolvedValue(true);
  });

  it('Should handle message LOGIN sent to background', async () => {
    const authenticationServiceSpy = jest.spyOn(authenticationService, 'login').mockResolvedValue(true);
    let request: MessageTypes = {type: EventType.LOGIN, accessCode: '11'};
    await backgroundMessageListener.onMessage(request, sender);
    expect(authenticationServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message ANALYZE_IMAGE sent to background', async () => {
    let response: PredictionResponse = new PredictionResponse(true, 'google.com');
    const predictionRequestHandlerSpy = jest.spyOn(predictionRequestHandler, 'onRequest').mockResolvedValue(response);
    const value = new PredictionRequest('google.com/image.png', 'ANALYZE_IMAGE', 'ML', 'google.com');
    let request: MessageTypes = {type: EventType.ANALYZE_IMAGE, value};
    await backgroundMessageListener.onMessage(request, sender);
    expect(predictionRequestHandlerSpy).toBeCalledTimes(1);
  });

  it('Should handle message ANALYZE_TEXT sent to background', async () => {
    let response: PredictionResponse = new PredictionResponse(true, 'google.com');
    const predictionRequestHandlerSpy = jest.spyOn(predictionRequestHandler, 'onRequest').mockResolvedValue(response);
    const value = new PredictionRequest('google.com/image.png', 'ANALYZE_TEXT', 'NLP', 'google.com');
    let request: MessageTypes = {type: EventType.ANALYZE_TEXT, value};
    await backgroundMessageListener.onMessage(request, sender);
    expect(predictionRequestHandlerSpy).toBeCalledTimes(1);
  });

  it('Should handle message PAGE_VISIT sent to background', async () => {
    const activityServiceSpy = jest.spyOn(activityService, 'savePageVisit').mockImplementation(async (message): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {type: EventType.PAGE_VISIT, title: ''};
    await backgroundMessageListener.onMessage(request, sender);
    expect(activityServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message TITLE_CLICK sent to background', async () => {
    const activityServiceSpy = jest.spyOn(activityService, 'saveTitleClick').mockImplementation(async (message): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {host: '', href: '', title: '', type: EventType.TITLE_CLICK};
    await backgroundMessageListener.onMessage(request, sender);
    expect(activityServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message WEB_SEARCH sent to background', async () => {
    const activityServiceSpy = jest.spyOn(activityService, 'saveWebSearch').mockImplementation(async (message): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {type: EventType.WEB_SEARCH, href: '', title: ''};
    await backgroundMessageListener.onMessage(request, sender);
    expect(activityServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message CLOSE_TAB sent to background', async () => {
    const chromeTabHelperSpy = jest.spyOn(chromeTabHelper, 'close').mockImplementation(async (message): Promise<any | void> => {
      return Promise.resolve();
    });
    const prrMonitorSpy = jest.spyOn(prrMonitor, 'reset').mockImplementation(async (message): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {type: EventType.CLOSE_TAB};
    await backgroundMessageListener.onMessage(request, sender);
    expect(chromeTabHelperSpy).toBeCalledTimes(1);
    expect(prrMonitorSpy).toBeCalledTimes(1);
  });

  it('Should handle message PRR_TRIGGER sent to background', async () => {
    const prrReport: PrrReport = {tabId: 1};
    const prrReportManagerSpy = jest.spyOn(prrReportManager, 'getReport').mockImplementation((tabId: number): PrrReport => {
      return prrReport;
    });
    const activityServiceSpy = jest.spyOn(activityService, 'prrTriggered').mockImplementation(async (tabId: PrrReport): Promise<any> => {
      return Promise.resolve({});
    });
    let request: MessageTypes = {type: EventType.PRR_TRIGGER, keyword: '', data: {}};
    await backgroundMessageListener.onMessage(request, sender);
    expect(prrReportManagerSpy).toBeCalledTimes(1);
    expect(activityServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message REDIRECT sent to background', async () => {
    const chromeTabHelperSpy = jest.spyOn(chromeTabHelper, 'redirect').mockImplementation(async (id: number, config: any): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {type: EventType.REDIRECT, source: '', browser: '', level: PrrLevel.ONE};
    await backgroundMessageListener.onMessage(request, sender);
    expect(chromeTabHelperSpy).toBeCalledTimes(1);
  });

  it('Should handle message REPORT_NOTIFICATION sent to background', async () => {
    const activityServiceSpy = jest.spyOn(activityService, 'sendTeacherMessage').mockImplementation(async (id, message): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {
      type: EventType.REPORT_NOTIFICATION,
      teacherId: '',
      messages: [''],
      category: PrrCategory.UN_KNOWN,
      prrLevelId: PrrLevel.ONE,
    };
    await backgroundMessageListener.onMessage(request, sender);
    expect(activityServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message CHECK_HOST sent to background', async () => {
    const contentFilterManagerSpy = jest.spyOn(contentFilterManager, 'filterUrl').mockImplementation(async (url): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {type: EventType.CHECK_HOST};
    await backgroundMessageListener.onMessage(request, sender);
    expect(contentFilterManagerSpy).toBeCalledTimes(1);
  });

  it('Should handle message LET_US_KNOW sent to background', async () => {
    const activityServiceSpy = jest.spyOn(activityService, 'reportEvent').mockImplementation(async (message: any, id: number): Promise<any | void> => {
      return Promise.resolve();
    });
    const reportFalsePositiveReportSpy = jest
      .spyOn(activityService, 'reportFalsePositiveReport')
      .mockImplementation(async (id: number): Promise<any | void> => {
      });

    let request: MessageTypes = {type: EventType.LET_US_KNOW, browser: ''};
    await backgroundMessageListener.onMessage(request, sender);
    expect(activityServiceSpy).toBeCalledTimes(1);
  });

  //TELL_ME_MORE
  it('Should handle message TELL_ME_MORE sent to background', async () => {
    const activityServiceSpy = jest.spyOn(activityService, 'reportEvent').mockImplementation(async (message: any, id: number): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {type: EventType.TELL_ME_MORE};
    await backgroundMessageListener.onMessage(request, sender);
    expect(activityServiceSpy).toBeCalledTimes(1);
  });
  //TAKE_ME_BACK
  it('Should handle message TAKE_ME_BACK sent to background', async () => {
    const activityServiceSpy = jest.spyOn(activityService, 'reportEvent').mockImplementation(async (message: any, id: number): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {type: EventType.TAKE_ME_BACK};
    await backgroundMessageListener.onMessage(request, sender);
    expect(activityServiceSpy).toBeCalledTimes(1);
  });
  //LIMIT_ACCESS
  it('Should handle message LIMIT_ACCESS sent to background', async () => {
    jest.spyOn(restService, 'doPatch').mockImplementation(async (url: string): Promise<void> => {
      return Promise.resolve();
    });
    let report: PrrReport = {tabId: 1};
    jest.spyOn(prrReportManager, 'getReport').mockReturnValueOnce(report);

    const userAccessServiceSpy = jest.spyOn(userService, 'updateAccess').mockImplementation(async (): Promise<void> => {
      return Promise.resolve();
    });
    const activityServiceSpy = jest.spyOn(activityService, 'prrTriggered').mockImplementation(async (prrReport: PrrReport): Promise<any | void> => {
      return Promise.resolve();
    });

    let request: MessageTypes = {
      category: PrrCategory.ALLOWED,
      host: 'string',
      value: true,
      type: EventType.LIMIT_ACCESS,
    };
    await backgroundMessageListener.onMessage(request, sender);
    expect(userAccessServiceSpy).toBeCalledTimes(1);
  });
  //PING
  it('Should handle message PING sent to background', async () => {
    let request: MessageTypes = {type: EventType.PING};
    const result = await backgroundMessageListener.onMessage(request, sender);
    expect(result).toMatchObject({message: 'success'});
  });

  //ENABLE_EXTENSION
  it('Should handle message NONE sent to background', async () => {
    let request: MessageTypes = {type: EventType.ENABLE_EXTENSION};
    const result = await backgroundMessageListener.onMessage(request, sender);
    expect(result).toBeTruthy();
  });

  //GET_PARENT_LIST
  it('Should handle message GET_PARENT_LIST sent to background', async () => {
    let request: MessageTypes = {type: EventType.GET_PARENT_LIST};
    const getParentsListSpy = jest.spyOn(userService, 'getParentsList').mockImplementation(async (): Promise<any> => {
      return Promise.resolve([{id: 1}]);
    });
    const result = await backgroundMessageListener.onMessage(request, sender);
    expect(result).toBeTruthy();
    expect(getParentsListSpy).toBeCalledTimes(1);
  });

  it('Should handle message GET_ONBOARDING_STATUS sent to background', async () => {
    const response = {
      status: 'DONE',
      step: 6,
    };
    let request: MessageTypes = {type: EventType.GET_ONBOARDING_STATUS};
    const onBoardingServiceSpy = jest.spyOn(onBoardingService, 'getOnboardingStatus').mockImplementation(async (): Promise<any> => {
      return Promise.resolve(response);
    });
    const result = await backgroundMessageListener.onMessage(request, sender);
    expect(result).toMatchObject(response);
    expect(onBoardingServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message SAVE_ONBOARDING_STATUS sent to background', async () => {
    let request: MessageTypes = {
      type: EventType.SAVE_ONBOARDING_STATUS,
      status: 'DONE',
      step: 6,
    };
    let saveRequest = {status: 'DONE', step: 6};

    const onBoardingServiceSpy = jest.spyOn(onBoardingService, 'saveOnboardingStatus').mockImplementation(async (): Promise<any> => {
      return Promise.resolve();
    });
    await backgroundMessageListener.onMessage(request, sender);
    expect(onBoardingServiceSpy).toBeCalledWith(saveRequest);
    expect(onBoardingServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message UPDATE_CATEGORIES sent to background', async () => {
    const category = {
      categoryId: 'string',
      status: 'string',
      timeDuration: 2,
    };
    let request: MessageTypes = {
      type: EventType.UPDATE_CATEGORIES,
      // @ts-ignore
      category,
    };

    const categoryServiceSpy = jest.spyOn(categoryService, 'updateCategories').mockImplementation(async (): Promise<any> => {
      return Promise.resolve();
    });
    await backgroundMessageListener.onMessage(request, sender);
    expect(categoryServiceSpy).toBeCalledWith(category);
    expect(categoryServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message UPDATE_CATEGORIES_TIME sent to background', async () => {
    const categories = [
      {
        categoryId: 'string',
        status: 'string',
        timeDuration: 2,
      },
    ];
    const offtime = '03:10';

    let request: MessageTypes = {
      type: EventType.UPDATE_CATEGORIES_TIME,
      categories,
      offtime,
    };

    const categoryServiceSpy = jest
      .spyOn(categoryService, 'updateCategoriesTime')
      .mockImplementation(async (categories: FilteredCategory[], offTime: string): Promise<any> => {
        return Promise.resolve();
      });
    await backgroundMessageListener.onMessage(request, sender);
    expect(categoryServiceSpy).toBeCalledWith(categories, offtime);
    expect(categoryServiceSpy).toBeCalledTimes(1);
  });

  it('Should handle message PRR_INFORM_AI_ACTION sent to background', async () => {
    let request: MessageTypes = {
      type: EventType.PRR_INFORM_AI_ACTION,
      payload: {url: 'test.com'},
    };

    const prrInformAIActionSpy = jest.spyOn(prrActionService, 'informAIAction').mockImplementation((payload: PrrInform, tabId: number): Promise<any> => {
      return Promise.resolve();
    });
    await backgroundMessageListener.onMessage(request, sender);
    expect(prrInformAIActionSpy).toBeCalledTimes(1);
  });

  it('Should handle message REMOVE_AI_SCREEN sent to background', async () => {
    let request: MessageTypes = {
      type: EventType.PRR_REMOVE_AI_SCREEN,
      payload: {url: 'test.com'},
    };

    const removeAIScreenSpy = jest.spyOn(prrActionService, 'removeAIScreen').mockImplementation((tabId: number): Promise<any> => {
      return Promise.resolve();
    });
    await backgroundMessageListener.onMessage(request, sender);
    expect(removeAIScreenSpy).toBeCalledTimes(1);
  });

  it('Should handle message PRR_INFORM_ACTION sent to background', async () => {
    const payload = {
      url: 'facebook.com',
      categoryId: PrrCategory.SOCIAL_MEDIA_CHAT,
      ai: false,
    };
    const id = 111;

    let request: MessageTypes = {
      type: EventType.PRR_INFORM_ACTION,
      payload,
    };

    const informActionSpy = jest
      .spyOn(prrActionService, 'informAction')
      .mockImplementation(async (informPayload: PrrInform, tabId: number): Promise<any> => {
        return Promise.resolve();
      });
    await backgroundMessageListener.onMessage(request, sender);
    expect(informActionSpy).toBeCalledWith(payload, id);
    expect(informActionSpy).toBeCalledTimes(1);
  });

  it('Should handle message PRR_ASK_ACTION sent to background', async () => {
    const payload = {
      url: 'facebook.com',
      categoryId: PrrCategory.SOCIAL_MEDIA_CHAT,
      ai: false,
    };

    let request: MessageTypes = {
      type: EventType.PRR_ASK_ACTION,
      payload,
    };

    const askActionSpy = jest.spyOn(prrActionService, 'askAction').mockImplementation(async (askPayload: PrrAsk): Promise<any> => {
      return Promise.resolve();
    });
    await backgroundMessageListener.onMessage(request, sender);
    expect(askActionSpy).toBeCalledWith(payload);
    expect(askActionSpy).toBeCalledTimes(1);
  });

  it('Should handle message PRR_CRISIS_ACTION sent to background', async () => {
    const payload: PrrCrisis = {
      url: 'guns.com',
      categoryId: PrrCategory.WEAPONS,
      ai: false,
      choseToContinue: true,
    };

    let request: MessageTypes = {
      type: EventType.PRR_CRISIS_ACTION,
      payload,
    };

    const askActionSpy = jest.spyOn(prrActionService, 'crisisAction').mockImplementation(async (crisisPayload: PrrCrisis): Promise<any> => {
      return Promise.resolve();
    });
    await backgroundMessageListener.onMessage(request, sender);
    expect(askActionSpy).toBeCalledWith(payload, sender.tab?.id);
    expect(askActionSpy).toBeCalledTimes(1);
  });

  it('Should fail the request and handle gracefully.', async () => {
    // @ts-ignore
    tab.id = undefined;
    const sender: MessageSender = {tab};

    let request: MessageTypes = {
      type: EventType.CLOSE_TAB,
    };

    const result = await backgroundMessageListener.onMessage(request, sender).catch((e) => {
    });

    expect(result).toBeFalsy();
  });
});
