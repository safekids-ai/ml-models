import { STRIPE_SERVICE } from '../tokens';
import { StripeService } from './stripe.service';

export const stripeProviders = [
    {
        provide: STRIPE_SERVICE,
        useClass: StripeService,
    },
];
