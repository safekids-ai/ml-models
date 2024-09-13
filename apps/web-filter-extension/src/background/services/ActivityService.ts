import {NLPWeb} from '@safekids-ai/nlp-js-web';
import {VisionWeb} from '@safekids-ai/vision-js-web';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {Logger} from '@shared/logging/ConsoleLogger';
import {RESTService} from '@shared/rest/RestService';
import {ActiveWebUsageDto} from '@shared/types/ActiveWebUsage.type';
import {EventType, MessageTypes, PrrTrigger} from '@shared/types/message_types';
import {PrrLevel} from '@shared/types/PrrLevel';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {WebUsageTypeDto} from '@shared/types/WebUsage.type';
import {PrrReport} from '../prr/monitor/PrrMonitor';
import {PrrReportManager} from '../prr/PrrReportManager';

import {ConfigurationService} from './ConfigurationService';
import {SAVE_ACTIVITY, SAVE_CHROME_USAGE, SAVE_FEEDBACK, SAVE_VISITS} from './endpoints';
import {InterceptTimeService} from './InterceptTimeService';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {PrrCategory} from '@shared/types/PrrCategory';
import {HttpUtils} from '@shared/utils/HttpUtils';
import {TabVisit} from '../event/handler/InformEventHandler';

export type ActivityService = {
  reportFalsePositiveReport: (tabId: number | any) => Promise<any | void>;
  reportEvent: (message: any, tabId: number) => Promise<any | void>;
  prrTriggered: (data: PrrReport) => Promise<any | void>;
  savePageVisit: (message: any) => Promise<any | void>;
  saveTitleClick: (message: any) => Promise<any | void>;
  sendTeacherMessage: (tabId: number, message: any) => Promise<any | void>;
  saveWebSearch: (webURL: string) => Promise<any | void>;
  saveAlertEvent: () => Promise<any | void>;
  saveActivity: (webUsage: WebUsageTypeDto, endPoint?: string) => Promise<any | void>;
  saveActiveWebUsageTime: (webUsageActiveTab: ActiveWebUsageDto) => Promise<any | void>;
  saveEvents(eventId: string, events: TabVisit[] | undefined): Promise<any | void>;
};

export class ActivityServiceImpl implements ActivityService {
  constructor(
    private readonly store: ReduxStorage,
    private readonly logger: Logger,
    private readonly chromeUtils: ChromeUtils,
    private readonly localStorageManager: LocalStorageManager,
    private readonly restService: RESTService,
    private readonly configurationsService: ConfigurationService,
    private readonly prrReportManager: PrrReportManager,
    private readonly interceptionTimeService: InterceptTimeService
  ) {
  }

  async reportFalsePositiveReport(tabId: number): Promise<void> {
    try {
      const report = this.prrReportManager.getReport(tabId);
      const userDeviceLinkId = await this.localStorageManager.get('userDeviceLinkId');
      const payload = {
        userDeviceLinkId,
        type: 'false-positive',
        webUrl: report?.url,
        fullWebUrl: report?.fullWebUrl,
        prrTrigger: report?.prrTriggerId ? report?.prrTriggerId : 'AI-VISION',
        prrCategory: report?.category,
        prrImages: report?.images,
        prrTexts: report?.texts,
      };

      this.logger.log(`Reporting False Positive: ${JSON.stringify(payload)}`);
      this.restService.doPost(SAVE_FEEDBACK, payload);
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(`Error occurred on reporting false positive: ${error}`);
    }
  }

