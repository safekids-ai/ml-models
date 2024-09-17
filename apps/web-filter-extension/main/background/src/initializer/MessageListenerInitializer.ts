import {MessageTypes} from '@shared/types/message_types';
import {MessageListener} from '../listener/message/BackgroundMessageListener';

import {Initializer} from './Initializer';
import {Logger} from '@shared/logging/ConsoleLogger';

export class MessageListenerInitializer implements Initializer {
  constructor(private logger: Logger, private readonly messageListener: MessageListener) {
  }

  init = async (): Promise<boolean> => {
    /* istanbul ignore next */
    chrome.runtime.onMessage.addListener((message: MessageTypes, sender, callback: (value: any) => void) => {
      this.messageListener
        .onMessage(message, sender, callback)
        .then((response) => {
          callback(response);
        })
        .catch((e) => {
          this.logger.error(`Failed while serving request. Error: ${e}`);
        });
      return true;
    });

    //init done
    return true;
  };
}
