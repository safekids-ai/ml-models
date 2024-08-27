import {LoggingService} from '../logger/logging.service';
import {ConfigService} from '@nestjs/config';

export abstract class SmsService {
  abstract sendMessage(phoneNumber: string, message: string): Promise<void>;

  static notificationTemplate = (kidName: string, category: string, notificationUrl: string): string => {
    return (
      `${kidName} triggered our system because of ${category} and may need your help.` +
      `Please check-in here ${notificationUrl} to acknowledge the interaction.` +
      `You will continue to get these notifications until someone checks-in. Thank you.`
    );
  };
}
