import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Thankyou from '../../../../../pages/ui-onboarding/GetStartedContainer/ThankYou';

const Component = <Thankyou customSettings={true} />;

describe('Thankyou screen => Safekids home onboarding', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Thankyou component is being rendered successfully', () => {
        render(Component);
    });
    test('Thankyou component is rendering laptops image correctly', () => {
        const { getByAltText } = render(Component);
        expect(getByAltText('laptop-1')).toBeTruthy();
        expect(getByAltText('laptop-2')).toBeTruthy();
        expect(getByAltText('laptop-3')).toBeTruthy();
    });
});
