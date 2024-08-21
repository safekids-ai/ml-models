import React, { FunctionComponent, useEffect, lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { MixPanel } from './MixPanel';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext/AuthContext';
import NoNetworkNotification from './components/NoNetworkNotification';

import { getRequest } from './utils/api';
import { NotificationToastProvider } from './context/NotificationToastContext/NotificationToastContext';
import { GET_ACCOUNT_TYPE } from './utils/endpoints';
import { logError } from './utils/helpers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainLoader from "./components/MainLoader";
import {NavigateSetter} from "./utils/navigate";

// dynamic imports for lower chunk size
const Signup = lazy(() => import('./views/Signup/Signup'));
const SchoolOnboarding = lazy(() => import('./views/SchoolOnboarding/SchoolOnboarding'));
const ConsumerOnboarding = lazy(() => import('./views/ConsumerOnboarding/ConsumerOnboarding'));
const SignIn = lazy(() => import('./views/SignIn/SignIn'));
const SchoolSignIn = lazy(() => import('./views/SchoolSignIn/SchoolSignIn'));
const ForgotPassword = lazy(() => import('./views/SignIn/ForgotPassword'));
const Dashboard = lazy(() => import('./views/Dashboard/Dashboard'));
const RedirectComponent = lazy(() => import('./views/RedirectComponent/RedirectComponent'));
const CrisisEngagement = lazy(() => import('./views/CrisisEngagement/CrisisEngagement'));

const PublicRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem('jwt_token');
  const location = useLocation();

  if (token) {
    const redirectURL = new URLSearchParams(location.search).get('redirect') || '/dashboard';
    const { pathname, search } = new URL(redirectURL, window.origin);
    return <Navigate to={`${pathname}${search}`} state={{ fromLogin: true }} />;
  }

  return element;
};

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const { search, pathname } = useLocation();
  const [accountType, setAccountType] = useState<string | null>(localStorage.getItem('account_type'));
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    if (!accountType && token) {
      getRequest<{}, { accountType: string }>(GET_ACCOUNT_TYPE, {})
        .then(({ data }) => {
          localStorage.setItem('account_type', data.accountType);
          setAccountType(data.accountType);
        })
        .catch((err) => {
          logError('GET_ACCOUNT_TYPE', err);
        });
    }
  }, [accountType, token]);

  if (!token) {
    const signInPath = `/signin?redirect=${pathname}${search}`;
    if (accountType === 'SCHOOL') {
      return <Navigate to="/school-signin" />;
    }
    return <Navigate to={signInPath} />;
  }

  return element;
};

function App() {
  useEffect(function onMount() {
    MixPanel.track('App Load', {});
    const accountType = localStorage.getItem('account_type');
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (accountType !== 'SCHOOL' && favicon) {
      favicon.href = '/sk_orange_32x32_ico.png';
    }

    return () => {
      MixPanel.track('App Close', {});
    };
  }, []);

  return (
    <Sentry.ErrorBoundary fallback={({ error, componentStack }) => (
      <div className="error">
        <h1>Something went wrong.</h1>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
          <br />
          {componentStack}
        </details>
      </div>
    )}>
      <Suspense fallback={<MainLoader />}>
        <NotificationToastProvider>
          <NoNetworkNotification>
            <AuthProvider>
              <NavigateSetter />
              <div className="App">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <CssBaseline />
                  <Routes>
                    <Route path="/auth/google/redirect" element={<RedirectComponent />} />
                    <Route path="/auth/google/redirect/teacher" element={<RedirectComponent />} />
                    <Route path="/crisis-management" element={<RedirectComponent />} />

                    {/* Public Routes */}
                    <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
                    <Route path="/signin" element={<PublicRoute element={<SignIn />} />} />
                    <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
                    <Route path="/school-signin" element={<PublicRoute element={<SchoolSignIn />} />} />

                    {/* Private Routes */}
                    <Route path="/school-onboarding" element={<PrivateRoute element={<SchoolOnboarding />} />} />
                    <Route path="/onboarding" element={<PrivateRoute element={<ConsumerOnboarding />} />} />
                    <Route path="/*" element={<PrivateRoute element={<Dashboard />} />} />

                    <Route path="*" element={<Navigate to="/signin" />} />
                  </Routes>
                </LocalizationProvider>
              </div>
            </AuthProvider>
          </NoNetworkNotification>
        </NotificationToastProvider>
      </Suspense>
    </Sentry.ErrorBoundary>
  );
}

export default App;
