import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { activityProviders } from './activity.providers';
import { UserModule } from '../user/user.module';
import { UserDeviceLinkModule } from '../user-device-link/user-device-link.module';
import { DeviceModule } from '../device/device.module';
import { AccountsModule } from '../accounts/accounts.module';
import { PrrNotificationModule } from '../prr-notification/prr-notification.module';
import { databaseProviders } from '../core/database/database.providers';
import { ActivityAiDataModule } from '../activity-ai-data/activity-ai-data.module';

@Module({
    imports: [UserDeviceLinkModule, UserModule, DeviceModule, AccountsModule, PrrNotificationModule, ActivityAiDataModule],
    controllers: [ActivityController],
    providers: [ActivityService, ...activityProviders, ...databaseProviders],
    exports: [ActivityService],
})
export class ActivityModule {}
