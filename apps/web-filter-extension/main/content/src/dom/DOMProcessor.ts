
export class DOMProcessor {
  constructor() {
  }

  //
  // static getImageTags = (element: HTMLElement) => {
  //   const imagesWithTag = [...element.getElementsByTagName('img')] as HTMLImageElement[];
  //   if (imagesWithTag) {
  //     return imagesWithTag.map(tag => )
  //   }
  // }

  // static async getBackgroundImages(max: number) : Promise<void> {
  //   const imageInfoList = [];
  //   const elementsWithBackground = document.querySelectorAll("div, section, article");
  //
  //   for (const element of elementsWithBackground) {
  //     let backgroundImage;
  //     try {
  //       const style = window.getComputedStyle(element);
  //       backgroundImage = style.backgroundImage;
  //     } catch (error) {
  //       console.warn("Failed to get computed style for element:", element, error);
  //       continue;
  //     }
  //
  //     if (backgroundImage && backgroundImage.startsWith("url(")) {
  //       const url = backgroundImage.slice(5, -2).replace(/"/g, ""); // Clean up the URL
  //
  //       try {
  //         const imageInfo = await fetchImageData(url);
  //         if (imageInfo) {
  //           imageInfoList.push({
  //             elementType: "background",
  //             src: url,
  //             ...imageInfo
  //           });
  //
  //           // Limit the number of images processed
  //           if (imageInfoList.length >= max) break;
  //         }
  //       } catch (error) {
  //         console.error("Failed to fetch image data:", url, error);
  //       }
  //     }
  //   }
  //
  //   return imageInfoList;
  // }

  // static getBackgroundImages = (element: Element, max?: number) => {
  //   const divs = element.querySelectorAll('div');
  //   const bgImages = [];
  //   const size = divs.length;
  //   for (let i = 0; i < size; i++) {
  //     let bi = null;
  //     if (!!divs[i] && divs[i].style.backgroundImage) {
  //       bi = divs[i].style.backgroundImage;
  //     } else {
  //       try {
  //         // @ts-ignore
  //         let style = window.getComputedStyle(divs[i], false);
  //         if (style) {
  //           bi = style.backgroundImage;
  //         }
  //       } catch (e) {
  //         throw new Error(`Failed to get background style.`);
  //       }
  //     }
  //
  //     if (bi) {
  //       bi = bi.slice(4, -1).replace(/"/g, '');
  //       bgImages.push(bi);
  //     }
  //   }
  //   return bgImages;
  // };


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
