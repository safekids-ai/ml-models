import {Logger} from '@shared/logging/ConsoleLogger';
import {PredictionRequest} from '@shared/types/messages';

import {Filter, FilterSettingsType} from '@src/filter/Filter';
import {ImageContent, ImageUtils} from '@shared/utils/ImageUtils';

export type IImageFilter = {
  analyzeImage: (imageContent: ImageContent) => void;
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

  public analyzeImage(imageContent: ImageContent): void {
    const {element, width, height, imageData} = imageContent;

    if (
      element.dataset.nsfkStatus !== 'nsfk' &&
      element.dataset.nsfkStatus !== 'skip' &&
      imageData.length > 0 &&
      height && width &&
      (height > this.MIN_IMAGE_SIZE || width > this.MIN_IMAGE_SIZE)
    ) {
      this._analyzeImage(imageContent);
    }
  }

  private _analyzeImage(imageContent: ImageContent): void {
    const {element, width, height, isBase64, imageType, imageData, src} = imageContent;

    const MAX_LIMIT = this.settings.processLimit;
    if (MAX_LIMIT && this.counter >= MAX_LIMIT) {
      this.counter = 0;
      this.logger.debug(`ML LIMIT EXCEEDS RESETTING to ${this.counter}`);
    }

    if (this.images.has(src)) {
      return;
    }
    this.images.add(src);

    this.counter++;

    if (this.counter >= this.settings.analyzeLimit) {
      return;
    }

    this.logger.log(`Sending ML Request # ${this.counter} ${src},${element.dataset.nsfkStatus}`);

    const trimmedImageContent: ImageContent = {src, isBase64, imageType, imageData};
    const trimmedImageJson = JSON.stringify(trimmedImageContent);

    const request = new PredictionRequest(src, 'ANALYZE_IMAGE', 'ML', window.location.href, trimmedImageJson);
    this.requestToAnalyzeImage(request)
      .then((result) => {
        console.log("ABBAS***********:" + JSON.stringify(result))
        const {prediction, url, prrStatus} = result;

        if (prrStatus) {
          this.logger.debug('PRR Triggerred');
          return;
        }
        if (!!prediction) {
          this.logger.debug(`Explicit image[${url}] detected. Count: ${this.violationCounter}.`);
          this.probabilityLimit = 0.2;
          this.violationCounter++;
          if (this.settings.filterEffect === 'blur') {
            if (this.settings.environment === 'development') {
              element.style.filter = 'blur(25px)';
            }
            this.showImage(element, src, url);
          } else if (this.settings.filterEffect === 'hide') {
            this.hideImage(element);
          }
          this.counter++;
          element.dataset.nsfkStatus = 'nsfk';
        } else {
          this.showImage(element, src, url);
        }
      })
      .catch(({url}) => {
        this.logger.error(`Error occurred while analysing image ${url}`);
        this.showImage(element, src, url);
        element.dataset.nsfkStatus = 'clean';
      });
  }

  private hideImage(image: HTMLElement): void {
    if (image.parentNode?.nodeName === 'BODY') {
      image.hidden = true;
    }
    image.style.visibility = this.settings.filterEffect;
  }

  private showImage(image: HTMLElement, imgSource: string, url: string): void {
    if (imgSource === url) {
      if (image.parentNode?.nodeName === 'BODY') image.hidden = false;

      image.dataset.nsfkStatus = 'sfk';
      image.style.visibility = 'visible';
    }
  }
}
