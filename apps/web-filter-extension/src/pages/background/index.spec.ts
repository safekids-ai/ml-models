import * as background from '../../../src/pages/background/background';
import {TestUtils} from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import {ChromeStore} from '../../../src/popup/redux/chrome-storage';
import {ConsoleLogger} from '../../../src/shared/logging/ConsoleLogger';
import {NLPModel} from '../../../src/pages/background/model/NLPModel';
import {mock} from 'ts-mockito';
import {NLP} from '@safekids-ai/nlp';
import {ImageModel} from '../../../src/pages/background/model/ImageModel';
import {Vision} from '@safekids-ai/vision';
import {MLModels} from '../../../src/shared/types/MLModels';

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

        const modelSettings: { filterStrictness: number } = { filterStrictness: 70 };
        const nlpModel = new NLPModel(nlp, logger);
        const visionModel = new ImageModel(vision, logger, modelSettings);

        jest.spyOn(nlpModel, 'init').mockImplementation(async () => {});
        jest.spyOn(visionModel, 'init').mockImplementation(async () => {});
        const modelsMap = new Map();
        modelsMap.set(MLModels.NLP, nlpModel);
        modelsMap.set(MLModels.VISION, visionModel);

        jest.spyOn(ChromeStore, 'createStore').mockImplementation(() => {
            return store;
        });

        await background.loadModels(logger, modelsMap);
    });
});
