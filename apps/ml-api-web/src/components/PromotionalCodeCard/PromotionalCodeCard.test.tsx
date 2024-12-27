import React from 'react';
import { cleanup, fireEvent, render, wait } from '@testing-library/react';

import { PromotionalCodeCard } from './PromotionalCodeCard';

afterEach(cleanup);

test('it renders correct title', async () => {
    const { getAllByText } = render(<PromotionalCodeCard setPromoCode={jest.fn()} activePlanId={''} />);
    // await wait();
    const title = getAllByText(/PROMOTIONAL CODE/i);
    expect(title).toBeTruthy();
});

test('it renders correct text', async () => {
    const { getAllByText } = render(<PromotionalCodeCard setPromoCode={jest.fn()} activePlanId={''} />);
    //await wait();
    const text = getAllByText(/If you have a promotional code, enter it here:/i);
    expect(text).toBeTruthy();
});

test('it renders correct button', async () => {
    const { getAllByText } = render(<PromotionalCodeCard setPromoCode={jest.fn()} activePlanId={''} />);
    //  await wait();
    const enterButton = getAllByText('APPLY');
    expect(enterButton).toBeTruthy();
});

test('it renders correct input field', async () => {
    const { container } = render(<PromotionalCodeCard setPromoCode={jest.fn()} activePlanId={''} />);
    //  await wait();
    const inputField = container.querySelector(`input[name="CODE"]`);
    expect(inputField).toBeInTheDocument();
});
