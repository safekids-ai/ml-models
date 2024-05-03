import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { theme } from '../../../../theme';
import SchoolActivity from './SchoolActivity';



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


afterEach(cleanup);

jest.mock('react-router', () => ({
    useLocation: () => ({
        pathname: 'localhost:3000/example/path',
    }),
}));
test('it renders Activity title', () => {
    const { findByText } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <SchoolActivity />
            </ThemeProvider>
        </StyledEngineProvider>
    );
    expect(findByText(/Activity/i)).toBeTruthy();
});
