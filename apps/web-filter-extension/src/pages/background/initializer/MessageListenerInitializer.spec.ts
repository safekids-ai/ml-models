import { mock } from 'ts-mockito';
import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { MessageListenerInitializer } from '../../../../src/pages/background/initializer/MessageListenerInitializer';
import { BackgroundMessageListener } from '../../../../src/pages/background/listener/message/BackgroundMessageListener';
import { Initializer } from '../../../../src/pages/background/initializer/Initializer';
import { ChromeHelperFactory } from '../../../../src/shared/chrome/factory/ChromeHelperFactory';

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
