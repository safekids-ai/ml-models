import {Logger} from '@shared/logging/ConsoleLogger';
import {QueueWrapper} from '@shared/queue/QueueWrapper';
import {PrrMonitor, PrrReport} from '../../../prr/monitor/PrrMonitor';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {PredictionRequest, PredictionResponse} from '@shared/types/messages';
import {MLModels} from '@shared/types/MLModels';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrTrigger} from '@shared/types/message_types';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import moment from 'moment';

interface RequestHandler {
  onRequest(request: PredictionRequest, sender: chrome.runtime.MessageSender): Promise<PredictionResponse>;
}

export class PredictionRequestHandler implements RequestHandler {
  constructor(
    private readonly logger: Logger,
    private readonly store: ReduxStorage,
    private readonly queue: QueueWrapper,
    private readonly prrMonitor: PrrMonitor,
    private readonly chromeUtils: ChromeUtils
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
    if ((request.type === 'ANALYZE_TEXT' && !nlpEnabled) || (request.type === 'ANALYZE_IMAGE' && !mlEnabled)) {
      return response;
    }
    const tabIdUrl = this.chromeUtils.buildTabIdUrl(sender.tab);
    const modelType = requestType === 'NLP' ? MLModels.NLP : MLModels.VISION;

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
}
