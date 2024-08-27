import {Module} from '@nestjs/common';
import {PrrNotificationService} from './prr-notification.service';
import {PrrNotificationController} from './prr-notification.controller';
import {prrNotificationProviders} from './prr-notification.providers';
import {PrrSmsNotificationService} from './prr.sms.notification.service';
import {PrrNotificationResponseController} from './prr-notification.response.controller';
import {JwtTokenModule} from '../auth/jwtToken/jwt.token.module';
import {AccountsModule} from '../accounts/accounts.module';
import {BullModule} from "@nestjs/bullmq";

@Module({
  imports: [
    JwtTokenModule,
    AccountsModule,
    BullModule.registerQueue({
      name: 'prr-notification-queue',
    })
  ],
  controllers: [PrrNotificationController, PrrNotificationResponseController],
  providers: [PrrNotificationService, PrrSmsNotificationService, ...prrNotificationProviders],
  exports: [PrrNotificationService, PrrSmsNotificationService],
})
export class PrrNotificationModule {
}
