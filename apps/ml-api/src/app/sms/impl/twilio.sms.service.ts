import {SmsServiceInterface} from '../sms.service';
import {Injectable} from '@nestjs/common';
import {LoggingService} from '../../logger/logging.service';
import retry from 'async-retry';
import {ConfigService} from '@nestjs/config';
import TWILIO from 'twilio';
import {TwilioConfig} from "apps/ml-api/src/app/config/twilio.sms";

const {Twilio} = TWILIO

@Injectable()
export class TwilioSmsService implements SmsServiceInterface {
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly twilioPhoneNumber: string;
  private readonly retryOptions;

  constructor(
    private readonly config: ConfigService,
    private readonly log: LoggingService
  ) {
    this.log.className(TwilioSmsService.name);
    const smsConfig = config.get<TwilioConfig>('twilioConfig');
    this.retryOptions = smsConfig.retryOptions;
    this.accountSid = smsConfig.accountSid;
    this.authToken = smsConfig.authToken;
    this.twilioPhoneNumber = smsConfig.phoneNumber;
    this.log.debug('Twilio SMS configuration', {
      accountSid: this.accountSid,
      authToken: this.authToken,
      twilioPhoneNumber: this.twilioPhoneNumber,
      retryOptions: this.retryOptions,
    });

    if (!(this.accountSid && this.authToken && this.twilioPhoneNumber)) {
      throw new Error('Please provide proper env variables for Twilio SMS service');
    }
  }

  async sendMessage(phoneNumber: string, message: string): Promise<void> {
    const client = new Twilio(this.accountSid, this.authToken);

    this.log.debug('TwilioSmsService sending message', {phoneNumber, message});

    try {
      const result = await retry(
        async (bail) => {
          try {
            client.messages
              .create({
                body: message,
                to: phoneNumber,
                from: this.twilioPhoneNumber,
              })
              .then((message) => {
                this.log.info(`Twilio SMS ${message.sid} successfully sent to ${phoneNumber}`);
              });
          } catch (error) {
            if (error.retryable === false) {
              bail(error);
            } else {
              throw error;
            }
          }
        },
        {
          ...this.retryOptions,
          onRetry: (error: Error) => {
            this.log.warn('Twilio SMS Service OnRetry - retrying SMS message due to', error);
          },
        }
      );
      return result;
    } catch (error) {
      this.log.error('Twilio SMS Service. Unable to send SMS message', error);
    }
  }
}