  async reportEvent(message: MessageTypes, tabId: number): Promise<any> {
    const prrReport = this.prrReportManager.getReport(tabId);
    this.logger.debug(`prrReport ${prrReport ? JSON.stringify(prrReport) : prrReport}`);

    const webUsageDto: WebUsageTypeDto = {
      webActivityTypeId: EventType.PRR_TRIGGER,
      webUrl: message.host,
      fullWebUrl: prrReport?.fullWebUrl ? prrReport?.fullWebUrl : message.host,
      prrLevelId: message.prrLevelId,
      prrTriggerId: prrReport?.prrTriggerId ? prrReport?.prrTriggerId : PrrTrigger.AI_NLP_VISION,
      prrActivityTypeId: message.type,
      prrCategoryId: message.category === PrrCategory.ACCESS_LIMITED ? undefined : message.category,
      prrImages: prrReport?.images,
      prrTexts: prrReport?.texts,
      webCategoryId: message.category,
    };
    this.logger.debug(`Saving ${webUsageDto.prrActivityTypeId} event... , ${JSON.stringify(webUsageDto)}`);

    this.callSaveActivity(webUsageDto);
  }

  async prrTriggered(prrReport: PrrReport): Promise<void> {
    this.logger.debug(`PRR triggered:  ${JSON.stringify({prrReport})}`);

    const webUsageDto: WebUsageTypeDto = {
      prrActivityTypeId: EventType.PRR_TRIGGER,
      webUrl: prrReport.url,
      webTitle: prrReport.title,
      fullWebUrl: prrReport.fullWebUrl,
      prrLevelId: prrReport.level,
      prrTriggerId: prrReport.prrTriggerId,
      prrCategoryId: prrReport.category,
      prrImages: prrReport?.images,
      prrTexts: prrReport?.texts,
      teacherId: prrReport.teacherId,
      webActivityTypeId: EventType.PRR_TRIGGER,
      webCategoryId: prrReport.category,
      accessLimited: prrReport?.accessLimited,
      eventId: prrReport?.eventId,
      isAIGenerated: prrReport?.isAiGenerated,
    };
    this.logger.debug(`PRR triggered0:  ${JSON.stringify({webUsageDto})}`);
    this.saveActivity(webUsageDto, SAVE_ACTIVITY).catch((e) => {
    });
  }

  async savePageVisit(message: any): Promise<void> {
    const webUsageDto: WebUsageTypeDto = {
      webCategoryId: !message.category ? 'PERMISSIBLE' : message.category,
      webActivityTypeId: EventType.PAGE_VISIT,
      webUrl: '',
      webTitle: '',
      fullWebUrl: '',
      accessLimited: false,
    };

    this.callSaveActivity(webUsageDto);
  }

  async saveTitleClick(message: any): Promise<void> {
    const webUsageDto: WebUsageTypeDto = {
      webCategoryId: PrrCategory.ALLOWED,
      webActivityTypeId: EventType.TITLE_CLICK,
      webUrl: message.webUrl,
      webTitle: message.webTitle,
      fullWebUrl: message.fullWebUrl,
      accessLimited: false,
    };

    this.callSaveActivity(webUsageDto);
  }

  async sendTeacherMessage(tabId: number, message: any): Promise<void> {
    const prrReport = this.prrReportManager.getReport(tabId);
    const webUsageDto: WebUsageTypeDto = {
      prrActivityTypeId: EventType.MESSAGE_TEACHER,
      webActivityTypeId: EventType.PRR_TRIGGER,
      webUrl: prrReport?.url,
      fullWebUrl: prrReport?.fullWebUrl,
      prrMessages: message.messages,
      prrLevelId: message.prrLevelId,
      prrTriggerId: prrReport?.prrTriggerId ? prrReport?.prrTriggerId : PrrTrigger.AI_NLP_VISION,
      prrCategoryId: message.category === PrrCategory.ACCESS_LIMITED ? null : message.category,
      webCategoryId: message.category,
      accessLimited: true,
    };

    if (message.teacherId) {
      webUsageDto.teacherId = message.teacherId;
    }

    this.callSaveActivity(webUsageDto);
  }

  async saveWebSearch(webURL: string): Promise<void> {
    const url = new URL(webURL);
    const params = url.searchParams;
    let keyword = params.get('q') == null ? (params.get('p') == null ? params.get('pw') : params.get('p')) : params.get('q');
    if (!keyword && params.get('k') != null) {
      keyword = params.get('k');
    } else if (!keyword && params.get('keyword') != null) {
      keyword = params.get('keyword');
    }
    if (keyword || !!params) {
      const webUsageDto: WebUsageTypeDto = {
        webCategoryId: PrrCategory.ALLOWED,
        webActivityTypeId: EventType.WEB_SEARCH,
        webUrl: '',
        fullWebUrl: '',
        webTitle: keyword ?? '',
        accessLimited: false,
      };

      this.callSaveActivity(webUsageDto);
    }
  }

