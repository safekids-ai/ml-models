import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { statusProviders } from './status.providers';

@Module({
    providers: [StatusService, ...statusProviders],
    exports: [StatusService],
})
export class StatusModule {}
