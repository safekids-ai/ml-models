import {Logger} from '@shared/logging/ConsoleLogger';
import {QueueWrapper} from '@shared/queue/QueueWrapper';
import {PrrMonitor, PrrReport} from '../../../prr/monitor/PrrMonitor';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {PredictionRequest, PredictionResponse} from '@shared/types/messages';
import {MLModels} from '@shared/types/MLModels';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrTrigger} from '@shared/types/message_types';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {HTMLMetaClassifier, WebMeta} from "@safekids-ai/web-category-types";
import {FilterManager} from "src/filter/ContentFilterManager";
import {ContentResult} from "@shared/types/ContentResult";
import {PrrLevel} from "@shared/types/PrrLevel";
import {UrlStatus} from "@shared/types/UrlStatus";

interface RequestHandler {
  onRequest(request: PredictionRequest, sender: chrome.runtime.MessageSender): Promise<PredictionResponse>;
}

export class PredictionRequestHandler implements RequestHandler {
  constructor(
    private readonly logger: Logger,
    private readonly store: ReduxStorage,
    private readonly queue: QueueWrapper,
    private readonly prrMonitor: PrrMonitor,
    private readonly chromeUtils: ChromeUtils,
    private readonly filterManager: FilterManager,
  ) {
  }

  onRequest = async (request: PredictionRequest, sender: chrome.runtime.MessageSender): Promise<PredictionResponse> => {
    const tabId = sender.tab?.id;
    if (!tabId) {
      throw new Error('unable to fetch tab id from chrome tab in PredictionRequestHandler');
    }

    const {url, requestType, host, data} = request;

    let result = undefined;
    let response: PredictionResponse = new PredictionResponse(result, request.url);

    const informUrlExists = await this.chromeUtils.checkInformUrlStatus(host);
    if (informUrlExists) {
      return response;
    }

    const {nlpEnabled, mlEnabled} = this.store.getState().settings;

    switch (request.type) {
      case "ANALYZE_TEXT":
        if (!nlpEnabled) {
          return response;
        }
        break;
      case "ANALYZE_IMAGE":
        if (!mlEnabled) {
          return response;
        }
        break;
      case "ANALYZE_META":
        return this.handleMetaRequest(request, sender);
    }
    const tabIdUrl = this.chromeUtils.buildTabIdUrl(sender.tab);

    let modelType = undefined;

    if (requestType == "NLP") {
      modelType = MLModels.NLP;
    } else if (requestType === "ML") {
      modelType = MLModels.VISION;
    } else {
      throw new Error(`Unsupported requestType found ${requestType}`)
    }

    try {
      //send request to predict
      result = await this.queue.predict(url, tabIdUrl, modelType, data);
      result = result.toUpperCase();
      //this.logger.debug(`Prediction is [${result}] for ${url}, model = ${modelType}`)
    } catch (e) {
      result = undefined;
      //TODO: absorbing error for now. investing the root cause for the issue
      //this.logger.error(`Error occurred while predicting url[${url}]`);
    }

    let type = null;
    let category = '';
    // TODO: fix className for ML and probability 0.6 or 0.2
    let prrCategory = PrrCategory.ALLOWED;
    let mlModel = MLModels.NLP;

    if (result) {
      if (requestType === 'NLP') {
        if (result) {
          type = 'NLP';
          if (result.toUpperCase().startsWith('WEAPONS')) {
            category = 'Weapons';
            prrCategory = PrrCategory.WEAPONS;
          } else if (result.toUpperCase().startsWith('PORN')) {
            category = 'Porn';
            prrCategory = PrrCategory.EXPLICIT;
          } else if (result.toUpperCase().startsWith('PROXY')) {
            category = 'Proxy';
            prrCategory = PrrCategory.PROXY;
          } else if (result.toUpperCase().startsWith('SELF_HARM')) {
            category = 'Self_Harm';
            prrCategory = PrrCategory.SELF_HARM_SUICIDAL_CONTENT;
          }
        }
      } else if (requestType === 'ML') {
        if (result === 'GUN' || result === 'WEAPONS') {
          category = 'Weapons';
          prrCategory = PrrCategory.WEAPONS;
        } else if (result === 'PROXY') {
          category = 'Proxy';
          prrCategory = PrrCategory.PROXY;
        } else if (result === 'SELF_HARM') {
          category = 'Self_Harm';
          prrCategory = PrrCategory.SELF_HARM;
        } else if (result === 'PORN') {
          category = 'Porn';
          prrCategory = PrrCategory.EXPLICIT;
        }
        type = 'ML';
        mlModel = MLModels.VISION;
      }
    }

    if (result && !!type && !!category) {
      const newReport: PrrReport = {
        prrTriggerId: PrrTrigger.AI_NLP_VISION,
        model: mlModel,
        url: request.host,
        fullWebUrl: sender.tab?.url,
        category: prrCategory,
        data: url,
        tabId: tabId,
      };

      this.prrMonitor.report(newReport);
    }

    response = new PredictionResponse(result, request.url);
    return response;
  };

  handleMetaRequest = async (request: PredictionRequest, sender: chrome.runtime.MessageSender): Promise<PredictionResponse> => {
    const tabId = sender.tab?.id;
    const {url, requestType, host, data} = request;
    const meta: WebMeta = JSON.parse(data)
    let result: ContentResult = undefined
    let newReport: PrrReport = {
      prrTriggerId: PrrTrigger.AI_WEB_CATEGORY,
      model: MLModels.WEB_CATEGORY,
      url: host,
      fullWebUrl: sender.tab?.url,
      data: url,
      tabId: tabId,
      prrTriggered: true,
      status: 'block',
      isAiGenerated: true
    }

    try {
      result = await this.filterManager.filterUrl(url, meta);
      if (result.status != UrlStatus.ALLOW) {
        newReport.level = result.level;
        newReport.category = result.category
        this.prrMonitor.report(newReport);
        return new PredictionResponse(result, request.url);
      }
    } catch (error) {
      this.logger.error(`Unable to get category for url:${url} and meta:${meta}`, error);
      const isAdult = HTMLMetaClassifier.isAdultMeta(meta);
      const isWeapons = HTMLMetaClassifier.isWeaponsMeta(meta);

      if (isAdult) {
        newReport.level = isWeapons ? PrrLevel.THREE : PrrLevel.ONE;
        newReport.category = isWeapons ? PrrCategory.WEAPONS : PrrCategory.INAPPROPRIATE_FOR_MINORS;
        this.prrMonitor.report(newReport);
        return new PredictionResponse(null, request.url);
      }
    }
    return new PredictionResponse(null, request.url);
  }
}
