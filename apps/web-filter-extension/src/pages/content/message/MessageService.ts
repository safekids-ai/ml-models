import { ChromeUtils } from '@src/shared/chrome/utils/ChromeUtils';

export type MessageService = {
    send: (message: any, callback?: any) => Promise<void>;
};

/**
 *
 */
export class ContentMessageService implements MessageService {
    constructor(private readonly chromeUtils: ChromeUtils) {}

    async send(message: any, callback: () => Promise<void>): Promise<void> {
        return await this.chromeUtils.sendMessage(message, callback);
    }
}
