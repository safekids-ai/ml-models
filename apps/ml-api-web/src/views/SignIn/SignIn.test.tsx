import React from 'react';
import { cleanup, fireEvent, render, wait } from '@testing-library/react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { theme } from '../../theme';
import { MemoryRouter } from 'react-router';
import App from '../../App';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


afterEach(cleanup);

test('it renders sign in screen', async () => {
    const { getAllByText } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/signin']}>
                    <App />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    await wait();
    expect(getAllByText(/Sign In/i)).toBeTruthy();
});

test('it renders email input field', async () => {
    const { getByTestId } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/signin']}>
                    <App />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    await wait();
    expect(getByTestId('email-input-field')).toBeInTheDocument();
});

test('it renders password input field', async () => {
    const { getByTestId } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/signin']}>
                    <App />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    await wait();
    expect(getByTestId('password-input-field')).toBeInTheDocument();
});

test('it renders password input field', async () => {
    const { getByTestId } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/signin']}>
                    <App />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    await wait();
    expect(getByTestId('password-input-field')).toBeInTheDocument();
});

test('it disables sign in button if wrong email regex is entered', async () => {
    const { getByTestId } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/signin']}>
                    <App />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    await wait();
    const passwordField = getByTestId('password-input-field');
    const emailField = getByTestId('email-input-field');
    const signInButton = getByTestId('signIn-button');
    fireEvent.change(passwordField, { target: { value: 'DummyPassword123A' } });
    fireEvent.change(emailField, { target: { value: 'dummyemail.com' } });
    await wait();
    expect(signInButton).toBeDisabled();
});

test('it enables sign in button if right email regex is entered', async () => {
    const { getByTestId } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/signin']}>
                    <App />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    await wait();
    const passwordField = getByTestId('password-input-field');
    const emailField = getByTestId('email-input-field');
    const signInButton = getByTestId('signIn-button');
    fireEvent.change(emailField, { target: { value: 'dummy@email.com' } });
    fireEvent.change(passwordField, { target: { value: 'DummyPassword123A' } });
    await wait();
    expect(signInButton).toBeEnabled();
});

test('it disables sign in button if email is not entered', async () => {
    const { getByTestId } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/signin']}>
                    <App />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    await wait();
    const passwordField = getByTestId('password-input-field');
    const emailField = getByTestId('email-input-field');
    const signInButton = getByTestId('signIn-button');
    fireEvent.change(passwordField, { target: { value: 'DummyPassword123A' } });
    fireEvent.change(emailField, { target: { value: '' } });
    await wait();
    expect(signInButton).toBeDisabled();
});

test('it disables sign in button if password is not entered', async () => {
    const { getByTestId } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/signin']}>
                    <App />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    await wait();
    const passwordField = getByTestId('password-input-field');
    const emailField = getByTestId('email-input-field');
    const signInButton = getByTestId('signIn-button');
    fireEvent.change(passwordField, { target: { value: '' } });
    fireEvent.change(emailField, { target: { value: 'dummyemail.com' } });
    await wait();
    expect(signInButton).toBeDisabled();
});

test('it changes input type to text if visibility toggle clicked', async () => {
    const { getByTestId, getByLabelText } = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/signin']}>
                    <App />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    const passwordField: any = getByTestId('password-input-field');
    const visibilityToggle = getByLabelText('toggle password visibility');
    fireEvent.click(visibilityToggle);
    expect(passwordField.type).toBe('text');
});
