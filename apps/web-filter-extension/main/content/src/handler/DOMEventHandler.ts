import {HttpUtils} from '@shared/utils/HttpUtils';
import {EventType} from '@shared/types/message_types';

export class DOMEventHandler {
  static registerEvent = (host: string = window.location.host, allAnchors: any | undefined) => {
    if (!allAnchors) {
      return;
    }
    const {isGoogle} = HttpUtils.identifyHost(host);
    for (let i = 0; i < allAnchors.length; i++) {
      let title: string | null = '';
      if (isGoogle) {
        for (let j = 0; j < allAnchors[i].children.length; j++) {
          if (allAnchors[i].children[j].tagName === 'H3') {
            title = allAnchors[i].children[j].textContent;
            break;
          }
        }
      }
      const anchor = allAnchors[i];
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      title = title + anchor.title;
      if (title === '') {
        title = !!allAnchors[i].innerText ? allAnchors[i].innerText : allAnchors[i].textContent;
      }

      if (title !== '') {
        const anchor: any = {};
        anchor.type = 'process.anchor';
        anchor.keyword = title;
        allAnchors[i].onclick = function () {
          const request = {
            type: EventType.TITLE_CLICK,
            title,
            href: allAnchors[i].href,
            host: allAnchors[i].host,
          };
          chrome.runtime.sendMessage(request);
        };
      }
    }
  };

  static handleEnterEvent = (e: any, callback: any) => {
    if (!e) e = window.event;
    if (e) {
      const keyCode = e.key || e.code;
      if (keyCode === 'Enter' || e.keyCode === 13) {
        if (callback) {
          callback();
        }
      }
    }
  };
}
