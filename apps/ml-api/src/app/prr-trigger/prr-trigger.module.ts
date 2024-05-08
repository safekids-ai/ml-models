import { Module } from '@nestjs/common';
import { PrrTriggerService } from './prr-trigger.service';
import { prrTriggerProviders } from './prrtrigger.providers';

@Module({
    providers: [PrrTriggerService, ...prrTriggerProviders],
    exports: [PrrTriggerService],
})
export class PrrTriggerModule {}
