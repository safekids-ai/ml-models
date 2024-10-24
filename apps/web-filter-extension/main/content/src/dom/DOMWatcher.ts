import {Logger} from '@shared/logging/ConsoleLogger';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {ImageFilter} from '@src/filter/ImageFilter';
import {TextFilter} from '@src/filter/TextFilter';
import {DOMProcessor} from '@src/dom/DOMProcessor';
import {DOMFilter} from '@src/dom/DOMFilterFactory';
import {ContentFilterUtil} from "@shared/utils/content-filter/ContentFilterUtil"
import {ImageUtils} from '@shared/utils/ImageUtils';
import {HttpUtils} from '@shared/utils/HttpUtils';
import {DOMEventHandler} from '@src/handler/DOMEventHandler';
import {MetaFilter} from "@src/filter/MetaFilter";

export type IDOMWatcher = {
  watch: (host: string) => void;
};

export class DOMWatcher implements IDOMWatcher {
  private readonly observer: MutationObserver;

  constructor(
    private document: Document,
    private host: string,
    private readonly logger: Logger,
    private store: ReduxStorage,
    private readonly imageFilter: ImageFilter,
    private readonly textFilter: TextFilter,
    private readonly metaFilter: MetaFilter,
    private readonly domFilter: DOMFilter,
    private readonly contentFilterUtils: ContentFilterUtil
  ) {
    this.observer = new MutationObserver(this.callback.bind(this));

    // Check if page is hidden and wait until it becomes visible
    if (document.visibilityState === 'hidden') {
      this.logger.log(`Page is in hidden state (likely prerendered), waiting for visibility...`);
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    } else {
      this.handleVisibilityChange();
    }
  }

