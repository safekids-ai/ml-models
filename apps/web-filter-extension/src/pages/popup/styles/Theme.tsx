import React from 'react';
import { ThemeProvider } from 'styled-components';

const light = {
    bg: {
        primary: '#F4F4F4',
    },
    text: {
        primary: '#050505',
    },
};
type Props = {
  children?: React.ReactNode
};

export const Theme: React.FC<Props> = ({ children }) => {
    const theme = light;

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
