import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { deviceProviders } from './device.providers';
import { DeviceTypeModule } from '../device-type/device-type.module';

@Module({
    imports: [DeviceTypeModule],
    providers: [DeviceService, ...deviceProviders],
    exports: [DeviceService],
})
export class DeviceModule {}
