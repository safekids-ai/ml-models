import {Logger} from '@shared/logging/ConsoleLogger';
import {PredictionRequest, PredictionResponse} from '@shared/types/messages';
import {HttpUtils} from '@shared/utils/HttpUtils';

import {Filter, FilterSettingsType, IObjectFilter} from '@src/filter/Filter';
import {HTMLWebData} from "@safekids-ai/web-category-types";

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
    const htmlText = this.extractText(elements);

    const titleElement = elements.find((element): element is HTMLTitleElement =>
      element.tagName.toLowerCase() === 'title'
    );

    const metaElements = elements.filter((element): element is HTMLMetaElement => {
      return element.tagName.toLowerCase() === 'meta';
    });

    let htmlData: HTMLWebData = {
      htmlText
    };

    if (titleElement) {
      htmlData.title = titleElement.text;
    }

    metaElements.forEach(element => {
      const name = element.name?.toLowerCase();
      const content = element.content;

      if (name && content) {
        switch (name) {
          case 'description':
            htmlData.description = content;
            break;
          case 'rating':
            htmlData.rating = content;
            break;
        }
      }
    });

    // Call the analysis function with the meta object
    if (htmlData.title || htmlData.description || htmlData.rating || htmlData.htmlText?.length > 50) {
      this._analyzeText(htmlData);
    }
  }

  private _analyzeText(meta: HTMLWebData): void {
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

  private extractText(elements: HTMLElement[]): string {
    const allowedElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span'];
    const extractedText = [];
    elements.forEach((el) => {
      if (allowedElements.includes(el.tagName.toLowerCase()) && el.innerText.trim()) {
        extractedText.push(el.innerText.trim());
      }
    });
    return extractedText.join('\n');
  }

}
