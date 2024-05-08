import { Module } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { GoogleApisModule } from '../google-apis/google-apis.module';
import { OrgUnitModule } from '../org-unit/org-unit.module';
import { UserModule } from '../user/user.module';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { FilteredCategoryModule } from '../filtered-category/filtered-category.module';
import { FilteredUrlModule } from '../filtered-url/filtered-url.module';
import { WebTimeModule } from '../web-time/web-time.module';
import { DeviceModule } from '../device/device.module';
import { ActivityModule } from '../activity/activity.module';
import { UserDeviceLinkModule } from '../user-device-link/user-device-link.module';

@Module({
    imports: [
        GoogleApisModule,
        OrgUnitModule,
        UserModule,
        AuthTokenModule,
        FilteredCategoryModule,
        FilteredUrlModule,
        WebTimeModule,
        DeviceModule,
        ActivityModule,
        UserDeviceLinkModule,
    ],
    providers: [DirectoryService],
    exports: [DirectoryService],
})
export class DirectoryModule {}
