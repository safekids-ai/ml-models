import React, { useState, useCallback, useMemo } from 'react';
import { authReducer, State } from './authReducer';
import {
    login as loginAction,
    loginWithToken,
    logout as logoutAction,
    signUp,
    verifySignUp,
    clearSignup as clearSignupAction,
    subscribePlan,
} from './authActions';
import useThunkReducer from 'react-hook-thunk-reducer';
import { SignupFormValues } from '../../views/Signup/Signup';

import { pathOr } from 'ramda';
import { updateAxios } from '../../utils/api';
import { isSomething } from '../../utils/helpers';
import { hasStorage } from '../../constants';
import { navigateTo } from '../../utils/navigate';

type AuthContextType = {
    data?: State;
    login: (email: string, password: string, onLogin?: (message: string | undefined) => void) => void;

    logout: () => void;
    signup: (values: SignupFormValues, onSignup: (message: string | undefined) => void) => void;
    verifySignup: (code: string, onSignup: () => void) => void;
    clearSignup: () => void;
    resend2FACode: () => void;
    subscribeToPlan: (planID: string) => void;
    schoolSignupRequest: (values: any, onSignup: (message: string | undefined) => void) => void;
};
const AuthContext = React.createContext<AuthContextType>({
    login: () => undefined,
    data: undefined,
    logout: () => undefined,
    signup: async () => undefined,
    verifySignup: () => undefined,
    clearSignup: () => undefined,
    resend2FACode: () => undefined,
    subscribeToPlan: () => undefined,
    schoolSignupRequest: () => undefined,
});

const AuthenticationProvider: React.FC<any> = (props) => {
    const token = hasStorage ? localStorage.getItem('jwt_token') : '';
    // eslint-disable-next-line
    const hasToken = token != undefined;
    const [requestSent, setRequestSent] = useState(false);
    const [state, dispatch] = useThunkReducer<State, any>(authReducer, {
        loading: hasToken,
        loggedIn: false,
    });
    const { loading, loggedIn } = state;
    if (hasToken && !requestSent) {
        dispatch(loginWithToken(token || ''));
        setRequestSent(true);
    }
    const login = useCallback(
        (email: string, password: string, onLogin: (message: string | undefined) => void) => {
            dispatch(loginAction(email, password, onLogin));
        },
        [dispatch]
    );

    const signup = useCallback(
        (values: SignupFormValues, onSignup: (message?: string) => void) => {
            dispatch(signUp(values, onSignup));
        },
        [dispatch]
    );
    const registrationToken = pathOr('', ['signup', 'registerToken'], state);
    const verifySignup = useCallback(
        (code: string, onSignup: () => void) => {
            dispatch(verifySignUp(code, registrationToken, onSignup));
        },
        [dispatch, registrationToken]
    );
    const subscribeToPlan = useCallback(
        (planID: string) => {
            dispatch(subscribePlan(planID, registrationToken));
        },
        [registrationToken, dispatch]
    );
    const loginToken = pathOr('', ['login', 'token'], state);

    const logout = () => {
      const accountType = localStorage.getItem('account_type');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('account_type');
      accountType === 'SCHOOL' ? navigateTo('/school-signin') : navigateTo('/signin');
      dispatch(logoutAction());
      setRequestSent(false);
      updateAxios();
    };

    const clearSignup = () => {
        dispatch(clearSignupAction());
    };
    const resend2FACode = useCallback(() => {
        const data = pathOr<any>(undefined, ['login', 'data'], state);
        if (isSomething(data) && data) login(data.username, data.password, () => undefined);
    }, [state, login]);

    const contextValue = useMemo(
        () => ({
            data: state,
            login,
            logout,
            signup,
            loggedIn,
            verifySignup,
            clearSignup,
            resend2FACode,
            subscribeToPlan,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state, dispatch]
    );
    if (hasToken && loading) {
        return <div>Loading...</div>;
    }
    return <AuthContext.Provider value={contextValue} {...props} />;
};
const AuthProvider = AuthenticationProvider;
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
