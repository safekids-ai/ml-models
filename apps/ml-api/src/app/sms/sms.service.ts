import { LoggingService } from '../logger/logging.service';
import { ConfigService} from '@nestjs/config';
import { Inject } from '@nestjs/common';

export interface SmsServiceInterface {
    sendMessage(phoneNumber: string, message: string): Promise<void>;
}

export class SmsService {
    constructor(
        private readonly config: ConfigService,
        private readonly log: LoggingService,
        @Inject('SmsImplementation') private readonly impl: SmsServiceInterface
    ) {
        this.log.className(SmsService.name);
    }

    async sendMessage(phoneNumber: string, message: string): Promise<void> {
        await this.impl.sendMessage(phoneNumber, message);
    }

    static notificationTemplate = (kidName: string, category: string, notificationUrl: string): string => {
        return (
            `${kidName} triggered our system because of ${category} and may need your help.` +
            `Please check-in here ${notificationUrl} to acknowledge the interaction.` +
            `You will continue to get these notifications until someone checks-in. Thank you.`
        );
    };
}
