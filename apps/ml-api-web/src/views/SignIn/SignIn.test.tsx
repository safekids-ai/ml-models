import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import { MemoryRouter } from 'react-router';
import App from '../../App';

afterEach(cleanup);

test('it renders sign in screen', async () => {
    const { getAllByText } = render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        </ThemeProvider>,
    );
    await waitFor(() => expect(getAllByText(/Sign In/i)).toBeTruthy());

});

test('it renders email input field', async () => {
    const { getByTestId } = render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        </ThemeProvider>,
    );
    await waitFor(() => expect(getByTestId('email-input-field')).toBeInTheDocument());
});

test('it renders password input field', async () => {
    const { getByTestId } = render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        </ThemeProvider>,
    );
    await waitFor(() => expect(getByTestId('password-input-field')).toBeInTheDocument());
});

test('it renders password input field', async () => {
    const { getByTestId } = render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        </ThemeProvider>,
    );
    await waitFor(() => expect(getByTestId('password-input-field')).toBeInTheDocument());
});

test('it disables sign in button if wrong email regex is entered', async () => {
    const { getByTestId } = render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        </ThemeProvider>,
    );
    await waitFor(() => expect(getByTestId('password-input-field')).toBeInTheDocument());
    const passwordField = getByTestId('password-input-field');
    const emailField = getByTestId('email-input-field');
    const signInButton = getByTestId('signIn-button');
    fireEvent.change(passwordField, { target: { value: 'DummyPassword123A' } });
    fireEvent.change(emailField, { target: { value: 'dummyemail.com' } });
    await waitFor(() => expect(signInButton).toBeDisabled());
});

test('it enables sign in button if right email regex is entered', async () => {
    const { getByTestId } = render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        </ThemeProvider>,
    );
    await waitFor(() => expect(getByTestId('password-input-field')).toBeInTheDocument());
    const passwordField = getByTestId('password-input-field');
    const emailField = getByTestId('email-input-field');
    const signInButton = getByTestId('signIn-button');
    fireEvent.change(emailField, { target: { value: 'dummy@email.com' } });
    fireEvent.change(passwordField, { target: { value: 'DummyPassword123A' } });
    await waitFor(() => expect(signInButton).toBeEnabled());
});

test('it disables sign in button if email is not entered', async () => {
    const { getByTestId } = render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        </ThemeProvider>,
    );
    await waitFor(() => expect(getByTestId('password-input-field')).toBeInTheDocument());
    const passwordField = getByTestId('password-input-field');
    const emailField = getByTestId('email-input-field');
    const signInButton = getByTestId('signIn-button');
    fireEvent.change(passwordField, { target: { value: 'DummyPassword123A' } });
    fireEvent.change(emailField, { target: { value: '' } });
    await waitFor(() => expect(signInButton).toBeDisabled());
});

test('it disables sign in button if password is not entered', async () => {
    const { getByTestId } = render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        </ThemeProvider>,
    );
    await waitFor(() => expect(getByTestId('password-input-field')).toBeInTheDocument());
    const passwordField = getByTestId('password-input-field');
    const emailField = getByTestId('email-input-field');
    const signInButton = getByTestId('signIn-button');
    fireEvent.change(passwordField, { target: { value: '' } });
    fireEvent.change(emailField, { target: { value: 'dummyemail.com' } });
    await waitFor(() => expect(signInButton).toBeDisabled());
    expect(signInButton).toBeDisabled();
});

test('it changes input type to text if visibility toggle clicked', async () => {
    const { getByTestId, getByLabelText } = render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        </ThemeProvider>,
    );
    const passwordField: any = getByTestId('password-input-field');
    const visibilityToggle = getByLabelText('toggle password visibility');
    fireEvent.click(visibilityToggle);
    expect(passwordField.type).toBe('text');
});
