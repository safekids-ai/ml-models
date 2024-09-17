import {ConsoleLogger} from '../../../../shared/logging/ConsoleLogger';
import {DOMProcessor} from './DOMProcessor';
import {DOMWatcher} from './DOMWatcher';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {ImageFilter} from '../filter/ImageFilter';
import {TextFilter} from '../filter/TextFilter';
import {DOMFilterFactory} from './DOMFilterFactory';
import {ContentFilterUtil} from '../../../../shared/utils/content-filter/ContentFilterUtil';
import {HttpUtils} from '../../../../shared/utils/HttpUtils';

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

describe('Test DOMWatcher', () => {
  const logger = new ConsoleLogger();
  const store = TestUtils.buildProcessLimitSetting();
  const imageFilter: ImageFilter = new ImageFilter(logger);
  const textFilter: TextFilter = new TextFilter(logger);
  const domFilterFactory = new DOMFilterFactory();
  const contentFilterUtils: ContentFilterUtil = new ContentFilterUtil(store, logger);

  it('Should skip host', async () => {
    const host = 'www.google.edu';
    const skipSpy = jest.spyOn(HttpUtils, 'getDomain').mockReturnValue('google.edu');
    const contentFilterUtilsSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValue(true);
    const domFilter = domFilterFactory.getDOMFilter(host);
    const dom = new JSDOM('<!DOCTYPE html>');
    let domWatcher = new DOMWatcher(dom, host, logger, store, imageFilter, textFilter, domFilter, contentFilterUtils);

    domWatcher.watch();

    domWatcher.reset('onload');
  });

  it('Should reset and analyze images and texts onload', async () => {
    const host = 'www.google.com';

    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<body>' +
      '<div>' +
      '<div>' +
      '<h1>Heading</h1>' +
      '<h2>Heading Heading Heading Heading Heading Heading Heading</h2>' +
      '<button type="submit" id="n"></button>' +
      '<button id="n"></button>' +
      '<input type="submit" id="ip">s</input>' +
      '<input type="email" id="n">s</input>' +
      '<p>Letraset sheets containing Lorem Ipsum passages, ' +
      'and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>' +
      '</div>' +
      '<div>' +
      '<a><h3>Fcuk you Fcuk you Fcuk you</h3></a>' +
      '<h3>This is suicide This is suicide This is suicid</h3>' +
      '<h3>This is ak47 weapons</h3>' +
      '<a href="ok.html">How to buy a new ak47 gun</a>' +
      '<img id="img1"  height="204" width="240" src="/image0.jpg">' +
      '<img id="img6" height="150" width="100" data-original="//dom/image3.jpg" src="//dom/image3.jpg">' +
      '</div>' +
      '</div>' +
      '</body>'
    );

    const images = ['image1.jpg', 'image2.png'];
    const domHelperSpy = jest.spyOn(DOMProcessor, 'getBackgroundImages').mockReturnValue(images);
    const imageFilterSpy = jest.spyOn(imageFilter, 'analyzeImage').mockImplementation(() => {
    });
    const textFilterSpy = jest.spyOn(textFilter, 'analyze').mockImplementation(() => {
    });

    const skipSpy = jest.spyOn(HttpUtils, 'getDomain').mockReturnValue('google.com');
    const contentFilterUtilsSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValue(false);

    const domFilter = domFilterFactory.getDOMFilter(host);

    let domWatcher = new DOMWatcher(dom.window.document, host, logger, store, imageFilter, textFilter, domFilter, contentFilterUtils);

    domWatcher.reset('onload');

    expect(skipSpy).toBeCalledTimes(1);
  });

  it('Should watch changes and analyze images and texts onload', async () => {
    const host = 'www.youtube.com';
    const mainElement =
      '<!DOCTYPE html>' +
      '<head>' +
      '<style>' +
      '.ytd-promoted-video-renderer {\n' +
      '  background-image: url("image.jpg");\n' +
      '}\n' +
      '.ytd-promoted-sparkles-web-renderer {\n' +
      '  display: block;\n' +
      '}\n' +
      '.ytd-item-section-renderer {\n' +
      '  color: blue\n' +
      '}' +
      '</style></head>' +
      '<body>' +
      '<div id="parent" lang="ar" >' +
      '<div style="background-image: url(\'image1.jpg\');">AD</div>' +
      "<span class='ytd-item-section-renderer'>AD</span>" +
      "<div class='ytd-promoted-sparkles-web-renderer'><a id='a1'><span >AD</span>" +
      "<img src='image.jpg' /> " +
      '</a></div>' +
      "<a class='ytd-promoted-video-renderer'><h3>Heading</h3><span>AD</span></a>" +
      "<a class='ytd-item-section-renderer' href='http://localhost'></a>" +
      "<h3 class='ytd-item-section-renderer'>Heading</h3>" +
      "<img class='ytd-item-section-renderer' src='image.jpg'/>" +
      "<img class='ytd-promoted-video-renderer' src='image.jpg'/>" +
      "<img class='ytd-item-section-renderer' src='image.jpg'/>" +
      '<div>' +
      '<h1>Heading</h1>' +
      '<h2>Heading Heading Heading Heading Heading Heading Heading</h2>' +
      '<button type="submit" id="n"></button>' +
      '<button id="button1"></button>' +
      '<input type="submit" id="submitType">s</input>' +
      '<input type="email" id="emailType">s</input>' +
      '<p>Letraset sheets containing Lorem Ipsum passages, ' +
      'and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>' +
      '</div>' +
      '<div>' +
      '<a>' +
      '<h3 id="h31">Fcuk you Fcuk you Fcuk you</h3>' +
      '<h3 id="h32">This is suicide This is suicide This is suicid</h3>' +
      '<a href="ok.html">How to buy a new ak47 gun</a></a>' +
      '<img id="img1"  height="204" width="240" src="/image0.jpg">' +
      '<img id="img6" height="150" width="100" data-original="//dom/image3.jpg" src="//dom/image3.jpg">' +
      '</div>' +
      '</div>';
    const dom = new JSDOM(mainElement);

    const images = ['image1.jpg', 'image2.png'];
    const domHelperSpy = jest.spyOn(DOMProcessor, 'getBackgroundImages').mockReturnValue(images);
    const imageFilterSpy = jest.spyOn(imageFilter, 'analyzeImage').mockImplementation(() => {
    });
    const textFilterSpy = jest.spyOn(textFilter, 'analyze').mockImplementation(() => {
    });

    const skipSpy = jest.spyOn(HttpUtils, 'getDomain').mockReturnValue('google.com');
    const contentFilterUtilsSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValue(false);

    const domFilter = domFilterFactory.getDOMFilter(host);

    let domWatcher = new DOMWatcher(document, host, logger, store, imageFilter, textFilter, domFilter, contentFilterUtils);

    domWatcher.watch();

    setTimeout(function () {
    }, 3000);

    const node = document.createElement('div');
    node.innerHTML = mainElement;
    const parent = document.body;
    parent.appendChild(node);

    const element = document.getElementById('img1');
    element?.setAttribute('height', '200');

    let keyDown = new KeyboardEvent('keydown', {key: '13', keyCode: 13});
    let keyUp = new KeyboardEvent('keydown', {key: '13', keyCode: 13});

    let emailType = document.getElementById('emailType');
    emailType?.dispatchEvent(keyDown);

    emailType = document.getElementById('emailType');
    emailType?.dispatchEvent(keyUp);

    const button = dom.window.document.getElementById('button1');
    button?.click();

    const h3s = dom.window.document.getElementsByTagName('img');
    for (let i = 0; i < h3s.length; i++) {
      h3s[i].setAttribute('src', '//image.png');
      h3s[i].setAttribute('data-src', '//image.png');
      h3s[i].src = '//image.png';
    }

    const elements = dom.window.document.querySelector('#parent');
    domWatcher.filterElements(elements);

    domWatcher.checkAttributeMutation(dom.window.document.getElementById('img1'));
  });
});
