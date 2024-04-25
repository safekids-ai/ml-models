import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {
    client() {
        return new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: process.env.STRIPE_API_VERSION,
            typescript: true,
        } as Stripe.StripeConfig);
    }
}
