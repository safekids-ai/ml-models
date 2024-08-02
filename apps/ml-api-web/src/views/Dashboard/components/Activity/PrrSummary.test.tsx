import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { theme } from '../../../../theme';
import PrrSummary from './PrrSummary';
import { SummaryData } from './SchoolActivity.type';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


afterEach(cleanup);

const testData: SummaryData = {
    averageDailyInstances: 10,
    topInterceptedCategory: 'Sample Category',
    topInterceptedUrl: 'Sample Url',
    reductionToDate: { date: 'Sun 14 Feb 2022', reduction: 5 },
};

jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

const startDate = new Date();
const endDate = new Date();
endDate.setDate(startDate.getDate() - 1);
const renderComponent = (summary?: SummaryData) =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <PrrSummary startDate={startDate} endDate={endDate} />
            </ThemeProvider>
        </StyledEngineProvider>,
    );

test.skip("it renders correct text for average daily instances for 'undefined' data", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('daily-instances').textContent).toBe('0');
});

test.skip('it renders correct text for average daily instances for valid data', () => {
    const { getByTestId } = renderComponent(testData);
    expect(getByTestId('daily-instances').textContent).toBe('10');
});

test.skip("it renders correct text for top intercepted category for 'undefined' data", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('top-intercepted-category').textContent).toBe('--');
});

test.skip('it renders correct text for top intercepted category for valid data', () => {
    const { getByTestId } = renderComponent(testData);
    expect(getByTestId('top-intercepted-category').textContent).toBe('Sample Category');
});

test.skip("it renders correct text for top intercepted url for 'undefined' data", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('top-intercepted-url').textContent).toBe('--');
});

test.skip('it renders correct text for top intercepted url for valid data', () => {
    const { getByTestId } = renderComponent(testData);
    expect(getByTestId('top-intercepted-url').textContent).toBe('Sample Url');
});

test.skip("it renders correct text for reduction percentage for 'undefined' data", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('reduction-percentage').textContent).toBe('--');
});

test.skip('it renders correct text for reduction percentage for valid data', () => {
    const { getByTestId } = renderComponent(testData);
    expect(getByTestId('reduction-percentage').textContent).toBe('5%');
});

test.skip("it renders correct text for reduction date for 'undefined' data", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('reduction-date').textContent).toBe('-');
});

test.skip('it renders correct text for reduction date for valid data', () => {
    const { getByTestId } = renderComponent(testData);
    expect(getByTestId('reduction-date').textContent).toBe('Feb, 14 2022');
});
