import { Module } from '@nestjs/common';
import { ChromeController } from './chrome.controller';
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
import { EmailExtensionController } from './email.extension.controller';
import { EmailEventModule } from '../email-event/email-event.module';
import { UserOptInModule } from '../user-opt-in/user-opt-in.module';
import { InformPrrVisitsModule } from '../inform-prr-visits/inform-prr-visits.module';

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
        EmailEventModule,
        UserOptInModule,
        InformPrrVisitsModule,
    ],
    providers: [ChromeService],
    controllers: [ChromeController, EmailExtensionController],
})
export class ChromeModule {}
