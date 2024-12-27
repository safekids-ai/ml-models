import {ConsoleLogger} from '../../../../shared/logging/ConsoleLogger';
import {DOMProcessor} from './DOMProcessor';
import {DefaultDOMFilter, DOMFilterFactory, GoogleDOMFilter, YoutubeDOMFilter} from './DOMFilterFactory';

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

describe('Test DOMFilterFactory', () => {
  let domFilterFactory: DOMFilterFactory;
  let logger = new ConsoleLogger();

  beforeEach(() => {
    domFilterFactory = new DOMFilterFactory();
  });
  it('Should return GoogleDOMFilter with host google.com', () => {
    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<head>' +
      '<body>' +
      '<div id="tvcap" lang="ar" >' +
      '<div style="background-image: url(\'image1.jpg\');">OK</div>' +
      '</div>' +
      '</body>'
    );
    const element = dom.window.document.querySelector('#parent');

    const factory = domFilterFactory.getDOMFilter('www.google.com');
    factory.filter(element);

    expect(factory instanceof GoogleDOMFilter).toBeTruthy();
  });

  it('Should return YoutubeDOMFilter with host youtube.com', () => {
    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<head><style>' +
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
      '</div>' +
      '</body>'
    );

    const factory = domFilterFactory.getDOMFilter('www.youtube.com');
    expect(factory instanceof YoutubeDOMFilter).toBeTruthy();

    const element = dom.window.document.querySelector('#parent');
    factory.filter(element);
  });
  it('Should return DefaultDOMFilter with host facebook.com', () => {
    const dom = new JSDOM('<!DOCTYPE html>' + '<head></head>' + '<body>' + '<div id="parent" lang="ar" ></div></body>');

    const factory = domFilterFactory.getDOMFilter('www.facebook.com');
    expect(factory instanceof DefaultDOMFilter).toBeTruthy();
    const element = dom.window.document.querySelector('#a');
    factory.filter(element);
  });
});
