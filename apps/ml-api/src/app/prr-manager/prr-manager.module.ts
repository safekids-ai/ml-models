import { Module } from '@nestjs/common';
import { PrrManagerService } from './prr-manager.service';
import { PrrManagerController } from './prr-manager.controller';

@Module({
    controllers: [PrrManagerController],
    providers: [PrrManagerService],
})
export class PrrManagerModule {}
