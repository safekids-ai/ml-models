import { DynamicModule, Global, Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { LoggingModule } from '../logger/logging.module';
import { LoggingService } from '../logger/logging.service';
import {ConfigService} from "@nestjs/config";
import {EmailService} from "../email/email.service";
import {PostmarkEmailService} from "../email/postmark/postmark.email.service";
import {TwilioSmsService} from "./impl/twilio.sms.service";

@Global()
@Module({
    imports: [],
    providers: [
      ConfigService,
      {
        provide: SmsService,
        useClass: TwilioSmsService
      },
    ],
    exports: [SmsService],
})
export class SmsModule {}
