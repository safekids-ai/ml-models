import {LRUCache} from '@src/shared/cache/LRUCache';
import {ChromeHelperFactory} from '@src/shared/chrome/factory/ChromeHelperFactory';
import {ChromeStorageManager} from '@src/shared/chrome/storage/ChromeStorageManager';
import {Logger} from '@src/shared/logging/ConsoleLogger';
import {FetchApiService, RESTService} from '@src/shared/rest/RestService';
import {MLModel} from '@src/shared/types/MLModel.type';
import {MLModels} from '@src/shared/types/MLModels';
import {ReduxStorage} from '@src/shared/types/ReduxedStorage.type';
import {ZveloConfig} from '@src/shared/zvelo/domain/zvelo.config';
import {LocalZveloCategoriesService} from '@src/shared/zvelo/service/impl/LocalZveloCategoriesService';
import {RESTZveloCategoriesService} from '@src/shared/zvelo/service/impl/RESTZveloCategoriesService';
import {ZveloUrlCategoriesService} from '@src/shared/zvelo/service/impl/ZveloUrlCategoriesService';
import {UrlCategoryService} from '@src/shared/zvelo/service/UrlCategoryService';
import {ContentFilterUtil} from "@src/shared/utils/content-filter/ContentFilterUtil"
import {FilterManager} from '@src/pages/background/filter/ContentFilterManager';
import {MLPrrMonitor} from '@src/pages/background/prr/monitor/MLPrrMonitor';
import {PrrMonitor, UrlPrrMonitor} from '@src/pages/background/prr/monitor/PrrMonitor';
import {PrrLevelChecker, PrrLevelCheckerImpl} from '@src/pages/background/prr/PrrLevelChecker';
import {PrrReportManager} from '@src/pages/background/prr/PrrReportManager';
import {PrrTriggerService, TriggerService} from '@src/pages/background/prr/PrrTriggerService';
import {ActivityService, ActivityServiceImpl} from '@src/pages/background/services/ActivityService';
import {AuthenticationService, AuthenticationServiceImpl} from '@src/pages/background/services/AuthenticationService';
import {CategoryService, CategoryServiceImpl} from '@src/pages/background/services/CategoryService';
import {ConfigurationService, ConfigurationServiceImpl} from '@src/pages/background/services/ConfigurationService';
import {InterceptTimeService} from '@src/pages/background/services/InterceptTimeService';
import {OnBoardingService, OnBoardingServiceImpl} from '@src/pages/background/services/OnBoardingService';
import {PRRActionService, PRRActionServiceImpl} from '@src/pages/background/services/PRRActionService';
import {UserService, UserServiceImpl} from '@src/pages/background/services/UserService';
import {InformEventHandler} from '@src/pages/background/event/handler/InformEventHandler';
import {PrrReports} from "@src/shared/prr/PrrReports";

/**
 * This class initializes dependencies
 * //TODO: will replace with DI
 */
export class BeanFactory {
  private readonly LRU_CACHE_MAX = 200;
  private readonly zveloApiUrl = process.env.ZVELO_API;
  private readonly zveloApiKey = process.env.ZVELO_API_KEY;
  private readonly beanMap = new Map<BeanNames, Beans>();

  // List of dependencies
  private readonly onBoardingService: OnBoardingService;
  private readonly restService: RESTService;
  private readonly authenticationService: AuthenticationService;

  private readonly chromeHelperFactory: ChromeHelperFactory;
  private readonly urlCategoryService: UrlCategoryService;

  constructor(private readonly store: ReduxStorage, private readonly storageManager: ChromeStorageManager, private readonly logger: Logger) {
    this.chromeHelperFactory = new ChromeHelperFactory(this.logger, storageManager, this.store);
    this.beanMap.set(BeanNames.CHROME_HELPERS_FACTORY, this.chromeHelperFactory);

    this.restService = new FetchApiService(this.chromeHelperFactory.getChromeUtils());
    this.beanMap.set(BeanNames.REST_SERVICE, this.restService);

    this.authenticationService = new AuthenticationServiceImpl(
      this.logger,
      this.storageManager,
      this.chromeHelperFactory.getChromeUtils(),
      this.restService
    );
    this.beanMap.set(BeanNames.AUTHENTICATION_SERVICE, this.authenticationService);

    this.onBoardingService = new OnBoardingServiceImpl(
      this.logger,
      this.chromeHelperFactory.getTabHelper(),
      this.chromeHelperFactory.getChromeUtils(),
      this.restService
    );
    this.beanMap.set(BeanNames.ONBOARDING_SERVICE, this.onBoardingService);

    const lruCache = new LRUCache<string, number[]>(this.LRU_CACHE_MAX);
    const localUrlCategoryService = new LocalZveloCategoriesService(this.logger);
    const restZveloCategoriesService = new RESTZveloCategoriesService(lruCache, this.logger);

    this.urlCategoryService = new ZveloUrlCategoriesService(localUrlCategoryService, restZveloCategoriesService);
    this.beanMap.set(BeanNames.URL_CATEGORY_SERVICE, this.urlCategoryService);
  }

