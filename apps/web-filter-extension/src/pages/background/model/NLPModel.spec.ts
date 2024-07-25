import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { NLP, NLPLabel } from '@safekids-ai/nlp-js-common';
import { NLPModel } from '../../../../src/pages/background/model/NLPModel';

describe('ImageModel tests', () => {
    let nlpModel: NLPModel;
    const logger = new ConsoleLogger();
    const nlp = new NLP('');

    beforeEach(async () => {
        nlpModel = new NLPModel(nlp, logger);
    });

    it('Should throw error if NLP model is not loaded', async () => {
        try {
            jest.spyOn(nlp, 'init').mockImplementation(async (): Promise<void> => {
                throw new Error('Error');
            });

            await nlpModel.init();
        } catch (e) {
            //hack to throw exception in test
        }
        const ready = nlpModel.isReady();

        expect(nlp.init).toBeCalledTimes(1);
        expect(ready).toBeFalsy();
    });

    it('Should init NLP model and return _ready true', async () => {
        const modelSpy = jest.spyOn(nlp, 'init').mockImplementation(async (): Promise<void> => {
            return;
        });

        let modelSettings = { filterStrictness: 70 };
        nlpModel.setSettings(modelSettings);

        await nlpModel.init();

        const isReady = nlpModel.isReady();

        expect(modelSpy).toBeCalledTimes(1);
        expect(isReady).toBeTruthy();
    });

    it('Should predict given text data', async () => {
        const modelSpy = jest.spyOn(nlp, 'init').mockImplementation(() => Promise.resolve());
        const modelPredictSpy = jest.spyOn(nlp, 'classifyText').mockResolvedValue(NLPLabel.Weapons);

        await nlpModel.init();

        const data: string = 'How to buy a gun';

        const result = await nlpModel.predict(data, data);

        expect(modelSpy).toBeCalledTimes(1);
        expect(modelPredictSpy).toBeCalledTimes(1);
        expect(result).toMatch('weapons');
    });

    it('Should fail predict method if model not ready', async () => {
        try {
            jest.spyOn(nlp, 'init').mockImplementation(() => Promise.resolve());

            const data: string = 'How to buy a gun';
            await nlpModel.predict(data, data);
        } catch (e) {}

        const ready = nlpModel.isReady();
        expect(ready).toBeFalsy();

        expect(nlp.classifyText).toBeCalledTimes(0);
    });
});
