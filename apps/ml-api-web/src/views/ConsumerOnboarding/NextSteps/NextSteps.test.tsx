import React from 'react';
import { cleanup, render, wait, screen } from '@testing-library/react';
import NextSteps from './NextSteps';

afterEach(cleanup);

const KidsCodesComponent: JSX.Element = <NextSteps finishOnboardings={() => {}}></NextSteps>;

test('it renders coppa screen', async () => {
    jest.spyOn(React, 'useEffect').mockImplementation(() => {
        jest.fn();
    });
    render(KidsCodesComponent);
    await wait();

    expect(screen.getByText('Next Steps')).toBeTruthy();
});

test('Next Screen Component is rendering the next button correctly', async () => {
    jest.spyOn(React, 'useEffect').mockImplementation(() => {
        jest.fn();
    });
    render(KidsCodesComponent);
    const finishBtn = screen.getByTestId(/add-kids-submit-button/i);
    await wait();
    expect(finishBtn).toBeEnabled();
    // expect(getByTestId('add-kids-submit-button')).toBeTruthy();
});

test('Next Screen Component is rendering steps list correctly', () => {
    render(KidsCodesComponent);
    const list = screen.getAllByRole('list');
    const listItems = screen.getAllByRole('listitem');
    expect(list.length).toEqual(1);
    expect(listItems.length).toEqual(3);
});

test('Next Screen Component is rendering text correctly', () => {
    render(KidsCodesComponent);
    expect(screen.getByText(/Keep this page open and go to your kids device/i)).toBeTruthy();
    expect(screen.getByText(/Navigate to/i)).toBeTruthy();
    expect(screen.getByText(/home.safekids.ai/i)).toBeTruthy();
    expect(screen.getByText(/Download the extension/i)).toBeTruthy();
    expect(screen.getByText(/Finish/i)).toBeTruthy();
});
