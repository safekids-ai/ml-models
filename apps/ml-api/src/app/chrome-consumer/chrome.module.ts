import { FilteredProcessModule } from './../filtered-process/filtered-process.module';
import { SubscriptionModule } from './../billing/subscription/subscription-module';
import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ActivityModule } from '../activity/activity.module';
import { UserModule } from '../user/user.module';
import { JwtTokenModule } from '../auth/jwtToken/jwt.token.module';
import { UserDeviceLinkModule } from '../user-device-link/user-device-link.module';
import { ChromeService } from './chrome.service';
import { FilteredCategoryModule } from '../filtered-category/filtered-category.module';
import { FilteredUrlModule } from '../filtered-url/filtered-url.module';
import { CalendarModule } from '../calendar/calendar.module';
import { InterceptionTimeModule } from '../interception-time/interception-time.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { WebTimeModule } from '../web-time/web-time.module';
import { NonSchoolDaysConfigModule } from '../non-school-days-config/non-school-days-config.module';
import { AccountsModule } from '../accounts/accounts.module';
import { NonSchoolDevicesConfigModule } from '../non-school-devices-config/non-school-devices-config.module';
import { KidConfigModule } from '../kid-config/kid-config.module';
import { KidRequestModule } from '../kid-request/kid-request.module';
import { databaseProviders } from '../core/database/database.providers';
import { ParentEmailConfigModule } from '../parent-email-config/parent-email-config.module';

@Module({
    imports: [
        ActivityModule,
        AccountsModule,
        UserModule,
        JwtTokenModule,
        UserDeviceLinkModule,
        FilteredCategoryModule,
        FilteredUrlModule,
        NonSchoolDaysConfigModule,
        CalendarModule,
        InterceptionTimeModule,
        FeedbackModule,
        WebTimeModule,
        NonSchoolDevicesConfigModule,
        KidConfigModule,
        KidRequestModule,
        ParentEmailConfigModule,
        SubscriptionModule,
        FilteredProcessModule,
    ],
    providers: [ChromeService, ...databaseProviders],
    controllers: [ConsumerController],
})
export class ChromeConsumerModule {}
