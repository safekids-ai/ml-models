import { ImageFilter } from '../../../../src/pages/content/filter/ImageFilter';
import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('ImageFilter test', () => {
    let imageFilter: ImageFilter;
    let logger = new ConsoleLogger();

    beforeEach(() => {
        imageFilter = new ImageFilter(logger);
    });

    it('Should not analyze image if counter exceeds analyze limit', async () => {
        imageFilter.setSettings({
            filterEffect: 'blur',
            analyzeLimit: 1,
            processLimit: 2,
            environment: 'development',
        });

        const dom = new JSDOM('<!DOCTYPE html>' + '<img id="img1" height="2560" width="1898" src="../dom/image.jpg">');
        const image: HTMLImageElement = dom.window.document.querySelector('#img1');
        imageFilter.analyzeImage(image);
    });

    it('Should not analyze image if Prr is already triggered', async () => {
        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
                    const response = { prediction: 'PORN', url: 'image0.jpg', prrStatus: true };
                    callback(response);
                }),
            },
        };
        imageFilter.setSettings({
            filterEffect: 'blur',
            analyzeLimit: 2,
            processLimit: 2,
            environment: 'development',
        });

        const dom = new JSDOM('<!DOCTYPE html>' + '<img id="img1" height="2560" width="1898" src="image0.jpg">');
        const image: HTMLImageElement = dom.window.document.querySelector('#img1');
        imageFilter.analyzeImage(image);
    });

    it('Should analyze image and blur image if prediction is true', async () => {
        // set settings of image filter
        imageFilter.setSettings({
            filterEffect: 'blur',
            analyzeLimit: 10,
            processLimit: 2,
            environment: 'development',
        });

        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
                    if (request.value.url && request.value.url === 'http://localhost//dom/image3.jpg') {
                        imageFilter.reset(request.value.url);
                        throw new Error('New Dummy Error.');
                    } else if (request.value.url && request.value.url === 'http://localhost//dom/image4.jpg') {
                        imageFilter.reset(request.value.url);
                        throw new Error('New Dummy Error.');
                    }
                    const response = { prediction: 'PORN', url: '../dom/dummy.jpg', prrStatus: false };
                    callback(response);
                }),
            },
        };

        const bitmapImage =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAANlBMVEX///8AAACcnJz4+PjX19c8PDxqamrt7e1UVFTf39+MjIzU1NSzs7NJSUmWlpb7+/teXl6/v7+zr/B8AAAAhElEQVR4nO3QtxGEQBAAQQ6t/8k/WQpwcLF2je4IpqaqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIq2miC7Jpu1J6V96GchmjM1Kp7ydliu7IZH6eLNEdmazPkyG6I5XtWrJHV+Tyq//9ER0BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfnCWcAMtCFcL3AAAAAElFTkSuQmCC';
        const dom = new JSDOM(
            '<!DOCTYPE html>' +
                '<img id="img1"  height="20" width="20" src="../dom/image0.jpg">' +
                '<img id="img1"  height="60" width="60" src="../dom/image.jpg">' +
                '<img id="img2" height="100" width="50" data-image="../dom/image.jpg" src="../dom/image.jpg">' +
                '<img id="img3" height="100" width="50" data-thumb_url="../dom/image1.jpg" src="dummy1.jpg">' +
                '<img id="img4" height="100" width="50" data-thumb_url="../dom/image2.jpg"  src="dummy2.jpg">' +
                '<img id="img5" height="100" width="50"  src="' +
                bitmapImage +
                '">' +
                '<img id="img6" height="150" width="100" data-original="//dom/image3.jpg" src="dummy3.jpg">' +
                '<img id="img6" height="150" width="100" data-original="//dom/image3.jpg" src="dummy3.jpg">' +
                '<img id="img6" height="150" width="100" data-original="//dom/image4.jpg" src="dummy3.jpg">'
        );
        const images = dom.window.document.getElementsByTagName('img');

        imageFilter.reset();

        for (let i = 0; i < images.length; i++) {
            const image = images[i] as HTMLImageElement;
            imageFilter.analyzeImage(image);
        }
    });
    it('Should analyze image and hide image if prediction is true', async () => {
        // set settings of image filter
        imageFilter.setSettings({
            filterEffect: 'hide',
            analyzeLimit: 10,
            processLimit: 2,
            environment: 'development',
        });

        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
                    const response = { prediction: 'PORN', url: '../dom/image0.jpg', prrStatus: false };
                    callback(response);
                }),
            },
        };

        const bitmapImage =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAANlBMVEX///8AAACcnJz4+PjX19c8PDxqamrt7e1UVFTf39+MjIzU1NSzs7NJSUmWlpb7+/teXl6/v7+zr/B8AAAAhElEQVR4nO3QtxGEQBAAQQ6t/8k/WQpwcLF2je4IpqaqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIq2miC7Jpu1J6V96GchmjM1Kp7ydliu7IZH6eLNEdmazPkyG6I5XtWrJHV+Tyq//9ER0BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfnCWcAMtCFcL3AAAAAElFTkSuQmCC';
        const dom = new JSDOM(
            '<!DOCTYPE html>' +
                '<img id="img1"  height="20" width="20" src="../dom/image0.jpg">' +
                '<img id="img5" height="100" width="50"  src="' +
                bitmapImage +
                '">'
        );

        const imagesList = dom.window.document.getElementsByTagName('img');

        imageFilter.reset();

        for (let i = 0; i < imagesList.length; i++) {
            const image = imagesList[i] as HTMLImageElement;
            imageFilter.analyzeImage(image);
        }
    });

    it('Should analyze image and show image if prediction is not done', async () => {
        // set settings of image filter
        imageFilter.setSettings({
            filterEffect: 'none',
            analyzeLimit: 10,
            processLimit: 2,
            environment: 'development',
        });

        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
                    const response = { prediction: undefined, url: request?.value?.url, prrStatus: false };
                    callback(response);
                }),
            },
        };

        const dom = new JSDOM(
            '<!DOCTYPE html>' +
                '<img id="img1"  height="20" width="20" src="../dom/image0.jpg">' +
                '<img id="img1"  height="20" width="20" src="../dom/image0.jpg">' +
                '<img id="img6" height="150" width="100" data-original="//dom/image3.jpg" src="//dom/image3.jpg">'
        );

        const images = dom.window.document.getElementsByTagName('img');

        imageFilter.reset();

        for (let i = 0; i < images.length; i++) {
            const image = images[i] as HTMLImageElement;
            imageFilter.analyzeImage(image);
        }
    });

    it('Should fail to analyze image when error occurred.', async () => {
        // set settings of image filter
        imageFilter.setSettings({
            filterEffect: 'none',
            analyzeLimit: 10,
            processLimit: 2,
            environment: 'development',
        });

        global.chrome = {
            // @ts-ignore
            runtime: {
                // @ts-ignore
                sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
                    const response = { prediction: undefined, url: request?.value?.url, prrStatus: false };
                    callback(response);
                }),
                lastError: new Error('this is error'),
            },
        };

        const dom = new JSDOM(
            '<!DOCTYPE html>' +
                '<img id="img1"  height="20" width="20" src="../dom/image0.jpg">' +
                '<img id="img6" height="150" width="100" data-original="//dom/image3.jpg" src="//dom/image3.jpg">'
        );

        const images = dom.window.document.getElementsByTagName('img');

        imageFilter.reset();

        for (let i = 0; i < images.length; i++) {
            const image = images[i] as HTMLImageElement;
            imageFilter.analyzeImage(image);
        }
    });
});
