import {ConsoleLogger} from '../../../../shared/logging/ConsoleLogger';
import {TextFilter} from './TextFilter';

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

describe('TextFilter test', () => {
  let textFilter: TextFilter;
  let logger = new ConsoleLogger();
  let nlpClasses = ['WEAPONS', 'PORN', 'PROXY', 'SELF_HARM', 'EDUCATIONAL', ''];
  beforeEach(() => {
    textFilter = new TextFilter(logger);
  });
  it('Should not analyze text when element is empty or text is empty', async () => {
    textFilter.setSettings({
      filterEffect: 'blur',
      analyzeLimit: 1,
      processLimit: 2,
      environment: 'development',
    });

    const dom = new JSDOM('<!DOCTYPE html>' + '<a id="a1" href="">');

    let element: HTMLElement = dom.window.document.getElementById('#a1');

    textFilter.analyze(element);

    const a: HTMLAnchorElement = dom.window.document.getElementById('a1');

    textFilter.analyze(a as HTMLAnchorElement);
  });

  it('Should analyze text', async () => {
    global.chrome = {
      // @ts-ignore
      runtime: {
        // @ts-ignore
        sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
          const response = {prediction: 'PORN', url: '../dom/image0.jpg', prrStatus: false};
          callback(response);
        }),
      },
    };
    textFilter.setSettings({
      filterEffect: 'blur',
      analyzeLimit: 2,
      processLimit: 5,
      environment: 'development',
      showClean: true,
    });

    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<body>' +
      '<div>' +
      '<div>' +
      '<h1>Heading</h1>' +
      '<h2>Heading Heading Heading Heading Heading Heading Heading</h2>' +
      '<h3></h3>' +
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s," +
      ' when an unknown printer took a galley of type and scrambled it to make a type specimen book. ' +
      'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ' +
      'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, ' +
      'and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>' +
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
      "Lorem Ipsum has been the industry's standard dummy </p>" +
      '<p>Letraset sheets containing Lorem Ipsum passages, ' +
      'and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>' +
      '</div>' +
      '<div>' +
      '<h3>sex videos this is ok</h3>' +
      '<h3>Fcuk you Fcuk you Fcuk you</h3>' +
      '<h3>This is suicide This is suicide This is suicid</h3>' +
      '<a href="ok.html">How to buy a new ak47 gun</a>' +
      '<p>How to buy a new speed gun my friends</p>' +
      '<p>How to sell a new speed gun my friends</p>' +
      '<p>How to find a new speed gun my friends</p>' +
      '<p>How to know a new speed gun my friends</p>' +
      '<p>How to get a new speed gun my friends</p>' +
      '<a href="ok.html">How to buy a new ak47 gun</a>' +
      '<a href="ok.html">How to buy a new ak47 gun</a>' +
      '<a href="ok.html">This is brunette sex I do</a>' +
      '</div>' +
      '</div>' +
      '</body>'
    );

    let elements = dom.window.document.querySelectorAll('h1,a,p,h3');

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      textFilter.analyze(element);
    }
  });

  it.each(nlpClasses)('Should analyze text as %s', async (nlp) => {
    global.chrome = {
      // @ts-ignore
      runtime: {
        // @ts-ignore
        sendMessage: jest.fn((request: any, callback: (response) => Promise<void>): void => {
          const response = {prediction: nlp, url: '../dom/image0.jpg', prrStatus: false};
          callback(response);
        }),
      },
    };
    textFilter.setSettings({
      filterEffect: 'blur',
      analyzeLimit: 2,
      processLimit: 2,
      environment: 'development',
      showClean: true,
    });

    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<div><h1>This is big text brunette sex and weapons</h1>' +
      '<div><a href="ok.html">This is brunette sex</a></div>' +
      '<h3></h3></div>'
    );

    let elements = dom.window.document.querySelectorAll('h1,a,p,h3');

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      textFilter.analyze(element);
    }
  });

  it('Should send error during prediction', async () => {
    global.chrome = {
      // @ts-ignore
      runtime: {
        // @ts-ignore
        sendMessage: jest.fn((request: any): void => {
        }),
      },
    };
    textFilter.setSettings({
      filterEffect: 'blur',
      analyzeLimit: 2,
      processLimit: 5,
      environment: 'development',
      showClean: true,
    });

    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<body>' +
      '<h2>Heading Heading Heading Heading Heading Heading Heading</h2>' +
      '<h3>Fcuk you Fcuk you Fcuk you</h3>' +
      '<h3>This is suicide This is suicide This is suicid</h3>' +
      '</body>'
    );

    let elements = dom.window.document.querySelectorAll('h1,h2,p,h3');

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      textFilter.analyze(element);
    }
  });
});
