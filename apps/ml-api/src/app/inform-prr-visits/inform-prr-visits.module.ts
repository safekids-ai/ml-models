import { Module } from '@nestjs/common';
import { InformPrrVisitsService } from './inform-prr-visits.service';
import { informPrrVisitProviders } from './inform-prr-visits.providers';
import { LoggingModule } from '../logger/logging.module';
import { UserModule } from '../user/user.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
    imports: [LoggingModule, UserModule, ActivityModule],
    providers: [InformPrrVisitsService, ...informPrrVisitProviders],
    exports: [InformPrrVisitsService],
})
export class InformPrrVisitsModule {}
