import { Module } from '@nestjs/common';
import { EmailEventService } from './email-event.service';
import { emailEventProviders } from './email-event.providers';
import { LoggingModule } from '../logger/logging.module';
import { UserModule } from '../user/user.module';
import { EmailEventConfigModule } from '../email-event-config/email-event-config.module';

@Module({
    imports: [LoggingModule, UserModule, EmailEventConfigModule],
    providers: [EmailEventService, ...emailEventProviders],
    exports: [EmailEventService],
})
export class EmailEventModule {}
