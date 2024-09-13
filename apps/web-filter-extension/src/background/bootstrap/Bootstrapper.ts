import 'reflect-metadata';
import {ChromeHelperFactory} from '@shared/chrome/factory/ChromeHelperFactory';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {Logger} from '@shared/logging/ConsoleLogger';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {BeanFactory, BeanNames} from '../factory/BeanFactory';
import {FilterManager} from '../filter/ContentFilterManager';
import {AiModelsInitializer} from '../initializer/AiModelsInitializer';
import {AlarmInitializer} from '../initializer/AlarmInitializer';
import {EventHandlerInitializer} from '../initializer/EventHandlerInitializer';
import {FilterInitializer} from '../initializer/FilterInitializer';
import {Initializer} from '../initializer/Initializer';
import {MessageListenerInitializer} from '../initializer/MessageListenerInitializer';
import {BackgroundMessageListener, MessageListener} from '../listener/message/BackgroundMessageListener';
import {PredictionRequestHandler} from '../listener/message/handler/PredictionRequestHandler';
import {QueueWrapper as Queue} from '@shared/queue/QueueWrapper';
import {QueueManager} from '../model/QueueManager';
import {PrrMonitor} from '../prr/monitor/PrrMonitor';
import {PrrReportManager} from '../prr/PrrReportManager';
import {ActivityService} from '../services/ActivityService';
import {AuthenticationService} from '../services/AuthenticationService';
import {CategoryService} from '../services/CategoryService';
import {ConfigurationService} from '../services/ConfigurationService';
import {OnBoardingService} from '../services/OnBoardingService';
import {PRRActionService} from '../services/PRRActionService';
import {UserService} from '../services/UserService';
import {InformEventHandler} from '../event/handler/InformEventHandler';
import {Bootstrapper} from "@shared/BootstrapperInterface";
import {Tabs} from "jest-chrome/types/jest-chrome";

/**
 * //TODO: have to cleanup dependencies and use of them 09/02/2022
 * This class contains methods to bootstrap extension service worker
 */
export class BackgroundBootstrapper implements Bootstrapper {
  constructor(
    private readonly logger: Logger,
    private readonly beanFactory: BeanFactory,
    private readonly store: ReduxStorage,
    private readonly localStorageManager: LocalStorageManager
  ) {
  }

  init = async (): Promise<void> => {
    if (this.store == null || this.beanFactory == null) {
      throw new Error('Failed initialize Bootstrapper.');
    }
    // check login status
    const configurationService = this.beanFactory.getBean(BeanNames.CONFIGURATION_SERVICE) as ConfigurationService;
    const chromeHelperFactory = this.beanFactory.getBean(BeanNames.CHROME_HELPERS_FACTORY) as ChromeHelperFactory;
    const loginData = await chromeHelperFactory.getChromeUtils().getUserCredentials();

    // initialize Url and content filters
    await this.initializeFilters();

    if (loginData.accessCode !== '') {
      // initialized AI Models and creates queue
      const queue: Queue = await this.initializeAiModels();

      // register EventHandlers
      await this.initializeMessageListener(queue);

      // register Listeners
      await this.initializeEventHandler(queue);

      // register Alarms
      await this.initializeAlarms();

      // extension configuration & api call
      await configurationService.setDefaultExtensionConfiguration(loginData.accessCode);
      await configurationService.getChromeExtensionConfiguration();
    } else {
      // dummy queue create as user has not login yet
      const queue: any = [];
      // register EventHandlers
      await this.initializeMessageListener(queue);
      // start on-boarding
      const onBoardingService: OnBoardingService = this.beanFactory.getBean(BeanNames.ONBOARDING_SERVICE) as OnBoardingService;
      await onBoardingService.onBoard();
    }
  };

  /**
   * initializes event handler for Chrome tab events.
   * @param queue
   */
  initializeEventHandler = async (queue: Queue): Promise<boolean> => {
    const urlPrrMonitor: PrrMonitor = this.beanFactory.getBean(BeanNames.URL_PRR_OBSERVER) as PrrMonitor;
    const mlPrrMonitor: PrrMonitor = this.beanFactory.getBean(BeanNames.ML_PRR_OBSERVER) as PrrMonitor;
    const chromeHelperFactory: ChromeHelperFactory = this.beanFactory.getBean(BeanNames.CHROME_HELPERS_FACTORY) as ChromeHelperFactory;
    const filterManager: FilterManager = this.beanFactory.getBean(BeanNames.URL_FILTER_MANAGER) as FilterManager;
    const prrReportManager: PrrReportManager = this.beanFactory.getBean(BeanNames.PRR_REPORT_MANAGER) as PrrReportManager;
    const tabVisitManager = this.beanFactory.getBean(BeanNames.TAB_VISIT_MANAGER) as InformEventHandler;
    const userService: UserService = this.beanFactory.getBean(BeanNames.USER_SERVICE) as UserService;

    const eventHandlerInitializer: Initializer = new EventHandlerInitializer(
      this.store,
      this.logger,
      queue,
      filterManager,
      prrReportManager,
      urlPrrMonitor,
      mlPrrMonitor,
      chromeHelperFactory,
      tabVisitManager,
      userService
    );
    let initialized = false;
    try {
      initialized = await eventHandlerInitializer.init();
    } catch (e) {
      this.logger.error(`eventHandlerInitializer - Failed to initialize : ${e}.`);
    }

    this.logger.debug(`Event handler initialized: ${initialized}.`);

    return initialized;
  };

