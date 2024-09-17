import {ConsoleLogger} from '../../../../shared/logging/ConsoleLogger';
import {DOMProcessor} from './DOMProcessor';

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

function checkSkip(htmlElement: Element) {
  let total = 0;
  for (let i = 0; i < htmlElement.children.length; i++) {
    if (htmlElement.children[i].tagName === 'A' || htmlElement.children[i].tagName === 'H3') {
      const elem = htmlElement.children[i] as HTMLElement;
      if (elem.dataset.nlpStatus === 'skip') total++;
    } else {
      total = total + checkSkip(htmlElement.children[i]);
    }
  }
  return total;
}

describe('Test DOMProcessor', () => {
  it('Should return background Images', async () => {
    jest.spyOn(window, 'getComputedStyle').mockImplementation((element: Element, value: any): CSSStyleDeclaration => {
      const d = new CSSStyleDeclaration();
      d.backgroundImage = 'image.jpg';
      return d;
    });
    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<head><style>' +
      '.bg {\n' +
      '  background-image: url("image.jpg");\n' +
      '}</style></head>' +
      '<body>' +
      '<div id="parent" lang="ar" >' +
      '<div style="background-image: url(\'image1.jpg\');">OK</div>' +
      "<div id='bg1' class='bg'>Background</div>" +
      '</div>' +
      '</body>'
    );
    const htmlElement = dom.window.document.querySelector('#parent');
    const bgImages = DOMProcessor.getBackgroundImages(htmlElement, 10);
    expect(bgImages).toBeTruthy();
  });

  it('Should not return background Images', async () => {
    jest.spyOn(window, 'getComputedStyle').mockImplementation((element: Element, value: any): CSSStyleDeclaration => {
      const d = new CSSStyleDeclaration();
      return d;
    });
    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<head><style>' +
      '.bg {\n' +
      '  background-image: url("image.jpg");\n' +
      '}</style></head>' +
      '<body>' +
      '<div id="parent" lang="ar" >' +
      '<div style="background-image: url(\'image1.jpg\');">OK</div>' +
      '</div>' +
      '</body>'
    );
    const htmlElement = dom.window.document.querySelector('#parent');

    const bgImages = DOMProcessor.getBackgroundImages(htmlElement, 2);

    expect(bgImages).toBeTruthy();

    expect(bgImages.length).toEqual(1);
  });

  it('Should skip a nd h3 tags', async () => {
    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<div id="parent" lang="ar" >' +
      '<div>' +
      '<h3>New Heading</h3>' +
      '</div>' +
      '<div>NoAnAd</div>' +
      '<SPAN id="s3">' +
      '<div>' +
      '<a>Ad</a>' +
      '</div>' +
      '<div>NoAnAd</div>' +
      '</SPAN>' +
      '</div>'
    );
    const htmlElement = dom.window.document.querySelector('#parent');

    DOMProcessor.skipAdElements(htmlElement);

    const total: number = checkSkip(htmlElement);

    expect(total).toEqual(2);
  });
});
