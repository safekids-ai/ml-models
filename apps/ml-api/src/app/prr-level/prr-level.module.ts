import { Module } from '@nestjs/common';
import { PrrLevelService } from './prr-level.service';
import { prrLevelProviders } from './prrlevel.providers';

@Module({
    providers: [PrrLevelService, ...prrLevelProviders],
    exports: [PrrLevelService],
})
export class PrrLevelModule {}
