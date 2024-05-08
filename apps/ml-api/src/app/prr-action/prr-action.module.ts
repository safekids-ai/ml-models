import { Module } from '@nestjs/common';
import { PrrActionService } from './prr-action.service';
import { prrActionProviders } from './prr-action.providers';

@Module({
    providers: [PrrActionService, ...prrActionProviders],
    exports: [PrrActionService],
})
export class PrrActionModule {}
