import { ContentMessageService } from '../../../../../src/pages/content/message/MessageService';
import { ChromeUtils } from '../../../../../src/shared/chrome/utils/ChromeUtils';
import { LocalStorageManager } from '../../../../../src/shared/chrome/storage/ChromeStorageManager';
import { ConsoleLogger, Logger } from '../../../../../src/shared/logging/ConsoleLogger';

describe('ContentMessageService test', () => {
    let service: ContentMessageService;
    const logger: Logger = new ConsoleLogger();
    let localStorageManager = new LocalStorageManager();

    const chromeMessage = new ChromeUtils(logger, localStorageManager);

    beforeEach(() => {
        service = new ContentMessageService(chromeMessage);
    });
    it('Should not trigger prr if prr already triggered for tab', async () => {
        jest.spyOn(chromeMessage, 'sendMessage').mockImplementation(async (message: any, callback?: () => void): Promise<void> => {
            if (callback != null) {
                callback();
            }
        });
        //given
        const message = { type: 'CHECK_HOST' };
        const callback = jest.fn(async () => {});

        //when
        await service.send(message, callback);

        //then
        expect(callback).toBeCalledTimes(1);
    });
});
