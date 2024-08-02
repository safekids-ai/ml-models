import React, { useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Typography } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import Loader from '../../Loader';
import { PaymentForm } from './PaymentForm/PaymentForm';
import { Props } from './PaymentFormWrapper.type';

export const PaymentFormWrapper = (props: Props) => {
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const [message, setMessage] = useState('');
    useEffect(function onMount() {
        loadStripe(
            process.env.REACT_APP_STRIPE_KEY || 'pk_test_51IDWQjJBjodztVXYIRhpttyPAlmT9bLARz6KJcdQ9GYyDhZKEpSpBPAFjTZnZLe0yGi1tRjHzj6cQs3hwLeJYBvr00bjClP2Gn'
        )
            .then((stripe) => {
                setStripe(stripe);
            })
            .catch((err) => {
                console.log('Payment error:', err);
                setMessage('Failed to load Stripe');
            });
    }, []);
    return message ? (
        <div>
            <Typography variant="h6">
                Failed to load payment provider. Please{' '}
                <span className="primary-text cursor-pointer" onClick={() => window.location.reload()}>
                    refresh
                </span>{' '}
                to try again
            </Typography>
        </div>
    ) : stripe ? (
        <Elements stripe={stripe}>
            <PaymentForm {...props} />
        </Elements>
    ) : (
        <Loader />
    );
};
