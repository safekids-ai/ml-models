import React from 'react';
import { MemoryRouter } from "react-router";
import { render } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
    const app = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
    expect(app).toBeTruthy();
});
