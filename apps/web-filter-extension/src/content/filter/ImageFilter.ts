import {Logger} from '@shared/logging/ConsoleLogger';
import {PredictionRequest} from '@shared/types/messages';

import {Filter, FilterSettingsType} from '@content/filter/Filter';
import {ImageUtils} from '@shared/utils/ImageUtils';

export type IImageFilter = {
  analyzeImage: (image: HTMLImageElement, srcAttribute: boolean) => void;
  setSettings: (settings: FilterSettingsType) => void;
};

export class ImageFilter extends Filter implements IImageFilter {
  private readonly MIN_IMAGE_SIZE: number;
  private settings: FilterSettingsType;
  private probabilityLimit: number;
  private readonly images = new Set();

  constructor(logger: Logger) {
    super(logger);
    this.MIN_IMAGE_SIZE = 41;
    this.probabilityLimit = 0.2;
    this.settings = {filterEffect: 'hide', analyzeLimit: 100, prThreshold: 5, environment: 'development'};
    this.images = new Set();
  }

  public setSettings(settings: FilterSettingsType): void {
    this.settings = settings;
  }

  public analyzeImage(image: HTMLImageElement): void {
    if (
      !!image &&
      image.dataset.nsfkStatus !== 'nsfk' &&
      image.dataset.nsfkStatus !== 'skip' &&
      image.src.length > 0 &&
      (image.height > this.MIN_IMAGE_SIZE || image.width > this.MIN_IMAGE_SIZE)
    ) {
      this._analyzeImage(image);
    }
  }

  private _analyzeImage(image: HTMLImageElement): void {
    const MAX_LIMIT = this.settings.processLimit;
    if (MAX_LIMIT && this.counter >= MAX_LIMIT) {
      this.counter = 0;
      this.logger.debug(`ML LIMIT EXCEEDS RESETTING to ${this.counter}`);
    }

    let imgSource = ImageUtils.getSource(image);

    if (this.images.has(imgSource)) {
      return;
    }
    this.images.add(imgSource);

    this.counter++;

    if (this.counter >= this.settings.analyzeLimit) {
      return;
    }

    this.logger.log(`Sending ML Request # ${this.counter} ${imgSource},${image.dataset.nsfkStatus}`);
    const request = new PredictionRequest(imgSource, 'ANALYZE_IMAGE', 'ML', window.location.href);
    this.requestToAnalyzeImage(request)
      .then((result) => {
        const {prediction, url, prrStatus} = result;
        if (prrStatus) {
          this.logger.debug('PRR Triggerred');
          return;
        }
        if (!!prediction) {
          //this.logger.debug(`Explicit image[${url}] detected. Count: ${this.violationCounter}.`);
          this.probabilityLimit = 0.2;
          this.violationCounter++;
          if (this.settings.filterEffect === 'blur') {
            if (this.settings.environment === 'development') {
              image.style.filter = 'blur(25px)';
            }
            this.showImage(image, url);
          } else if (this.settings.filterEffect === 'hide') {
            this.hideImage(image);
          }
          this.counter++;
          image.dataset.nsfkStatus = 'nsfk';
        } else {
          this.showImage(image, url);
        }
      })
      .catch(({url}) => {
        this.logger.error(`Error occurred while analysing image ${url}`);
        this.showImage(image, url);
        image.dataset.nsfkStatus = 'clean';
      });
  }

  private hideImage(image: HTMLImageElement): void {
    if (image.parentNode?.nodeName === 'BODY') {
      image.hidden = true;
    }
    image.style.visibility = this.settings.filterEffect;
  }

  private showImage(image: HTMLImageElement, url: string): void {
    const imgSource = ImageUtils.getSource(image);
    if (imgSource === url) {
      if (image.parentNode?.nodeName === 'BODY') image.hidden = false;

      image.dataset.nsfkStatus = 'sfk';
      image.style.visibility = 'visible';
    }
  }
}