  async init(): Promise<void> {
    const userService = new UserServiceImpl(this.logger, this.restService, this.storageManager);
    this.beanMap.set(BeanNames.USER_SERVICE, userService);

    const configurationService = new ConfigurationServiceImpl(this.store, this.logger, this.restService, this.storageManager, userService);
    this.beanMap.set(BeanNames.CONFIGURATION_SERVICE, configurationService);

    const prrReports = new PrrReports();
    const prrReportManager = new PrrReportManager(prrReports);
    this.beanMap.set(BeanNames.PRR_REPORT_MANAGER, prrReportManager);

    const interceptionService = new InterceptTimeService(this.logger, this.store);

    const activityService = new ActivityServiceImpl(
        this.store,
        this.logger,
        this.chromeHelperFactory.getChromeUtils(),
        this.storageManager,
        this.restService,
        configurationService,
        prrReportManager,
        interceptionService
    );
    this.beanMap.set(BeanNames.ACTIVITY_SERVICE, activityService);

    const categoryService = new CategoryServiceImpl(this.logger, this.restService);
    this.beanMap.set(BeanNames.CATEGORY_SERVICE, categoryService);

    const tabVisitManager = new InformEventHandler(this.logger, this.store, this.storageManager, activityService);
    this.beanMap.set(BeanNames.TAB_VISIT_MANAGER, tabVisitManager);

    const prrActionService = new PRRActionServiceImpl(
        this.logger,
        this.restService,
        this.chromeHelperFactory.getChromeUtils(),
        this.chromeHelperFactory.getTabHelper(),
        tabVisitManager
    );
    this.beanMap.set(BeanNames.PRR_SERVICE, prrActionService);

    const prrLevelChecker = new PrrLevelCheckerImpl(this.store, this.logger, this.storageManager);
    this.beanMap.set(BeanNames.PRR_LEVEL_CHECKER, prrLevelChecker);

    const prrTriggerService = new PrrTriggerService(
        this.logger,
        this.chromeHelperFactory.getTabHelper(),
        this.chromeHelperFactory.getChromeUtils(),
        prrReportManager,
        activityService,
        prrLevelChecker
    );

    this.beanMap.set(BeanNames.PRR_TRIGGER_SERVICE, prrTriggerService);

    const mlPrrObserver = new MLPrrMonitor(this.logger, this.store, prrTriggerService, this.storageManager);
    this.beanMap.set(BeanNames.ML_PRR_OBSERVER, mlPrrObserver);

    const urlPrrObserver = new UrlPrrMonitor(prrTriggerService);
    this.beanMap.set(BeanNames.URL_PRR_OBSERVER, urlPrrObserver);

    const contentFilterUtils = new ContentFilterUtil(this.store, this.logger);
    this.beanMap.set(BeanNames.CONTENT_FILTER_UTILS, contentFilterUtils);

    const zveloConfig: ZveloConfig = {
        url: this.zveloApiUrl != null ? this.zveloApiUrl : '',
        key: this.zveloApiKey != null ? this.zveloApiKey : '',
    };
    await this.urlCategoryService.initialize(zveloConfig);
  };

  getBean = (name: BeanNames): Beans => {
    const v = this.beanMap.get(name);
    if (v === undefined) {
      throw new Error(`Bean not found: ${name}`);
    }
    return v;
  };

  removeBean = (name: BeanNames): boolean => {
    return this.beanMap.delete(name);
  };

  addBean(name: BeanNames, bean: Beans): void {
    this.beanMap.set(name, bean);
  }
}

export enum BeanNames {
  ACTIVITY_SERVICE,
  REST_SERVICE,
  ONBOARDING_SERVICE,
  CATEGORY_SERVICE,
  PRR_SERVICE,
  AUTHENTICATION_SERVICE,
  URL_CATEGORY_SERVICE,
  CONFIGURATION_SERVICE,
  ML_PRR_OBSERVER,
  URL_PRR_OBSERVER,
  PRR_TRIGGER_SERVICE,
  PRR_LEVEL_CHECKER,
  PRR_REPORT_MANAGER,
  URL_FILTER_MANAGER,
  CHROME_HELPERS_FACTORY,
  USER_SERVICE,
  CONTENT_FILTER_UTILS,
  AI_MODELS,
  TAB_VISIT_MANAGER,
}

export type AIModels = Map<MLModels, MLModel>;

export type Beans =
  | ActivityService
  | RESTService
  | OnBoardingService
  | CategoryService
  | PRRActionService
  | AuthenticationService
  | UrlCategoryService
  | ConfigurationService
  | PrrMonitor
  | TriggerService
  | PrrLevelChecker
  | PrrReportManager
  | FilterManager
  | ChromeHelperFactory
  | UserService
  | ContentFilterUtil
  | InformEventHandler
  | AIModels;
