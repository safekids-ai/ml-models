import {DOMEventHandler} from './DOMEventHandler';

const jsdom = require('jsdom');
const {JSDOM} = jsdom;
describe('Test DOM Event Handler', () => {
  it('Should handle dom event', () => {
    global.chrome = {
      // @ts-ignore
      runtime: {
        // @ts-ignore
        sendMessage: jest.fn(),
      },
    };
    const dom = new JSDOM(
      '<!DOCTYPE html>' +
      '<body>' +
      '<div id="parent" lang="ar" >' +
      "<a href='https://poodle.com'>submit</a>" +
      "<a href='another.com'><h3>" +
      'another-text</h3></a>' +
      '</div>' +
      '</body>'
    );

    DOMEventHandler.registerEvent('www.google.com', null);

    const allAnchors = dom.window.document.getElementsByTagName('a');
    DOMEventHandler.registerEvent('www.google.com', allAnchors);

    for (let i = 0; i < allAnchors.length; i++) {
      const anchor = allAnchors[i];
      anchor.click();
    }
  });

  it('Should handle enter event', () => {
    const callback = jest.fn();
    let event = new KeyboardEvent('Enter', {key: '13', keyCode: 13});

    DOMEventHandler.handleEnterEvent(event, callback);

    expect(callback).toBeCalled();
  });
});
