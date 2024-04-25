import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../../../../theme';
import SchoolActivity from './SchoolActivity';

afterEach(cleanup);

jest.mock('react-router', () => ({
    useLocation: () => ({
        pathname: 'localhost:3000/example/path',
    }),
}));
test('it renders Activity title', () => {
    const { findByText } = render(
        <ThemeProvider theme={theme}>
            <SchoolActivity />
        </ThemeProvider>
    );
    expect(findByText(/Activity/i)).toBeTruthy();
});
