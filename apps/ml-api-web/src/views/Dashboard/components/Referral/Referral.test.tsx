import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import { Referral } from './Referral';

const Component = <Referral />;

describe.skip('Settings => Referral Program', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Check component is rendering text correctly', () => {
        render(Component);
        expect(screen.getByText(/Referral Program/)).toBeInTheDocument();
        expect(screen.getByText(/Every time you send a Referral code, you can achieve the next level of rewards:/i)).toBeInTheDocument();
        expect(screen.getByText(/Refer someone you know! Each person who signs up using your referral code will get 10% off their subscription, and you will receive a gift from us as a thank you! Refer 5 people and you will get Safe Kids for a year on us!/i)).toBeInTheDocument();
        expect(screen.getByText(/Try our referral program!/i)).toBeInTheDocument();
    });

    test('Promo code display field check', () => {
        render(Component);
        const promoCodeInput = screen.getByTestId(/promo-code-input/i);
        expect(promoCodeInput).toBeDisabled();
    });

    test('Promo code copy button check', () => {
        render(Component);
        const promoCodeCopyBtn= screen.getByTestId(/promo-code-btn/i);
        expect(promoCodeCopyBtn).toBeEnabled();
    });
});