  /**
   * initializes filters
   * @private
   */
  async initializeFilters(): Promise<boolean> {
    const initializer = new FilterInitializer(this.logger, this.store, this.localStorageManager, this.beanFactory);
    let initialized = false;
    try {
      initialized = await initializer.init();
    } catch (e) {
      this.logger.error(`initializeFilters - Failed to initialize : ${e}.`);
    }
    this.logger.debug(`Url Filters initialized : ${initialized}.`);
    return initialized;
  }

  async initializeMessageListener(queue: Queue): Promise<boolean> {
    const activityService = this.beanFactory.getBean(BeanNames.ACTIVITY_SERVICE) as ActivityService;
    const chromeHelperFactory = this.beanFactory.getBean(BeanNames.CHROME_HELPERS_FACTORY) as ChromeHelperFactory;
    const filterManager = this.beanFactory.getBean(BeanNames.URL_FILTER_MANAGER) as FilterManager;
    const prrReportManager = this.beanFactory.getBean(BeanNames.PRR_REPORT_MANAGER) as PrrReportManager;
    const authenticationService = this.beanFactory.getBean(BeanNames.AUTHENTICATION_SERVICE) as AuthenticationService;
    const onBoardingService = this.beanFactory.getBean(BeanNames.ONBOARDING_SERVICE) as OnBoardingService;
    const categoryService = this.beanFactory.getBean(BeanNames.CATEGORY_SERVICE) as CategoryService;
    const userService = this.beanFactory.getBean(BeanNames.USER_SERVICE) as UserService;
    const prrMonitor = this.beanFactory.getBean(BeanNames.ML_PRR_OBSERVER) as PrrMonitor;
    const predictionMessageHandler = new PredictionRequestHandler(this.logger, this.store, queue, prrMonitor, chromeHelperFactory.getChromeUtils());
    const prrActionService = this.beanFactory.getBean(BeanNames.PRR_SERVICE) as PRRActionService;
    const tabVisitManager = this.beanFactory.getBean(BeanNames.TAB_VISIT_MANAGER) as InformEventHandler;
    // TODO: User BeanFactory or DI
    const backgroundMessageListener: MessageListener = new BackgroundMessageListener(
      this.logger,
      this.store,
      activityService,
      chromeHelperFactory.getTabHelper(),
      chromeHelperFactory.getChromeUtils(),
      filterManager,
      prrReportManager,
      prrMonitor,
      predictionMessageHandler,
      authenticationService,
      onBoardingService,
      categoryService,
      userService,
      prrActionService,
      tabVisitManager
    );

    const initializer = new MessageListenerInitializer(this.logger, backgroundMessageListener);

    let initialized = false;
    try {
      initialized = await initializer.init();
    } catch (e) {
      this.logger.error(`initializeMessageListener - Failed to initialize : ${e}.`);
    }
    this.logger.debug(`Message Listeners initialized : ${initialized}.`);
    return initialized;
  }

  initializeAlarms = async (): Promise<boolean> => {
    const chromeHelperFactory = this.beanFactory.getBean(BeanNames.CHROME_HELPERS_FACTORY) as ChromeHelperFactory;
    const configurationService = this.beanFactory.getBean(BeanNames.CONFIGURATION_SERVICE) as ConfigurationService;
    const tabVisitManager = this.beanFactory.getBean(BeanNames.TAB_VISIT_MANAGER) as InformEventHandler;
    const initializer = new AlarmInitializer(this.logger, this.store, configurationService, chromeHelperFactory, tabVisitManager);
    let initialized = false;
    try {
      initialized = await initializer.init();
    } catch (e) {
      this.logger.error(`initializeAlarms - Failed to initialize : ${e}.`);
    }
    this.logger.debug(`Alarms initialized : ${initialized}.`);
    return initialized;
  };

  /**
   * initialized AI Models and creates queue
   */
  async initializeAiModels(): Promise<Queue> {
    const queueManager = new QueueManager(this.logger, this.store, this.beanFactory);

    const aiInitializer = new AiModelsInitializer(queueManager);
    return await aiInitializer.init();
  }
}
