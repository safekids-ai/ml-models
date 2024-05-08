import { Module } from '@nestjs/common';
import { NonSchoolDaysConfigService } from './non-school-days-config.service';
import { NonSchoolDaysConfigController } from './non-school-days-config.controller';
import { nonSchoolDaysConfigProviders } from './non-school-days-config.providers';

@Module({
    controllers: [NonSchoolDaysConfigController],
    providers: [NonSchoolDaysConfigService, ...nonSchoolDaysConfigProviders],
    exports: [NonSchoolDaysConfigService],
})
export class NonSchoolDaysConfigModule {}
