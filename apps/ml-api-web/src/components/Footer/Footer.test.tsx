import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import Footer from './index';

afterEach(cleanup);

test('it renders correct footer text', async () => {
    const { getAllByText, getByText } = render(<Footer />);
    await waitFor(() => expect(getAllByText(/\©\ All Rights Reserved \–\ Safe Kids LLC./i)).toBeTruthy());
    const safekids_text = getByText(/Safe Kids\’/i);
    const service_term_text = getByText(/Services Terms/i);
    const and_text = getByText(/and/i);
    const privacy_policy_text = getByText(/Privacy Policy./i);

    expect(safekids_text).toBeTruthy();
    expect(service_term_text).toBeTruthy();
    expect(and_text).toBeTruthy();
    expect(privacy_policy_text).toBeTruthy();
});

test('it has terms and policy links are correct', async () => {
    const { getByText } = render(<Footer />);
    await waitFor(() => expect(getByText(/Services Terms/i)).toHaveProperty('href', 'https://www.safekids.ai/termsandconditions/'));

    const privacy_policy_text = getByText(/Privacy Policy./i);

    expect(privacy_policy_text).toHaveProperty('href', 'https://www.safekids.ai/privacy_policy/');
});
