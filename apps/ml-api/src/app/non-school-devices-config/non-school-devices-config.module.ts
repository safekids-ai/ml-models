import { Module } from '@nestjs/common';
import { NonSchoolDevicesConfigService } from './non-school-devices-config.service';
import { NonSchoolDevicesConfigController } from './non-school-devices-config.controller';
import { nonSchoolDevicesConfigProviders } from './non-school-devices-config.providers';
import { accountProviders } from '../accounts/account.providers';
import { usersProviders } from '../user/users.providers';
import { databaseProviders } from '../core/database/database.providers';

@Module({
    controllers: [NonSchoolDevicesConfigController],
    providers: [NonSchoolDevicesConfigService, ...nonSchoolDevicesConfigProviders, ...accountProviders, ...usersProviders, ...databaseProviders],
    exports: [NonSchoolDevicesConfigService],
})
export class NonSchoolDevicesConfigModule {}
