export class DOMProcessor {
  constructor() {
  }

  static getBackgroundImages = (element: Element, max?: number) => {
    const divs = element.querySelectorAll('div');
    const bgImages = [];
    const size = divs.length;
    for (let i = 0; i < size; i++) {
      let bi = null;
      if (!!divs[i] && divs[i].style.backgroundImage) {
        bi = divs[i].style.backgroundImage;
      } else {
        try {
          // @ts-ignore
          let style = window.getComputedStyle(divs[i], false);
          if (style) {
            bi = style.backgroundImage;
          }
        } catch (e) {
          throw new Error(`Failed to get background style.`);
        }
      }

      if (bi) {
        bi = bi.slice(4, -1).replace(/"/g, '');
        bgImages.push(bi);
      }
    }
    return bgImages;
  };

  static skipAdElements = (htmlElement: Element): undefined | Element[] => {
    if (htmlElement == null) return;

    if (htmlElement.children.length === 0) return [htmlElement];

    const allChildElements = [];

    for (let i = 0; i < htmlElement.children.length; i++) {
      if (htmlElement.children[i].tagName === 'A' || htmlElement.children[i].tagName === 'H3') {
        const elem = htmlElement.children[i] as HTMLElement;
        elem.dataset.nlpStatus = 'skip';
      } else {
        const children = this.skipAdElements(htmlElement.children[i]);
        if (children) allChildElements.push(...children);
      }
    }
    return allChildElements;
  };
}
