import { Module } from '@nestjs/common';
import { EmailEventService } from './email-event.service';
import { emailEventProviders } from './email-event.providers';
import { LoggingModule } from '../logger/logging.module';
import { UserModule } from '../user/user.module';
import { EmailEventConfigModule } from '../email-event-config/email-event-config.module';
import {QueueModule} from "../queue/queue.module";
import {BullModule} from "@nestjs/bullmq";

@Module({
    imports: [
      LoggingModule,
      UserModule,
      EmailEventConfigModule,
      QueueModule,
      BullModule.registerQueue({
        name: 'email-event-queue',
      }),
    ],
    providers: [EmailEventService, ...emailEventProviders],
    exports: [EmailEventService],
})
export class EmailEventModule {}
