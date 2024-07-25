import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { ImageModel } from '../../../../src/pages/background/model/ImageModel';
import { Vision, VisionLabel } from '@safekids-ai/vision-js-common';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('ImageModel tests', () => {
    let imageModel: ImageModel;
    const logger = new ConsoleLogger();
    const vision = new Vision('');

    const modelSettings: { filterStrictness: number } = { filterStrictness: 70 };
    beforeEach(async () => {
        imageModel = new ImageModel(vision, logger, modelSettings);
    });

    it('Should throw error if vision model is not loaded', async () => {
        try {
            jest.spyOn(vision, 'init').mockImplementation(async (): Promise<void> => {
                throw new Error('Error');
            });

            await imageModel.init();
        } catch (e) {
            //hack to throw exception in test
        }
        const ready = imageModel.isReady();

        expect(vision.init).toBeCalledTimes(1);
        expect(ready).toBeFalsy();
    });

    it('Should init model and return _ready true', async () => {
        const modelSpy = jest.spyOn(vision, 'init').mockImplementation(async (): Promise<void> => {
            return;
        });

        await imageModel.init();

        const isReady = imageModel.isReady();

        expect(modelSpy).toBeCalledTimes(1);
        expect(isReady).toBeTruthy();
    });

    it('Should predict given image data', async () => {
        const dom = new JSDOM(`<!DOCTYPE html><img src="" />`);
        const img = dom.window.document.querySelector('img');

        const modelSpy = jest.spyOn(vision, 'init').mockImplementation(async (): Promise<void> => {
            return;
        });
        const modelPredictSpy = jest.spyOn(vision, 'classifyImageData').mockResolvedValue(VisionLabel.Porn);

        await imageModel.init();

        const data: string = 'data:image//jpeg;base64,gfasgfgasfoq3o5qhgjfdkbglkjw65y0pq9';

        const result = await imageModel.predict(img, data);

        expect(modelSpy).toBeCalledTimes(1);
        expect(modelPredictSpy).toBeCalledTimes(1);
        expect(result).toMatch('porn');
    });

    it('Should fail predict method if input is not an image', async () => {
        try {
            jest.spyOn(vision, 'init').mockImplementation(() => Promise.resolve());

            await imageModel.init();

            const data: string = 'How to buy a gun';
            await imageModel.predict(data, data);
        } catch (e) {}
        expect(vision.init).toBeCalledTimes(1);
        expect(vision.classifyImageData).toBeCalledTimes(0);
    });
});
