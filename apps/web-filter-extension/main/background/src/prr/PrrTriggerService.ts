import {BlockResult, ChromeTabHelper} from '@shared/chrome/tabs/ChromeTabHelper';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {Logger} from '@shared/logging/ConsoleLogger';
import {ActivityService} from '../services/ActivityService';
import {PrrLevelChecker} from './PrrLevelChecker';
import {PrrReportManager} from './PrrReportManager';
import {UrlStatus} from '@shared/types/UrlStatus';
import {PrrReport} from './monitor/PrrMonitor';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {PrrStatus} from '@shared/types/PrrStatus';
import {UrlTabEventHandler} from "src/event/handler/UrlTabEventHandler";

export type TriggerService = {
  trigger: (prrResult: PrrReport) => Promise<void>;
  reset(tabId: number): void;
};

export class PrrTriggerService implements TriggerService {
  constructor(
    private readonly logger: Logger,
    private readonly chromeTabHelper: ChromeTabHelper,
    private readonly chromeUtils: ChromeUtils,
    private readonly prrReportManager: PrrReportManager,
    private readonly activityService: ActivityService,
    private readonly prrLevelChecker: PrrLevelChecker
  ) {
  }

  async trigger(prrReport: PrrReport): Promise<void> {
    if (!prrReport || prrReport.status === UrlStatus.ALLOW) {
      return;
    }
    const isAlreadyTriggered = !!prrReport && !!prrReport.tabId && !!this.prrReportManager.getReport(prrReport.tabId);
    if (isAlreadyTriggered) {
      this.logger.log(`Prr already triggered for tab[${prrReport.tabId}] so return it.`);
      return;
    }
    this.prrReportManager.add(prrReport?.tabId, prrReport);

    // check PRR Level counters
    const prrResult: PrrReport = await this.prrLevelChecker.check(prrReport);
    const blockResult: BlockResult = {
      category: prrResult.category ?? PrrCategory.UN_KNOWN,
      level: prrResult.level ?? PrrLevel.ZERO,
      host: prrReport.fullWebUrl ?? '',
      ai: prrReport?.isAiGenerated === undefined ? false : prrReport?.isAiGenerated,
      aiProbability: prrReport?.aiProbability,
      status: prrReport.status ?? PrrStatus.UN_KNOWN,
      eventId: prrReport.eventId,
    };

    if (blockResult.ai && blockResult.aiProbability && blockResult.aiProbability > 0.98) {
      blockResult.ai = false;
    }

    if (blockResult.ai) {
      this.chromeTabHelper.displayPopup(prrReport.tabId, blockResult);
    } else {
      this.chromeTabHelper.redirect(prrReport.tabId, {url: this.chromeUtils.prrPageUrl(blockResult)});
    }

    this.activityService.prrTriggered(prrResult);
  }

  reset(tabId: number): void {
    this.prrReportManager.reset(tabId);
  }
}
