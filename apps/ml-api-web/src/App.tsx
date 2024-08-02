import React, {FunctionComponent, useEffect, lazy, Suspense} from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import * as Sentry from '@sentry/react';
import {MixPanel} from './MixPanel';
import {CssBaseline, Switch} from '@mui/material';
import {AuthProvider} from './context/AuthContext/AuthContext';
import NoNetworkNotification from './components/NoNetworkNotification';

import DateFnsUtils from '@date-io/date-fns';
import MainLoader from './components/MainLoader';
import {getRequest, updateAxios} from './utils/api';
import {NotificationToastProvider} from './context/NotificationToastContext/NotificationToastContext';
import {GET_ACCOUNT_TYPE} from './utils/endpoints';
import {logError} from './utils/helpers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Updated utility adapter import


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
  path: string;
  component: FunctionComponent;
};

const PublicRoute = ({path, component}: RouteProps) => {
  const token = localStorage.getItem('jwt_token');
  const {search: searchParams} = useLocation();
  if (token) {
    updateAxios();
    const redirectURL = new URLSearchParams(searchParams).get('redirect') || '/dashboard';
    const {pathname, search} = new URL(redirectURL, window.origin);
    return <Navigate to={`${pathname}${search}`} state={{fromLogin: true}}/>;
  } else {
    return <Route path={path} element={React.createElement(component)}/>;
  }
};

const PrivateRoute = ({path, component}: RouteProps) => {
  const {search, pathname} = useLocation();
  const token = localStorage.getItem('jwt_token');
  let accountType = localStorage.getItem('account_type');
  if (!accountType && token) {
    getRequest<{}, { accountType: string }>(GET_ACCOUNT_TYPE, {})
      .then(({data}) => {
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
    return <Navigate to={signInPath}/>;
  } else if (notSignedIn && IsSchool) {
    return <Navigate to="/school-signin"/>;
  } else {
    updateAxios();
    return <Route path={path} element={React.createElement(component)}/>;
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
    <Sentry.ErrorBoundary fallback={<div className="error">Error</div>}>
      <Suspense fallback={<MainLoader/>}>
        <NotificationToastProvider>
          <NoNetworkNotification>
            <AuthProvider>
              <div className="App">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <CssBaseline/>
                  <Routes>
                    <Route path="/auth/google/redirect" element={<RedirectComponent/>}/>
                    <Route path="/auth/google/redirect/teacher" element={<RedirectComponent/>}/>
                    <Route path="/crisis-management" element={<RedirectComponent/>}/>
                    <PublicRoute path="/signup" component={Signup}/>
                    <PublicRoute path="/signin" component={SignIn}/>
                    <PublicRoute path="/forgot-password" component={ForgotPassword}/>
                    <PublicRoute path="/school-signin" component={SchoolSignIn}/>

                    <PrivateRoute path="/school-onboarding" component={SchoolOnboarding}/>
                    <PrivateRoute path="/onboarding" component={ConsumerOnboarding as FunctionComponent<{}>}/>
                    <PrivateRoute path="/" component={Dashboard}/>
                    <Navigate to="/signin"/>
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
