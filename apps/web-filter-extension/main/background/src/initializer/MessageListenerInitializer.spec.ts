import {mock} from 'ts-mockito';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {MessageListenerInitializer} from './MessageListenerInitializer';
import {BackgroundMessageListener} from '../listener/message/BackgroundMessageListener';
import {Initializer} from './Initializer';
import {ChromeHelperFactory} from '@shared/chrome/factory/ChromeHelperFactory';

describe('MessageListenerInitializer test', () => {
  let instance: Initializer;
  const logger = new ConsoleLogger();
  const messageListener = mock(BackgroundMessageListener);
  global.chrome = {
    runtime: {
      // @ts-ignore
      onMessage: {
        addListener: jest.fn(() => Promise.resolve()),
      },
    },
  };

  beforeEach(() => {
    instance = new MessageListenerInitializer(logger, messageListener);
  });

  it('should create instance of MessageListenerInitializer ', async () => {
    const result = await instance.init();
    expect(result).toBeTruthy();
  });
});
