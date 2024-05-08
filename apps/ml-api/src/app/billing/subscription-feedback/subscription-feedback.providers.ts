import { SubscriptionFeedback } from './entities/subscription-feedback.entity';
import { SUBSCRIPTION_FEEDBACK_REPOSITORY } from '../../constants';

export const subscriptionFeedbackProviders = [
    {
        provide: SUBSCRIPTION_FEEDBACK_REPOSITORY,
        useValue: SubscriptionFeedback,
    },
];
