import { Module } from '@nestjs/common';
import { EmailEventConfigService } from './email-event-config.service';
import { EmailEventConfigController } from './email-event-config.controller';
import { emailEventConfigProviders } from './email-event-config.providers';

@Module({
    controllers: [EmailEventConfigController],
    providers: [EmailEventConfigService, ...emailEventConfigProviders],
    exports: [EmailEventConfigService],
})
export class EmailEventConfigModule {}
