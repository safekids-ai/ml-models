import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { licenseProviders } from './license.providers';

@Module({
    providers: [LicenseService, ...licenseProviders],
    exports: [LicenseService],
})
export class LicenseModule {}
