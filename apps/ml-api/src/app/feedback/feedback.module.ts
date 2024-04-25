import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { feedbackProviders } from './feedback.providers';

@Module({
    controllers: [FeedbackController],
    providers: [FeedbackService, ...feedbackProviders],
    exports: [FeedbackService],
})
export class FeedbackModule {}
