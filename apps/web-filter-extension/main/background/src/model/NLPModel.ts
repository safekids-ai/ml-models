import {NLPLabel} from '@safekids-ai/nlp-js-types';
import {NLPWeb} from '@safekids-ai/nlp-js-web';

import {Logger} from '@shared/logging/ConsoleLogger';
import {MLModel, ModelSettings} from '@shared/types/MLModel.type';

export type Prediction = {
  result: boolean;
  className: string;
  probability: number;
};

export class NLPModel implements MLModel {
  private _ready: boolean = false;
  private settings: ModelSettings;

  constructor(private readonly model: NLPWeb, private readonly logger: Logger) {
    this.settings = {filterStrictness: 0};
  }

  public async init(): Promise<void> {
    try {
      await this.model.init();
      this.logger.log("Loaded NLP model")
      this._ready = true;
    } catch (e) {
      this.logger.error('Unable to initialize model.', e);
      throw e;
    }
  }

  isReady(): boolean {
    return this._ready;
  }

  public async predict(element: ImageData | HTMLImageElement | string, url: string): Promise<string> {
    if (!this._ready) {
      throw new Error('model is not loaded yet');
    }
    let text = element as string;

    const prediction: NLPLabel = await this.model.classifyText(text);
    console.log(`Predictionxx for ${text} is ${prediction as string}`);
    return prediction as string;
  }

  setSettings(settings: ModelSettings): void {
    this.settings = settings;
  }
}
