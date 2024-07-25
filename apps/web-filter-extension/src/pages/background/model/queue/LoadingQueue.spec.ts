import { ConsoleLogger } from '../../../../shared/logging/ConsoleLogger';
import { MLModel, ModelSettings } from '../../../../shared/types/MLModel.type';
import { TestUtils } from '../../../../../TestUtils';
import { QueueWrapper } from '../../../../../src/pages/background/model/queue/QueueWrapper';
import { ChromeUtils } from '../../../../shared/chrome/utils/ChromeUtils';
import { LocalStorageManager } from '../../../../shared/chrome/storage/ChromeStorageManager';
import { NLP } from '@safekids-ai/nlp-js-common';
import { mock } from 'ts-mockito';
import { Vision } from '@safekids-ai/vision-js-common';
import { MLModels } from '../../../../shared/types/MLModels';
import { NLPModel } from '../../../../../src/pages/background/model/NLPModel';
import { ImageModel } from '../../../../../src/pages/background/model/ImageModel';
import Tab = chrome.tabs.Tab;
import { ImageUtils } from '../../../../shared/utils/ImageUtils';

describe('Loading Queue tests', () => {
    const logger = new ConsoleLogger();
    const store = TestUtils.buildSettingsState();
    const storageManager = new LocalStorageManager();
    const chromeUtils = new ChromeUtils(logger, storageManager);
    const settings: ModelSettings = { filterStrictness: 70 };

    const nlp: NLP = mock(NLP);
    const nlpModel = new NLPModel(nlp, logger);

    const vision: Vision = mock(Vision);
    const imageModel = new ImageModel(vision, logger, settings);
    const models: Map<string, MLModel> = new Map<string, MLModel>();
    models.set(MLModels.NLP, nlpModel);
    models.set(MLModels.VISION, imageModel);

    let loadingQueue: QueueWrapper;

    beforeEach(async () => {
        loadingQueue = new QueueWrapper(models, logger, store);
    });

    it('Should send predict request to queue for base64 image', async () => {
        //Arrange
        jest.spyOn(nlpModel, 'predict').mockResolvedValue('porn');
        jest.spyOn(imageModel, 'predict').mockResolvedValue('porn');
        jest.spyOn(ImageUtils, 'byteArrayToImageData').mockResolvedValue('');

        const tab: Tab = {
            active: false,
            autoDiscardable: false,
            discarded: false,
            highlighted: false,
            incognito: false,
            index: 0,
            pinned: false,
            selected: false,
            windowId: 0,
            id: 1,
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAA',
        };

        let tabIdUrl = chromeUtils.buildTabIdUrl(tab);
        loadingQueue.addTabIdUrl(tabIdUrl);

        //Act
        const result = await loadingQueue.predict(tab.url as string, tabIdUrl, 'ML');

        //Assert
        expect(result).toEqual('porn');
    });

    it('Should send predict request to queue for image url', async () => {
        //Arrange
        jest.spyOn(nlpModel, 'predict').mockResolvedValue('porn');
        jest.spyOn(imageModel, 'predict').mockResolvedValue('porn');
        jest.spyOn(ImageUtils, 'byteArrayToImageData').mockResolvedValue('');

        const tab: Tab = {
            active: false,
            autoDiscardable: false,
            discarded: false,
            highlighted: false,
            incognito: false,
            index: 0,
            pinned: false,
            selected: false,
            windowId: 0,
            id: 1,
            url: 'www.google.com/image.png',
        };

        let tabIdUrl = chromeUtils.buildTabIdUrl(tab);
        loadingQueue.addTabIdUrl(tabIdUrl);

        //Act
        const result = await loadingQueue.predict(tab.url as string, tabIdUrl, 'ML', '{}');

        //Assert
        expect(result).toEqual('porn');
    });

    it('Should send predict request to queue for NLP model', async () => {
        jest.spyOn(nlpModel, 'predict').mockResolvedValue('porn');
        jest.spyOn(imageModel, 'predict').mockResolvedValue('porn');

        const tab: Tab = {
            active: false,
            autoDiscardable: false,
            discarded: false,
            highlighted: false,
            incognito: false,
            index: 0,
            pinned: false,
            selected: false,
            windowId: 0,
            id: 1,
            url: 'http://dummy.image/abc.png',
        };

        const tabIdUrl = chromeUtils.buildTabIdUrl(tab);
        loadingQueue.addTabIdUrl(tabIdUrl);

        //Act
        const result = await loadingQueue.predict(tab.url as string, tabIdUrl, 'NLP');

        //Assert
        expect(result).toEqual('porn');
    });
});
