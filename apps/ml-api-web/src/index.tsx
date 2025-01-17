import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { theme } from './theme';
import { isProduction, isStaging, release } from './constants';
import { CaptureConsole } from '@sentry/integrations';

//
// declare module '@mui/styles/defaultTheme' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   interface DefaultTheme extends Theme {}
// }

Sentry.init({
  dsn: isProduction
    ? 'https://56bb4bd526814c55b85ccbbd95d66a82@o472477.ingest.sentry.io/5506159'
    : 'https://1d22410dbc5f49fda6915d83a58dc4dc@o469616.ingest.sentry.io/5499358',
  tracesSampleRate: 1.0,
  integrations: [Sentry.browserTracingIntegration()],
  release: isProduction && release ? release : undefined,
  environment: isStaging ? 'staging' : isProduction ? 'production' : 'development',
});

const container = document.getElementById('root');

const root = createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StyledEngineProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
