import {DOMProcessor} from '@content/dom/DOMProcessor';

export interface DOMFilter {
  filter(element: HTMLElement): void;
}

export class DOMFilterFactory {
  private map = new Map<string, DOMFilter>();

  constructor() {
  }

  getDOMFilter(hostName: string): DOMFilter {
    let domeFilter: DOMFilter = this.map.get(hostName) as DOMFilter;
    if (!domeFilter) {
      switch (hostName) {
        case 'www.google.com':
          domeFilter = new GoogleDOMFilter();
          break;
        case 'www.youtube.com':
          domeFilter = new YoutubeDOMFilter();
          break;
        default:
          domeFilter = new DefaultDOMFilter();
          break;
      }
      this.map.set(hostName, domeFilter);
    }
    return domeFilter;
  }
}

export class DefaultDOMFilter implements DOMFilter {
  constructor() {
  }

  filter(element: HTMLElement): void {
    DOMProcessor.skipAdElements(element);
  }
}

export class GoogleDOMFilter implements DOMFilter {
  constructor() {
  }

  filter(element: HTMLElement): void {
    const tvCap = document.getElementById('tvcap');
    if (tvCap) {
      DOMProcessor.skipAdElements(tvCap);
    }
  }
}

export class YoutubeDOMFilter implements DOMFilter {
  constructor() {
  }

  filter(element: HTMLElement): void {
    const elements = element.querySelectorAll('.ytd-promoted-video-renderer,.ytd-promoted-sparkles-web-renderer,.ytd-item-section-renderer');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      let isAd = false;
      if (element?.tagName === 'SPAN') {
        if (element?.innerText?.toUpperCase() === 'AD' || element?.textContent?.toUpperCase() === 'AD') {
          isAd = true;
        }
      } else {
        const spans = element.getElementsByTagName('span');
        for (let i = 0; i < spans.length; i++) {
          if (spans[i]?.innerText?.toUpperCase() === 'AD' || spans[i]?.textContent?.toUpperCase() === 'AD') {
            isAd = true;
            break;
          }
        }
      }
      if (isAd) {
        let spans: any = element.getElementsByTagName('h3');
        for (let i = 0; i < spans.length; i++) {
          const element = spans[i] as HTMLElement;
          element.dataset.nlpStatus = 'skip';
        }
        spans = element.getElementsByTagName('a');
        for (let i = 0; i < spans.length; i++) {
          const element = spans[i] as HTMLElement;
          element.dataset.nlpStatus = 'skip';
        }

        spans = element.getElementsByTagName('img');
        for (let i = 0; i < spans.length; i++) {
          const element = spans[i] as HTMLElement;
          element.dataset.nsfkStatus = 'skip';
        }
      }
    }
  }
}
