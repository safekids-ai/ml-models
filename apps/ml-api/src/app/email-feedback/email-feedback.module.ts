import { Module } from '@nestjs/common';
import { EmailFeedbackService } from './email-feedback.service';
import { EmailFeedbackController } from './email-feedback.controller';
import { emailFeedbackProviders } from './email-feedback.providers';

@Module({
    controllers: [EmailFeedbackController],
    providers: [EmailFeedbackService, ...emailFeedbackProviders],
})
export class EmailFeedbackModule {}
