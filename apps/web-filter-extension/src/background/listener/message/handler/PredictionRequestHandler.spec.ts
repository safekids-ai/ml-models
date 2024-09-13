import {PredictionRequestHandler} from './PredictionRequestHandler';
import {ConsoleLogger, Logger} from '../../../../../src/shared/logging/ConsoleLogger';
import {LocalStorageManager} from '../../../../../src/shared/chrome/storage/ChromeStorageManager';
import {QueueWrapper} from '../../../../../src/pages/background/model/queue/QueueWrapper';
import {PrrMonitor, PrrReport} from '../../../../../src/pages/background/prr/monitor/PrrMonitor';
import {ChromeUtils} from '../../../../../src/shared/chrome/utils/ChromeUtils';
import {TestUtils} from '../../../../TestUtils';
import {MLPrrMonitor} from '../../../../../src/pages/background/prr/monitor/MLPrrMonitor';
import {mock} from 'ts-mockito';
import {PrrTriggerService} from '../../../../../src/pages/background/prr/PrrTriggerService';
import {PredictionRequest} from '../../../../../src/shared/types/messages';
import {expect} from '@jest/globals';
import MessageSender = chrome.runtime.MessageSender;

describe('AI Prediction request handler test', () => {
  let predictionRequestHandler: PredictionRequestHandler;
  let logger: Logger = new ConsoleLogger();
  let localStorage = new LocalStorageManager();
  const store = TestUtils.buildStore(['gambling'], ['gambling.com'], '', [''], true, true);
  let models = new Map();
  let queue: QueueWrapper = new QueueWrapper(models, logger, store);
  const triggerService = mock<PrrTriggerService>();
  let prrMonitor: PrrMonitor = new MLPrrMonitor(logger, store, triggerService, localStorage);
  let chromeUtils: ChromeUtils = new ChromeUtils(logger, localStorage);
  let nlpClasses = ['WEAPONS', 'PORN', 'PROXY', 'SELF_HARM'];
  let visionClasses = ['GUN', 'PROXY', 'SELF_HARM', 'PORN'];

  const tab = TestUtils.buildChromeTab(111, 'youtube.com');
  const sender: MessageSender = {tab};
  const visionModelRequest = new PredictionRequest('youtube.com/image.png', 'ANALYZE_IMAGE', 'ML', 'youtube.com');
  const nlpModelRequest = new PredictionRequest('youtube.com/image.png', 'ANALYZE_TEXT', 'NLP', 'youtube.com');

  beforeEach(async () => {
  });

  it.each(visionClasses)('Should return prr response when Vision prediction is true for %s', async (visionClass) => {
    jest.spyOn(chromeUtils, 'buildTabIdUrl').mockReturnValue({tabId: 0, tabUrl: 'https://youtube.com'});
    jest.spyOn(chromeUtils, 'getInformUrls').mockResolvedValue([]);
    jest.spyOn(chromeUtils, 'setInformUrls').mockImplementation(async (value: any) => {
    });

    const queueSpy = jest.spyOn(queue, 'predict').mockResolvedValue(visionClass);
    const prrMonitorSpy = jest.spyOn(prrMonitor, 'report').mockImplementation(async (prrReport: PrrReport): Promise<void> => {
    });
    predictionRequestHandler = new PredictionRequestHandler(logger, store, queue, prrMonitor, chromeUtils);

    const expectedResult = {
      prediction: visionClass.toUpperCase(),
      url: 'youtube.com/image.png',
      prThreshold: 0,
      prThresholdType: '',
      showClean: false,
      message: 'Prediction result is ' + visionClass + ' for image youtube.com/image.png',
      prrStatus: false,
    };

    const result = await predictionRequestHandler.onRequest(visionModelRequest, sender);
    expect(result).toBeTruthy();
    expect(result).toMatchObject(expectedResult);
    expect(queueSpy).toBeCalledTimes(1);
    expect(prrMonitorSpy).toBeCalledTimes(1);
  });

  it.each(nlpClasses)('Should return prr response when ML prediction is true for %s', async (nlp) => {
    jest.spyOn(chromeUtils, 'buildTabIdUrl').mockReturnValue({tabId: 0, tabUrl: 'https://youtube.com'});
    jest.spyOn(chromeUtils, 'getInformUrls').mockResolvedValue([]);
    jest.spyOn(chromeUtils, 'setInformUrls').mockImplementation(async (value: any) => {
    });
    const queueSpy = jest.spyOn(queue, 'predict').mockResolvedValue(nlp);
    const prrMonitorSpy = jest.spyOn(prrMonitor, 'report').mockImplementation(async (prrReport: PrrReport): Promise<void> => {
    });
    predictionRequestHandler = new PredictionRequestHandler(logger, store, queue, prrMonitor, chromeUtils);

    const expectedResult = {
      prediction: nlp.toUpperCase(),
      url: 'youtube.com/image.png',
      prThreshold: 0,
      prThresholdType: '',
      showClean: false,
      message: 'Prediction result is ' + nlp + ' for image youtube.com/image.png',
      prrStatus: false,
    };

    const result = await predictionRequestHandler.onRequest(nlpModelRequest, sender);
    expect(result).toBeTruthy();
    expect(result).toMatchObject(expectedResult);
    expect(queueSpy).toBeCalledTimes(1);
    expect(prrMonitorSpy).toBeCalledTimes(1);
  });

  it('should return prr response and not send prr report when VISION prediction is false', async () => {
    jest.spyOn(chromeUtils, 'buildTabIdUrl').mockReturnValue({tabId: 1, tabUrl: 'https://youtube.com'});
    jest.spyOn(chromeUtils, 'getInformUrls').mockResolvedValue([]);
    jest.spyOn(chromeUtils, 'setInformUrls').mockImplementation(async (value: any) => {
    });
    const queueSpy = jest.spyOn(queue, 'predict').mockResolvedValue(undefined);
    const prrMonitorSpy = jest.spyOn(prrMonitor, 'report').mockImplementation(async (prrReport: PrrReport): Promise<void> => {
    });
    predictionRequestHandler = new PredictionRequestHandler(logger, store, queue, prrMonitor, chromeUtils);

    const expectedResult = {
      url: 'youtube.com/image.png',
      prThreshold: 0,
      prThresholdType: '',
      showClean: false,
      message: 'Prediction result is undefined for image youtube.com/image.png',
      prrStatus: false,
    };

    const result = await predictionRequestHandler.onRequest(visionModelRequest, sender);
    expect(result).toBeTruthy();
    expect(result).toMatchObject(expectedResult);
    expect(queueSpy).toBeCalledTimes(1);
    expect(prrMonitorSpy).toBeCalledTimes(0);
  });

  it('should return prr response and not send prr report when NLP prediction is false', async () => {
    jest.spyOn(chromeUtils, 'buildTabIdUrl').mockReturnValue({tabId: 1, tabUrl: 'https://youtube.com'});
    jest.spyOn(chromeUtils, 'getInformUrls').mockResolvedValue([]);
    jest.spyOn(chromeUtils, 'setInformUrls').mockImplementation(async (value: any) => {
    });
    const queueSpy = jest.spyOn(queue, 'predict').mockResolvedValue(undefined);
    const prrMonitorSpy = jest.spyOn(prrMonitor, 'report').mockImplementation(async (prrReport: PrrReport): Promise<void> => {
    });
    predictionRequestHandler = new PredictionRequestHandler(logger, store, queue, prrMonitor, chromeUtils);

    const expectedResult = {
      url: 'youtube.com/image.png',
      prThreshold: 0,
      prThresholdType: '',
      showClean: false,
      message: 'Prediction result is undefined for image youtube.com/image.png',
      prrStatus: false,
    };

    const result = await predictionRequestHandler.onRequest(nlpModelRequest, sender);
    expect(result).toBeTruthy();
    expect(result).toMatchObject(expectedResult);
    expect(queueSpy).toBeCalledTimes(1);
    expect(prrMonitorSpy).toBeCalledTimes(0);
  });

  it('should throw exception and not send prr report when tab id is not valid', async () => {
    jest.spyOn(chromeUtils, 'buildTabIdUrl').mockReturnValue({tabId: 1, tabUrl: 'https://youtube.com'});
    jest.spyOn(chromeUtils, 'getInformUrls').mockResolvedValue([]);
    jest.spyOn(chromeUtils, 'setInformUrls').mockImplementation(async (value: any) => {
    });
    const queueSpy = jest.spyOn(queue, 'predict').mockResolvedValue('');
    const prrMonitorSpy = jest.spyOn(prrMonitor, 'report').mockImplementation(async (prrReport: PrrReport): Promise<void> => {
    });
    predictionRequestHandler = new PredictionRequestHandler(logger, store, queue, prrMonitor, chromeUtils);

    tab.id = 0;
    sender.tab = tab;
    let error = false;
    try {
      await predictionRequestHandler.onRequest(nlpModelRequest, sender);
    } catch (e) {
      error = true;
    }
    expect(error).toBeTruthy();
    expect(queueSpy).toBeCalledTimes(0);
    expect(prrMonitorSpy).toBeCalledTimes(0);
  });
});
