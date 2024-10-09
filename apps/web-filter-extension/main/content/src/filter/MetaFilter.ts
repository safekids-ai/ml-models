import {Logger} from '@shared/logging/ConsoleLogger';
import {PredictionRequest, PredictionResponse} from '@shared/types/messages';
import {HttpUtils} from '@shared/utils/HttpUtils';

import {Filter, FilterSettingsType, IObjectFilter} from '@src/filter/Filter';
import {WebMeta} from "@safekids-ai/web-category-types";

export class MetaFilter extends Filter implements IObjectFilter {
  private readonly elements: Set<string>;
  private settings: FilterSettingsType;

  constructor(logger: Logger) {
    super(logger);
    this.elements = new Set();
    this.settings = {filterEffect: 'hide', analyzeLimit: 1, prThreshold: 5, environment: 'development'};
  }

  public setSettings(settings: FilterSettingsType): void {
    this.settings = settings;
  }

  public analyze(elements: HTMLElement[]): void {
    const titleElement = elements.find((element): element is HTMLTitleElement =>
      element.tagName.toLowerCase() === 'title'
    );

    const metaElements = elements.filter((element): element is HTMLMetaElement => {
      return element.tagName.toLowerCase() === 'meta';
    });

    let meta: WebMeta = {};

    if (titleElement) {
      meta.title = titleElement.text;
    }

    metaElements.forEach(element => {
      const name = element.name?.toLowerCase();
      const content = element.content;

      if (name && content) {
        switch (name) {
          case 'description':
            meta.description = content;
            break;
          case 'rating':
            meta.rating = content;
            break;
        }
      }
    });

    // Call the analysis function with the meta object
    if (meta.title || meta.description || meta.rating) {
      this._analyzeText(meta);
    }
  }

  private _analyzeText(meta: WebMeta): void {
    this.logger.debug("Sending url page category Request:", meta);
    const value = new PredictionRequest(window.location.href, 'ANALYZE_META', 'NLP_META', window.location.href, JSON.stringify(meta));
    const request = {type: 'ANALYZE_META', value};
    chrome.runtime.sendMessage(request, (response: PredictionResponse) => {
      if (chrome.runtime.lastError !== null && chrome.runtime.lastError !== undefined) {
        return;
      }
      if (!response.prediction) {
        return;
      }
    });
  }
}
