import {NLPBert} from '@safekids-ai/nlp-js-common';
import {VisionWeb} from '@safekids-ai/vision-js-web';

import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ConsoleLogger, Logger} from '@shared/logging/ConsoleLogger';
import {MLModel} from '@shared/types/MLModel.type';
import {MLModels} from '@shared/types/MLModels';
import {ChromeStore} from '@shared/redux/chrome-storage';

import {BackgroundBootstrapper} from './bootstrap/Bootstrapper';
import {BeanFactory, BeanNames} from './factory/BeanFactory';
import {ImageModel} from './model/ImageModel';
import {NLPModel} from './model/NLPModel';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';


const VISION_MODEL_PATH = 'models/vision/vision.onnx';
const NLP_MODEL_PATH = 'models/hate/nlp.onnx';

export const loadModels = async (logger: Logger, modelsMap: Map<MLModels, MLModel>): Promise<void> => {
  const nlpModelWrapper = modelsMap.get(MLModels.NLP);
  const mlModelWrapper = modelsMap.get(MLModels.VISION);

  await nlpModelWrapper?.init();
  await mlModelWrapper?.init();

  logger.log("Models loaded")
};

export const init = async (): Promise<void> => {
  const store = await ChromeStore.createStore();
  const {logging} = store.getState().settings;
  const logger: Logger = new ConsoleLogger();

  /*if (!logging) {
      logger.disable();
      logger.disableDebug();
  }*/

  const localStorageManager = new LocalStorageManager();
  const beanFactory = new BeanFactory(store, localStorageManager, logger);
  await beanFactory.init();

  // initialize AI models
  const modelSettings: { filterStrictness: number } = {filterStrictness: 70};

  const modelsMap = new Map<MLModels, MLModel>();
  const nlp = new NLPBert(NLP_MODEL_PATH);
  const nlpModelWrapper = new NLPModel(nlp, logger);

  const vision = new VisionWeb(VISION_MODEL_PATH);
  const mlModelWrapper = new ImageModel(vision, logger, modelSettings);

  modelsMap.set(MLModels.NLP, nlpModelWrapper);
  modelsMap.set(MLModels.VISION, mlModelWrapper);

  await loadModels(logger, modelsMap).catch((error) => {
    logger.error(`Failed to load ML Models. ${error}`);
  });
  beanFactory.addBean(BeanNames.AI_MODELS, modelsMap);

  // loading Models here
  const bootstrapper = new BackgroundBootstrapper(logger, beanFactory, store, localStorageManager);
  bootstrapper.init().catch((error) => {
    logger.error(`Failed to initialize. ${JSON.stringify(error)}`);
  });

  console.log('background loaded 1');
};

init().catch((e) => ChromeCommonUtils.getLogger().error);
