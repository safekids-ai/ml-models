export class ImageUtils {
    public static sort(images: HTMLCollectionOf<HTMLImageElement>) {
        const imageDimensions = [];
        for (let i = 0; i < images.length && !!images[i].src; i++) {
            imageDimensions.push({ dimension: images[i].width * images[i].height, image: images[i] });
        }
        imageDimensions.sort((a, b) => b.dimension - a.dimension);
        const newList: HTMLImageElement[] = [];
        imageDimensions.forEach((value) => {
            newList.push(value.image);
        });
        return newList;
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
    static byteArrayToImageData = async (byteArray: Uint8Array, imageType: string): Promise<ImageData | ''> => {
        const blob = new Blob([byteArray], { type: imageType });
        const bitmap = await createImageBitmap(blob);
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(bitmap, 0, 0);
        const ctxData = ctx?.getImageData(0, 0, bitmap.width, bitmap.height) || '';
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
