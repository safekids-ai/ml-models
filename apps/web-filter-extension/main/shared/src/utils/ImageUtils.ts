export type ImageContent = {
  isBase64: boolean;
  src: string;
  imageType?: string;
  imageData?: Uint8Array;
  height?: number;
  width?: number;
  element?: HTMLElement;
}

export interface ImageHandler {
  process(image: ImageContent): Promise<void>;
  onError(image: ImageContent, error: any): Promise<void>;
}

export class ImageUtils {
  public static sort(images: ImageContent[]) {
    const imageDimensions = [];
    for (let i = 0; i < images.length && images[i].src; i++) {
      if (images[i].height && images[i].width) {
        imageDimensions.push({dimension: images[i].width * images[i].height, image: images[i]});
      }
    }
    imageDimensions.sort((a, b) => b.dimension - a.dimension);
    const newList: ImageContent[] = [];
    imageDimensions.forEach((value) => {
      newList.push(value.image);
    });
    return newList;
  }

  public static getImages(element: HTMLElement): ImageContent[] {
    const ret: ImageContent[] = [];
    const images = element.getElementsByTagName('img');
    for (const image of images) {
      const src = ImageUtils.getSource(image);
      if (src) {
        ret.push({isBase64: ImageUtils.isBase64(src), src, height: image.height, width: image.width, element: image});
      }
    }

    //get the background
    const elementsWithBackground = document.querySelectorAll("div, section, article");

    for (const elementWithBackground of elementsWithBackground) {
      let backgroundImage;
      try {
        const style = window.getComputedStyle(elementWithBackground);
        backgroundImage = style.backgroundImage;
      } catch (error) {
        console.warn("Failed to get computed style for element:", element, error);
        continue;
      }

      const htmlElement = elementWithBackground as HTMLElement;
      const elementWidth = htmlElement.offsetWidth;
      const elementHeight = htmlElement.offsetHeight;

      if (backgroundImage && backgroundImage.startsWith("url(")) {
        const src = backgroundImage.slice(5, -2).replace(/"/g, "");
        ret.push({
          isBase64: ImageUtils.isBase64(src),
          src,
          height: elementHeight,
          width: elementWidth,
          element: htmlElement
        });
      }
    }

    return ret;
  }

  public static async extractImageData(image: ImageContent): Promise<ImageContent> {
    const src = image.src;
    const imageMeta = {height: image.height, width: image.width};

    try {
      if (ImageUtils.isBase64(src)) {
        const imageType = src.substring(5, src.indexOf(";"));
        const base64 = src.split(",")[1];
        const binaryString = atob(base64);
        const imageData = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        return {...image, imageType, imageData};
      } else {
        try {
          const resp = await this.extractNoBase64Image(src);
          return {...image, ...resp};
        } catch (error) {
          console.error("Error fetching image data:", error);
          return null;
        }
      }
    } catch (error) {
      console.log("Unable to decode image:" + src);
      throw error;
    }
  }

  private static async extractNoBase64Image(src: string): Promise<ImageContent> {
    const response = await fetch(src, {cache: "force-cache"});
    const blob = await response.blob();
    const imageType = blob.type;
    const arrayBuffer = await blob.arrayBuffer();
    const imageData = new Uint8Array(arrayBuffer);
    return {isBase64: false, src, imageType, imageData};
  }

  public static sort_old(images: HTMLImageElement[] | HTMLCollectionOf<HTMLImageElement>) {
    const imageDimensions = [];
    for (let i = 0; i < images.length && !!images[i].src; i++) {
      imageDimensions.push({dimension: images[i].width * images[i].height, image: images[i]});
    }
    imageDimensions.sort((a, b) => b.dimension - a.dimension);
    const newList: HTMLImageElement[] = [];
    imageDimensions.forEach((value) => {
      newList.push(value.image);
    });
    return newList;
  }

  static convertDivToImageElement(divElement): HTMLImageElement {
    let backgroundImageUrl = '';

    // Check if the background image is set directly on the div
    if (divElement.style.backgroundImage) {
      backgroundImageUrl = divElement.style.backgroundImage;
    } else {
      // Otherwise, get computed style (handles inline styles or external CSS)
      const computedStyle = window.getComputedStyle(divElement);
      backgroundImageUrl = computedStyle.backgroundImage;
    }

    // Clean up the URL string to remove `url("...")` and get just the URL
    backgroundImageUrl = backgroundImageUrl.slice(4, -1).replace(/"/g, '');

    // Create a new HTMLImageElement and set the src to the background image URL
    const imgElement = new Image();
    imgElement.src = backgroundImageUrl;

    return imgElement;
  }

  static getSource(image: HTMLImageElement) {
    let src: string | null = null;
    src = image.getAttribute('data-src');
    if (!src) {
      src = image.getAttribute('data-image');
    }
    if (!src) {
      src = image.getAttribute('data-thumb_url');
    }
    if (!src) {
      src = image.getAttribute('data-original');
    }

    let imgSource = src ?? image.src;
    if (!imgSource.startsWith('data:') && imgSource.match(/.(jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp|gif|avif|apng)$/i) != null) {
      try {
        // eslint-disable-next-line no-new
        new URL(imgSource);
      } catch (e) {
        imgSource = window.location.origin + imgSource;
      }
    } else if (!imgSource.startsWith('data:') && imgSource.startsWith('//')) {
      imgSource = window.location.protocol + imgSource;
    }
    return imgSource;
  }

  static isBase64(url: string) {
    if (url.startsWith('data:')) {
      return true;
    }
    return false;
  }

  /* istanbul ignore next */
  static byteArrayToImageData = async (byteArray: Uint8Array, imageType: string,
                                       targetWidth?: number,
                                       targetHeight?: number): Promise<ImageData | ''> => {

    const blob = new Blob([byteArray], {type: imageType});
    const bitmap = await createImageBitmap(blob);

    // Set the canvas size to the target dimensions, or use the bitmap's size if not provided
    const width = targetWidth ?? bitmap.width;
    const height = targetHeight ?? bitmap.height;
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw and resize the bitmap to the specified width and height
    ctx?.drawImage(bitmap, 0, 0, width, height);

    // Use the target dimensions to get the resized image data
    const ctxData = ctx?.getImageData(0, 0, width, height) || '';
    return ctxData;
  };

  static base64ToByteArray(url: string): Uint8Array {
    const byteCharacters = atob(url.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  }
}
