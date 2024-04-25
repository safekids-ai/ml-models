import { Subscription } from './entities/subscription.entity';
import { SUBSCRIPTION_REPOSITORY } from '../../constants';

export const subscriptionProviders = [
    {
        provide: SUBSCRIPTION_REPOSITORY,
        useValue: Subscription,
    },
];
