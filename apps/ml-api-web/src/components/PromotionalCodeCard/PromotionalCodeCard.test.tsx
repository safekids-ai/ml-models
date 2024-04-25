import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';

import { PromotionalCodeCard } from './PromotionalCodeCard';

afterEach(cleanup);

test('it renders correct title', async () => {
    const { getAllByText } = render(<PromotionalCodeCard setPromoCode={jest.fn()} activePlanId={''} />);
    await waitFor(() => expect(getAllByText(/PROMOTIONAL CODE/i)).toBeTruthy());
});

test('it renders correct text', async () => {
    const { getAllByText } = render(<PromotionalCodeCard setPromoCode={jest.fn()} activePlanId={''} />);
    //await wait();
    await waitFor(() => expect(getAllByText(/If you have a promotional code, enter it here:/i)).toBeTruthy());
});

test('it renders correct button', async () => {
    const { getAllByText } = render(<PromotionalCodeCard setPromoCode={jest.fn()} activePlanId={''} />);
    //  await wait();
    await waitFor(() => expect(getAllByText('APPLY')).toBeTruthy());
});

test('it renders correct input field', async () => {
    const { container } = render(<PromotionalCodeCard setPromoCode={jest.fn()} activePlanId={''} />);
    await waitFor(() => expect(container.querySelector(`input[name="CODE"]`)).toBeInTheDocument());
});
