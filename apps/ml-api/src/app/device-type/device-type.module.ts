import { Module } from '@nestjs/common';
import { DeviceTypeService } from './device-type.service';
import { deviceTypeProviders } from './device-type.providers';

@Module({
    providers: [DeviceTypeService, ...deviceTypeProviders],
    exports: [DeviceTypeService],
})
export class DeviceTypeModule {}
