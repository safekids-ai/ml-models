import { Module } from '@nestjs/common';
import { InsightController } from './insight.controller';
import { ActivityModule } from '../activity/activity.module';
import { UserModule } from '../user/user.module';
import { EmailEventModule } from '../email-event/email-event.module';

@Module({
    imports: [ActivityModule, UserModule, EmailEventModule],
    controllers: [InsightController],
})
export class InsightModule {}
