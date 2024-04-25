import { Module } from '@nestjs/common';
import { emailEventTypeProviders } from './email-event.providers';
import { EmailEventTypeService } from './email-event-type.service';

@Module({
    providers: [EmailEventTypeService, ...emailEventTypeProviders],
    exports: [EmailEventTypeService],
})
export class EmailEventTypeModule {}
