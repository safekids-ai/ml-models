import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {Logger} from '@shared/logging/ConsoleLogger';
import {PrrTrigger} from '@shared/types/message_types';
import {MLModels} from '@shared/types/MLModels';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {ThresholdManagerFactory} from '../PrrThresholdManager';
import {TriggerService} from '../PrrTriggerService';

import {PrrMonitor, PrrReport} from './PrrMonitor';

export class MLPrrMonitor implements PrrMonitor {
  private readonly tabPrrReports: Map<number, Map<string, any>>;

  constructor(
    private readonly logger: Logger,
    private readonly store: ReduxStorage,
    private readonly pprTriggerService: TriggerService,
    private readonly localStorage: LocalStorageManager
  ) {
    this.tabPrrReports = new Map<number, Map<string, any>>();
  }

  report = async (receivedReport: PrrReport): Promise<void> => {
    let prrCategoryReport: Map<string, any> | undefined = this.tabPrrReports.get(receivedReport.tabId);

    if (prrCategoryReport == null) {
      prrCategoryReport = new Map();
    }
    this.logger.log(`receivedReport.category -------------> ${receivedReport.category}`);

    let prrReport = prrCategoryReport.get(receivedReport.category ?? '');
    if (!prrReport) {
      prrReport = {images: [], texts: []};
    }

    if (receivedReport.model === MLModels.VISION) {
      prrReport.images?.push(receivedReport.data);
    } else if (receivedReport.model === MLModels.NLP) {
      prrReport.texts?.push(receivedReport.data);
    }

    const {images, texts} = prrReport;
    const ml = images?.length;
    const nlp = texts?.length;
    this.logger.log(`Current Report for host[${receivedReport.url}][${receivedReport.category}] --> ML[${ml}],NLP[${nlp}]`);
    // TODO: change classes names
    const categoryInstance = ThresholdManagerFactory.getManager(receivedReport.category ? receivedReport.category : '', this.store);

    const shouldTriggerPRR = categoryInstance.shouldTrigger(ml, nlp);
    // TODO: fix this .. categories should be uniform
    const prrCategory =
      receivedReport.category?.toUpperCase() === 'PORN'
        ? PrrCategory.ADULT_SEXUAL_CONTENT
        : receivedReport.category?.toUpperCase() === 'PROXY'
          ? PrrCategory.INAPPROPRIATE_FOR_MINORS
          : receivedReport.category;
    /* //TODO: fix this
    if(receivedReport.category?.toUpperCase() === "SELF_HARM") {
        prrCategory = 'SELF_HARM_SUICIDAL_CONTENT';
    }
    if(receivedReport.category === PrrCategory.SELF_HARM){
        receivedReport.category = PrrCategory.SELF_HARM_SUICIDAL_CONTENT;
    } */

    // TODO: fix this
    // const filterResult = categoryFilter.filter({categor: prrCategory})
    // if (filterResult.status === INTERCEPT/ALLOW)
    let level: PrrLevel = PrrLevel.ZERO;
    // level = filterResult.level;
    if (receivedReport.category === PrrCategory.WEAPONS || receivedReport.category === PrrCategory.SELF_HARM_SUICIDAL_CONTENT) {
      level = PrrLevel.THREE;
    } else {
      level = PrrLevel.ONE;
    }
    if (shouldTriggerPRR) {
      const aiSource = ml && nlp ? PrrTrigger.AI_NLP_VISION : ml ? PrrTrigger.AI_VISION : PrrTrigger.AI_NLP;

      const urlObj = new URL(receivedReport.url ? receivedReport.url : '');
      const host = urlObj.host;
      this.logger.log(
        `ML[${ml}], NLP[${nlp}] for tab[${receivedReport.tabId}], host[${receivedReport.url}], category[${receivedReport.category},trigger[${aiSource}]]`
      );
      const newReport: PrrReport = {
        fullWebUrl: receivedReport.fullWebUrl,
        category: prrCategory,
        tabId: receivedReport.tabId,
        prrTriggerId: aiSource,
        url: host,
        prrTriggered: true,
        images,
        texts,
        level,
        isAiGenerated: true,
        status: 'block',
      };

      await this.pprTriggerService.trigger(newReport);
      this.logger.log(`Report for Prr is: ${JSON.stringify(newReport)}`);
    } else {
      prrCategoryReport.set(receivedReport.category ? receivedReport.category : PrrCategory.UN_KNOWN, prrReport);
      this.tabPrrReports.set(receivedReport.tabId, prrCategoryReport);
    }
  };

  async reset(tabId: number): Promise<void> {
    this.tabPrrReports.delete(tabId);
    this.pprTriggerService.reset(tabId);
  }
}
