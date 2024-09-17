import * as background from 'apps/web-filter-extension/old-src/pages/background/background';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {ChromeStore} from 'apps/web-filter-extension/old-src/popup/redux/chrome-storage';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {NLPModel} from './model/NLPModel';
import {mock} from 'ts-mockito';
import {NLP} from '@safekids-ai/nlp';
import {ImageModel} from './model/ImageModel';
import {Vision} from '@safekids-ai/vision';
import {MLModels} from '@shared/types/MLModels';

describe('Test background script', () => {
  const store: any = TestUtils.buildStore();
  const logger = new ConsoleLogger();

  it('Should start background service worker', async () => {
    jest.spyOn(ChromeStore, 'createStore').mockImplementation(() => {
      return store;
    });
    await background.init();
  });

  it('Should load models', async () => {
    let nlp = mock<NLP>();
    let vision = mock<Vision>();

    const modelSettings: { filterStrictness: number } = {filterStrictness: 70};
    const nlpModel = new NLPModel(nlp, logger);
    const visionModel = new ImageModel(vision, logger, modelSettings);

    jest.spyOn(nlpModel, 'init').mockImplementation(async () => {
    });
    jest.spyOn(visionModel, 'init').mockImplementation(async () => {
    });
    const modelsMap = new Map();
    modelsMap.set(MLModels.NLP, nlpModel);
    modelsMap.set(MLModels.VISION, visionModel);

    jest.spyOn(ChromeStore, 'createStore').mockImplementation(() => {
      return store;
    });

    await background.loadModels(logger, modelsMap);
  });
});
