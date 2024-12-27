import {DynamicModule, Global, Module} from '@nestjs/common';
import {LoggingModule} from '../logger/logging.module';
import {QueueModule} from "../queue/queue.module";
import {BullModule} from "@nestjs/bullmq";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PostmarkEmailService} from "./postmark/postmark.email.service";
import {PostmarkEmailTemplateService} from "./postmark/postmark.email.template.service";
import {EmailService} from "./email.service"
import {EmailTemplateService} from "./email.template.service";

@Global()
@Module({
  imports: [
    ConfigModule,
    QueueModule,
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  providers: [
    ConfigService,
    {
      provide: EmailService,
      useClass: PostmarkEmailService
    },
    {
      provide: EmailTemplateService,
      useClass: PostmarkEmailTemplateService
    },
  ],
  exports: [EmailService, EmailTemplateService],
})
export class EmailModule {
}
