import { Module } from '@nestjs/common';
import { SubscriptionFeedbackService } from './subscription-feedback.service';
import { subscriptionFeedbackProviders } from './subscription-feedback.providers';

@Module({
    providers: [SubscriptionFeedbackService, ...subscriptionFeedbackProviders],
    exports: [SubscriptionFeedbackService],
})
export class SubscriptionFeedbackModule {}