  private isVisible(): boolean {
    return this.document.visibilityState === "visible";
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.logger.log(`Page is now visible, running onLoad...`);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      this.onLoad();
    }
  }

  public watch(): void {
    if (!this.skipHost(this.host)) {
      this.observer.observe(this.document, DOMWatcher.getConfig());
    }
  }

  public skipHost(host: string): boolean {
    let lowerHost = host.trim().toLowerCase();
    lowerHost = HttpUtils.getDomain(lowerHost);
    return lowerHost.endsWith('.edu') || lowerHost.includes('edu.') || this.contentFilterUtils.isHostAllowed(lowerHost);
  }

  /* istanbul ignore next */
  callback(mutationsList: MutationRecord[]): void {
    if (!this.isVisible()) {
      return;
    }

    for (let i = 0; i < mutationsList.length; i++) {
      const mutation = mutationsList[i];
      /* istanbul ignore next */
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        this.filterElements(mutation.target as Element);
      } else if (mutation.type === 'attributes') {
        this.checkAttributeMutation(mutation.target);
      }
    }
  }

  filterElements(element: Element): void {
    // TODO: fix harcoded host
    if (this.host === 'www.youtube.com') {
      this.domFilter?.filter(element as HTMLElement);
    }

    const images = element.getElementsByTagName('img');
    const sortedImages = ImageUtils.sort(images);
    for (let i = 0; i < sortedImages.length; i++) {
      this.imageFilter.analyzeImage(sortedImages[i]);
    }
    const bgImages = DOMProcessor.getBackgroundImages(element);
    for (let i = 0; i < bgImages.length; i++) {
      const img = document.createElement('img');
      img.src = bgImages[i];
      img.height = img.width = 50;
      this.imageFilter.analyzeImage(img);
    }

    const headings1 = element.querySelectorAll('a,h3');
    for (let i = 0; i < headings1.length; i++) {
      const elem = headings1[i] as HTMLElement;
      if (elem.closest('.ytd-promoted-sparkles-web-renderer') != null) {
        continue;
      }
      const parentElement = elem.parentElement;
      if (parentElement?.nodeName.toUpperCase() === 'A') {
        continue;
      }
      this.textFilter.analyze(elem);
    }

    // const txtNodes = this.document.querySelectorAll('p,h1,h2,h3,h4,h5,h6,div,span');
    // const textElements: HTMLElement[] = [...txtNodes] as HTMLElement[];
    // this.metaFilter.analyze(textElements);

    this.register(element);
  }

  private register(element: Document | Element) {
    const buttons = this.document.getElementsByTagName('button');
    this.listenFormSubmission(buttons);
    const submitButtons = this.document.querySelector('button[type="submit"]');
    this.listenFormSubmission(submitButtons);
    const submitInputs = this.document.querySelector('input[type="submit"]');
    this.listenFormSubmission(submitInputs);
    const inputFields = this.document.getElementsByTagName('input');
    this.listenFormSubmission(inputFields, 'ENTER');
  }

  checkAttributeMutation(target: Node): void {
    if ((target as HTMLImageElement).nodeName === 'IMG') {
      this.imageFilter.analyzeImage(target as HTMLImageElement);
    }
  }

  private static getConfig(): MutationObserverInit {
    return {
      characterData: false,
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src', 'data-src', 'data-original', 'data-image'],
    };
  }

  /**
   * Predict elements on page load
   * @param document
   */
  onLoad() {
    if (this.skipHost(this.host)) {
      return;
    }
    if (this.host === 'www.google.com') {
      this.domFilter?.filter(this.document.body);
    }

    const {mlProcessLimit, nlpProcessLimit} = this.store.getState().settings;
    const images = this.document.getElementsByTagName('img');
    const sortedImages = ImageUtils.sort(images);
    const imagesTotal = sortedImages.length === 0 || sortedImages.length <= mlProcessLimit ? sortedImages.length : mlProcessLimit;
    for (let i = 0; i < imagesTotal; i++) {
      if (sortedImages[i]) {
        this.imageFilter.analyzeImage(sortedImages[i]);
      }
    }
    // get elements that have images as background
    // TODO: find a smart way to merge img and background images
    const bgImages = DOMProcessor.getBackgroundImages(this.document.body);
    const totalBGImages = bgImages.length === 0 || bgImages.length <= mlProcessLimit ? bgImages.length : mlProcessLimit;
    for (let i = 0; i < totalBGImages; i++) {
      const img = this.document.createElement('img');
      img.src = bgImages[i];
      img.height = img.width = 50;
      this.imageFilter.analyzeImage(img);
    }
    const headings1 = this.document.querySelectorAll('a,h3');
    const total = headings1.length === 0 || headings1.length <= nlpProcessLimit ? headings1.length : nlpProcessLimit;
    for (let i = 0; i < total; i++) {
      const elem = headings1[i] as HTMLElement;
      const parentElement = elem.parentElement;
      if (parentElement?.nodeName.toUpperCase() === 'A') {
        continue;
      }
      this.textFilter.analyze(elem);
    }

    //analyzing all text on the page
    const txtNodes = this.document.querySelectorAll('meta,title,p,h1,h2,h3,h4,h5,h6,div,span');
    const textElements: HTMLElement[] = [...txtNodes] as HTMLElement[];
    this.logger.log(`Sending meta request for ${this.host}`);
    this.metaFilter.analyze(textElements);

    this.register(document);

    const allAnchors = this.document.getElementsByTagName('a');
    DOMEventHandler.registerEvent(this.host, allAnchors);
  }

  public reset(source?: string) {
    this.imageFilter.reset();
    this.textFilter.reset();
    if (!!source && source === 'onload') {
      this.onLoad();
    }
  }

  public listenFormSubmission(elements: any, type?: string) {
    if (!elements) return;

    const inputTypes = {
      text: 0,
      search: 0,
      date: 0,
      email: 0,
      file: 0,
      number: 0,
      password: 0,
      url: 0,
      time: 0,
      datetime: 0,
    };
    const that = this;
    /* istanbul ignore next */
    for (let i = 0; i < elements.length; i++) {
      if (!!type && type === 'ENTER' && !!elements[i] && Object.prototype.hasOwnProperty.call(inputTypes, elements[i].type.toLowerCase())) {
        /* istanbul ignore next */
        elements[i].onkeydown = function (event: any) {
          DOMEventHandler.handleEnterEvent(event, that.reset('onload'));
        };
        /* istanbul ignore next */
        elements[i].onkeyup = function (e: any) {
          DOMEventHandler.handleEnterEvent(event, that.reset('onload'));
        };
      } else {
        /* istanbul ignore next */
        elements[i].onclick = function () {
          that.reset('onload');
        };
      }
    }
  }
}