  /** Save Alert Event when chrome extension is updated
   * @returns void
   */
  async saveAlertEvent(): Promise<void> {
    const webUsage = {
      userDeviceLinkId: await this.localStorageManager.get('userDeviceLinkId'),
      alertType: 'Extension-Updated',
    } as WebUsageTypeDto;

    this.logger.log(`Saving ${webUsage.alertType} notification... , ${JSON.stringify(webUsage)}`);

    this.callSaveActivity(webUsage);
  }

  async saveActivity(webUsage: WebUsageTypeDto, endPoint?: string): Promise<void> {
    try {
      if (Array.isArray(webUsage.prrImages) && webUsage.prrImages.length == 0) {
        delete webUsage.prrImages;
      }
      if (Array.isArray(webUsage.prrTexts) && webUsage.prrTexts.length == 0) {
        delete webUsage.prrTexts;
      }
      const browserInfo = HttpUtils.getBrowserInfo().split(' ');
      webUsage.userDeviceLinkId = await this.localStorageManager.get('userDeviceLinkId');
      webUsage.mlVersion = VisionWeb.version;
      webUsage.nlpVersion = NLPWeb.version;
      webUsage.extensionVersion = this.chromeUtils.getManifest().version;
      webUsage.browser = browserInfo[0];
      webUsage.browserVersion = browserInfo[1];

      const offTimes = await this.interceptionTimeService.getOffTimes(new Date());

      webUsage.isOffDay = offTimes.isOffDay;
      webUsage.isOffTime = offTimes.isOffTime;
      webUsage.activityTime = new Date();
      const url = endPoint ?? SAVE_ACTIVITY;

      const result = await this.restService.doPost(url, webUsage);

      this.logger.log(`result: SAVE_ACTIVITY -> ${JSON.stringify(result)}`);
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(`An error occurred while saving Activity: ${error}`);
    }
  }

  async saveActiveWebUsageTime(webUsageActiveTab: ActiveWebUsageDto): Promise<void> {
    try {
      webUsageActiveTab.userDeviceLinkId = await this.localStorageManager.get('userDeviceLinkId');
      webUsageActiveTab.mlVersion = VisionWeb.version;
      webUsageActiveTab.nlpVersion = NLPWeb.version;
      webUsageActiveTab.extensionVersion = this.chromeUtils.getManifest().version;
      webUsageActiveTab.browserVersion = HttpUtils.getBrowserInfo().split(' ')[1];
      webUsageActiveTab.browser = HttpUtils.getBrowserInfo().split(' ')[0];

      const result = await this.restService.doPost(SAVE_CHROME_USAGE, webUsageActiveTab);
      this.logger.log(`result: SAVE_CHROME_USAGE -> ${JSON.stringify(result)}`);
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(`An error occurred while saving chrome usage ${error}`);
    }
  }

  /* istanbul ignore next */
  callSaveActivity = async (webUsageDto: WebUsageTypeDto): Promise<void> => {
    this.saveActivity(webUsageDto).catch((e) => {
      /* istanbul ignore next */
      this.logger.error(`Failed to save activity. ${e}`);
    });
  };

  async saveEvents(eventId: string, visits: TabVisit[] | undefined): Promise<void> {
    visits?.map((visit) => {
      visit.time = new Date(visit.timestamp);
      return visit;
    });
    const visitRequest = {visits, eventId};
    this.restService
      .doPost(SAVE_VISITS, visitRequest)
      .then((result) => {
        this.logger.log(`Saved visits successfully.`, result);
      })
      .catch((e) => {
        this.logger.error(`error occurred while saving visits.`, JSON.stringify(e));
      });
  }
}
