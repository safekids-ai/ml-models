import {Module} from '@nestjs/common';
import {DefaultDataService} from './default-data.service';
import {ScheduleModule} from '@nestjs/schedule';
import {OnBoardingCategoryModule} from '../category/on-boarding-category-module';
import {UrlModule} from '../url/url.module';
import {StatusModule} from '../status/status.module';
import {AccountTypeModule} from '../account-type/account-type.module';
import {DeviceTypeModule} from '../device-type/device-type.module';
import {PrrLevelModule} from '../prr-level/prr-level.module';
import {ActivityTypeModule} from '../activity-type/activity-type.module';
import {PrrTriggerModule} from '../prr-trigger/prr-trigger.module';
import {OnBoardingStepModule} from '../onboarding-step/on-boarding-step.module';
import {CalendarModule} from '../calendar/calendar.module';
import {RoleModule} from '../role/role.module';
import {LicenseModule} from '../license/license.module';
import {EmailEventTypeModule} from '../email-event-type/email-event-type.module';
import {PrrActionModule} from '../prr-action/prr-action.module';
import {PlanModule} from '../billing/plan/plan.module';
import {CouponModule} from '../billing/coupon/coupon.module';
import {ConsumerAuthModule} from '../consumer/auth/consumer-auth-module';
import {logging_v2} from "googleapis";
import {LoggingModule} from "../logger/logging.module";
import {LoggingService} from "../logger/logging.service";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
    ScheduleModule.forRoot(),
    OnBoardingCategoryModule,
    UrlModule,
    StatusModule,
    AccountTypeModule,
    DeviceTypeModule,
    PrrLevelModule,
    PrrActionModule,
    ActivityTypeModule,
    PrrTriggerModule,
    OnBoardingStepModule,
    CalendarModule,
    RoleModule,
    LicenseModule,
    EmailEventTypeModule,
    PlanModule,
    CouponModule,
    ConsumerAuthModule,
  ],

  providers: [DefaultDataService],
  exports: [DefaultDataService],
})
export class DefaultDataModule {
}
