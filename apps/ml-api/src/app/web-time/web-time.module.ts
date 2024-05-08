import { Module } from '@nestjs/common';
import { WebTimeService } from './web-time.service';
import { WebTimeController } from './web-time.controller';
import { webTimeProviders } from './webtime.providers';

@Module({
    controllers: [WebTimeController],
    providers: [WebTimeService, ...webTimeProviders],
    exports: [WebTimeService],
})
export class WebTimeModule {}
