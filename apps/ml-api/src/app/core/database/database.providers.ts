import {FilteredProcess} from './../../filtered-process/entities/filtered-process.entity';
import {Sequelize} from 'sequelize-typescript';
import {databaseConfig} from './database.config';
import {DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST} from '../../constants';
import {User} from '../../user/entities/user.entity';
import {Account} from '../../accounts/entities/account.entity';
import {Status} from '../../status/entities/status.entity';
import {AccountType} from '../../account-type/entities/account-type.entity';
import {FilteredCategory} from '../../filtered-category/entities/filtered-category.entity';
import {OrgUnit} from '../../org-unit/entities/org-unit.entity';
import {FilteredUrl} from '../../filtered-url/entities/filtered-url.entity';
import {Category} from '../../category/entities/category.entity';
import {Url} from '../../url/entities/url.entity';
import {AuthToken} from '../../auth-token/entities/auth-token.entity';
import {AccountCalendar} from '../../calendar/entities/calendar.entity';
import {InterceptionTime} from '../../interception-time/entities/interception-time.entity';
import {ServicesApiKey} from '../../api-key/entities/api-key.entity';
import {PrrLevel} from '../../prr-level/entities/prr-level.entity';
import {Activity} from '../../activity/entities/activity.entity';
import {ActivityType} from '../../activity-type/entities/activity-type.entity';
import {DeviceType} from '../../device-type/entities/device-type.entity';
import {PrrTrigger} from '../../prr-trigger/entities/prr-trigger.entity';
import {NonSchoolDaysConfig} from '../../non-school-days-config/entities/non-school-days-config.entity';
import {OnBoardingStep} from '../../onboarding-step/entities/onboarding-step.entity';
import {UserDeviceLink} from '../../user-device-link/entities/user-device-link.entity';
import {Device} from '../../device/entities/device.entity';
import {RosterOrg} from '../../roster-org/entities/roster-org.entity';
import {SchoolClass} from '../../school-class/entities/school-class.entity';
import {Enrollment} from '../../enrollment/entities/enrollment.entity';
import {Feedback} from '../../feedback/entities/feedback.entity';
import {WebTime} from '../../web-time/entities/web-time.entity';
import {PrrNotification} from '../../prr-notification/entities/prr-notification.entity';
import {Role} from '../../role/entities/role.entity';
import {Job} from '../../jobs/entities/jobs.entity';
import {License} from '../../license/entities/license.entity';
import {AccountLicense} from '../../account-license/entities/account-license.entity';
import {NonSchoolDevicesConfig} from '../../non-school-devices-config/entities/non-school-devices-config.entity';
import {UserCode} from '../../consumer/user-code/entities/user-code.entity';
import {ParentConsent} from '../../consumer/parent-consent/entities/parent-consent.entity';
import {EmailMLFeedback} from '../../email-feedback/entities/email-feedback.entity';
import {InternalApiKey} from '../../internal-api-key/entities/internal-api-key.entity';
import {EmailEvent} from '../../email-event/entities/email-event.entity';
import {UserOptIn} from '../../user-opt-in/entities/user-opt-in.entity';
import {EmailEventType} from '../../email-event-type/entities/email-event-type.entity';
import {PrrAction} from '../../prr-action/entities/prr-action.entity';
import {KidConfig} from '../../kid-config/entities/kid-config.entity';
import {KidRequest} from '../../kid-request/domain/kid-request.entity';
import {EmailEventConfig} from '../../email-event-config/entities/email-event-config.entity';
import {InformPrrVisit} from '../../inform-prr-visits/entities/inform-prr-visit.entity';
import {PromoCode} from '../../billing/promo-code/entities/promo-code.entity';
import {Plan} from '../../billing/plan/entities/plan.entity';
import {Subscription} from '../../billing/subscription/entities/subscription.entity';
import {Payment} from '../../billing/payment/entities/payment.entity';
import {ActivityAiDatum} from '../../activity-ai-data/entities/activity-ai-datum.entity';
import {Coupon} from '../../billing/coupon/entities/coupon.entity';
import {SubscriptionFeedback} from '../../billing/subscription-feedback/entities/subscription-feedback.entity';
import {Invoice} from '../../billing/invoice/entities/invoice.entity';
import {Health} from '../../health/health.entity';
import {ConfigService} from "@nestjs/config";
import {SqlConfig} from "../../config/sql";
import {LoggingService} from "../../logger/logging.service";

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    inject: [ConfigService, LoggingService],
    useFactory: async (configService: ConfigService, log: LoggingService) => {
      if (!log) {
        throw new Error("Logging service not wired in")
      }
      if (!configService) {
        throw new Error("Configuration service not wired in")
      }
      let dbConfig = configService.get<SqlConfig>("sqlConfig")
      if (!dbConfig) {
        throw new Error("Please provide a valid SQL configuration. Check ./config/sql")
      }
      let dbOptions = dbConfig.options
      let config;
      switch (process.env.APP_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      config = {...dbOptions, ...config}
      const sequelize = new Sequelize(config);
      try {
        await sequelize.authenticate();
      } catch (error) {
        const {password, ...connectionSettings} = dbOptions
        throw new Error(`Unable to connect to database ${JSON.stringify(connectionSettings)} with error:${error}`)
      }

      sequelize.addModels([
        User,
        Account,
        Status,
        AccountType,
        FilteredCategory,
        OrgUnit,
        FilteredUrl,
        Category,
        Url,
        AuthToken,
        AccountCalendar,
        InterceptionTime,
        ServicesApiKey,
        PrrLevel,
        Activity,
        ActivityType,
        ActivityAiDatum,
        DeviceType,
        PrrTrigger,
        NonSchoolDaysConfig,
        OnBoardingStep,
        UserDeviceLink,
        Device,
        RosterOrg,
        SchoolClass,
        Enrollment,
        Feedback,
        WebTime,
        PrrNotification,
        Role,
        Job,
        License,
        AccountLicense,
        NonSchoolDevicesConfig,
        UserCode,
        ParentConsent,
        EmailMLFeedback,
        InternalApiKey,
        EmailEvent,
        EmailEventType,
        UserOptIn,
        PrrAction,
        KidConfig,
        KidRequest,
        EmailEventConfig,
        InformPrrVisit,
        Plan,
        Subscription,
        Payment,
        PromoCode,
        Coupon,
        SubscriptionFeedback,
        FilteredProcess,
        Invoice,
        Health,
      ]);
      //commented out since a sync is dangerous
      //await sequelize.sync();
      return sequelize;
    },
  },
];
