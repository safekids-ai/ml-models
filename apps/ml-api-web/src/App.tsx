import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { MixPanel } from './MixPanel';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import NoNetworkNotification from './components/NoNetworkNotification';

import { getRequest, updateAxios } from './utils/api';
import { NotificationToastProvider } from './context/NotificationToastContext/NotificationToastContext';
import { GET_ACCOUNT_TYPE } from './utils/endpoints';
import { logError } from './utils/helpers';

// dynamic imports for lower chunck size
const Signup = lazy(() => import('./views/Signup/Signup'));
const SchoolOnboarding = lazy(() => import('./views/SchoolOnboarding/SchoolOnboarding'));
const ConsumerOnboarding = lazy(() => import('./views/ConsumerOnboarding/ConsumerOnboarding'));
const SignIn = lazy(() => import('./views/SignIn/SignIn'));
const SchoolSignIn = lazy(() => import('./views/SchoolSignIn/SchoolSignIn'));
const ForgotPassword = lazy(() => import('./views/SignIn/ForgotPassword'));
const Dashboard = lazy(() => import('./views/Dashboard/Dashboard'));
const RedirectComponent = lazy(() => import('./views/RedirectComponent/RedirectComponent'));
const CrisisEngagement = lazy(() => import('./views/CrisisEngagement/CrisisEngagement'));

type RouteProps = {
    children: JSX.Element;
};

const CheckAuth = ({ children }: RouteProps) => {
    const token = localStorage.getItem('jwt_token');
    const { search: searchParams } = useLocation();
    if (token) {
        updateAxios();
        const redirectURL = new URLSearchParams(searchParams).get('redirect') || '/dashboard';
        const { pathname, search } = new URL(redirectURL, window.origin);
        return <Navigate to={{ pathname, search }} state={{ fromLogin: true }} />;
    } else {
        return children;
    }
};

const IsAuthenticated = ({ children }: RouteProps) => {
    const { search, pathname } = useLocation();
    const token = localStorage.getItem('jwt_token');
    let accountType = localStorage.getItem('account_type');
    if (!accountType && token) {
        getRequest<{}, { accountType: string }>(GET_ACCOUNT_TYPE, {})
            .then(({ data }) => {
                localStorage.setItem('account_type', data.accountType);
            })
            .catch((err) => {
                logError('GET_ACCOUNT_TYPE', err);
            });
        updateAxios();
    }
    const IsSchool = accountType === 'SCHOOL';
    accountType = localStorage.getItem('account_type');

    const notSignedIn = !token;
    if (notSignedIn && !IsSchool) {
        const signInPath = `/signin?redirect=${pathname}${search}`;
        return <Navigate to={signInPath} />;
    } else if (notSignedIn && IsSchool) {
        return <Navigate to="/school-signin" />;
    } else {
        updateAxios();
        return children;
    }
};

window.onerror = (error) => {
    Sentry.captureException(error);
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
        // <Sentry.ErrorBoundary fallback={<div className="error">Error</div>}>
        <NotificationToastProvider>
            <NoNetworkNotification>
                <AuthProvider>
                    <div className="App">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <CssBaseline />
                            <Routes>
                                <Route path="/auth/google/redirect" element={<RedirectComponent />} />
                                <Route path="/auth/google/redirect/teacher" element={<RedirectComponent />} />
                                <Route path="/crisis-management" element={<CrisisEngagement />} />
                                <Route
                                    path="/signup"
                                    element={
                                        <CheckAuth>
                                            <Suspense>
                                                <Signup />
                                            </Suspense>
                                        </CheckAuth>
                                    }
                                />
                                <Route
                                    path="/signin"
                                    element={
                                        <CheckAuth>
                                            <Suspense>
                                                <SignIn />
                                            </Suspense>
                                        </CheckAuth>
                                    }
                                />
                                <Route
                                    path="/forgot-password"
                                    element={
                                        <CheckAuth>
                                            <Suspense>
                                                <ForgotPassword />
                                            </Suspense>
                                        </CheckAuth>
                                    }
                                />
                                <Route
                                    path="/school-signin"
                                    element={
                                        <CheckAuth>
                                            <Suspense>
                                                <SchoolSignIn />
                                            </Suspense>
                                        </CheckAuth>
                                    }
                                />
                                <Route
                                    path="/school-onboarding"
                                    element={
                                        <IsAuthenticated>
                                            <Suspense>
                                                <SchoolOnboarding />
                                            </Suspense>
                                        </IsAuthenticated>
                                    }
                                />
                                <Route
                                    path="/onboarding"
                                    element={
                                        <IsAuthenticated>
                                            <Suspense>
                                                <ConsumerOnboarding />
                                            </Suspense>
                                        </IsAuthenticated>
                                    }
                                />
                                <Route
                                    path="/"
                                    element={
                                        <IsAuthenticated>
                                            <Suspense>
                                                <Dashboard />
                                            </Suspense>
                                        </IsAuthenticated>
                                    }
                                />
                                <Route element={<Navigate to="/signin" />} />
                            </Routes>
                        </LocalizationProvider>
                    </div>
                </AuthProvider>
            </NoNetworkNotification>
        </NotificationToastProvider>
        // </Sentry.ErrorBoundary>
    );
}

export default App;
