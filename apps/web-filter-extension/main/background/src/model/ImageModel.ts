import {Logger} from '@shared/logging/ConsoleLogger';
import {MLModel, ModelSettings} from '@shared/types/MLModel.type';
import {HttpUtils} from '@shared/utils/HttpUtils';
import {VisionWeb} from '@safekids-ai/vision-js-web';

const [resizeToWidth, resizeToHeight] = [640, 640];

export type Prediction = {
  result: boolean;
  className: string;
  probability: number;
};

export class ImageModel implements MLModel {
  private readonly FILTER_LIST: Set<string> = new Set(['Hentai', 'Porn', 'Sexy']);
  private readonly firstFilterPercentages: Map<string, number> = new Map();
  private readonly secondFilterPercentages: Map<string, number> = new Map();
  private _ready: boolean = false;

  constructor(private readonly model: VisionWeb, private readonly logger: Logger, settings: ModelSettings) {
    this.setSettings(settings);
  }

  public async init(): Promise<void> {
    try {
      await this.model.init();
      this._ready = true;
    } catch (e) {
      console.log(e)
      this.logger.error('Unable to initialize model.', e);
      throw e;
    }
  }

  isReady(): boolean {
    return this._ready;
  }

  public setSettings(settings: ModelSettings): void {
    const {filterStrictness} = settings;
    this.firstFilterPercentages.clear();
    this.secondFilterPercentages.clear();

    for (const className of this.FILTER_LIST.values()) {
      this.firstFilterPercentages.set(
        className,
        ImageModel.handleFilterStrictness({
          value: filterStrictness,
          maxValue: 100,
          minValue: className === 'Porn' ? 40 : 60,
        })
      );
    }

    for (const className of this.FILTER_LIST.values()) {
      this.secondFilterPercentages.set(
        className,
        ImageModel.handleFilterStrictness({
          value: filterStrictness,
          maxValue: 50,
          minValue: className === 'Porn' ? 15 : 25,
        })
      );
    }
  }

  // // @ts-expect-error
  public async predict(element: ImageData | HTMLImageElement | string, url: string): Promise<string> {
    if (typeof element === 'string') {
      throw new Error('unable to interpret string as image');
    }
    const image = element as ImageData;
    const urlData = !(url === '') && url.startsWith('data:') ? HttpUtils.shortenURL(url, 50, 20) : url;
    this.logger.debug(`starting processing ML [${urlData}]`);

    const prediction: any = await this.model.classifyImage(image);
    // const valid_detections_data = valid_detections.dataSync();

    return prediction as string;
  }

  public static handleFilterStrictness({
                                         value,
                                         minValue,
                                         maxValue
                                       }: { value: number; minValue: number; maxValue: number }): number {
    const MIN = minValue;
    const MAX = maxValue;

    const calc = (value: number): number => {
      if (value <= 1) return MAX;
      else if (value >= 100) return MIN;
      else {
        const coefficient = 1 - value / 100;
        return coefficient * (MAX - MIN) + MIN;
      }
    };

    return Math.round((calc(value) / 100) * 10000) / 10000;
  }
}
