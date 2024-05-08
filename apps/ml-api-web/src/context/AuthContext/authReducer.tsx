import {
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGOUT,
    SIGNUP_INITIAL_SUCCESS,
    SIGNUP_INITIAL_FAILED,
    SIGNUP_SUCCESS,
    SIGNUP_FAILED,
    SIGNUP_STARTED,
    LOGIN_TOKEN_SUCCESS,
    LOGIN_VERIFY_STARTED,
    LOGIN_VERIFY_SUCCESS,
    LOGIN_VERIFY_FAILED,
    LOGIN_STARTED,
    LOGIN_SUCCESS_WITHOUT_2FA,
    CLEAR_SIGNUP,
    SIGNUP_COMPLETE,
} from './authActions';
import { updateAxios } from '../../utils/api';

export type State = {
    loggedIn: boolean;
    loading: boolean;
    signup?: {
        message?: string;
        registerToken?: string | undefined;
        success?: boolean;
        email?: string;
    };
    login?: {
        message?: string;
        token?: string | undefined;
        success?: boolean;
        TwoFARequired?: boolean;
        data?: { username?: string; password?: string };
    };
};
const initialState: State = {
    loggedIn: false,
    loading: true,
    signup: { registerToken: undefined },
};
export const authReducer = (state: State = initialState, action: any) => {
    switch (action.type) {
        case LOGIN_STARTED: {
            return { ...state, login: { ...state.login, message: undefined } };
        }

        case LOGIN_SUCCESS: {
            return {
                ...state,
                login: {
                    ...state.login,
                    TwoFARequired: true,
                    data: action.payload.data,
                },
            };
        }
        case LOGIN_TOKEN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                loading: false,
                login: {
                    ...state.login,
                    success: true,
                    token: action.payload.jwt_token,
                },
            };
        case LOGIN_FAILED:
            localStorage.removeItem('jwt_token');
            return {
                ...state,
                loggedIn: false,
                loading: false,
                login: { ...state.login, message: action.payload, success: false },
            };
        case LOGIN_SUCCESS_WITHOUT_2FA:
            localStorage.setItem('jwt_token', action.payload.token || '');
            localStorage.setItem('account_type', 'CONSUMER');

            updateAxios();
            return {
                ...state,
                loggedIn: true,
                loading: false,
                login: {
                    ...state.login,
                    success: true,
                    ...action.payload,
                },
            };
        case LOGIN_VERIFY_STARTED:
            return {
                ...state,
                login: { ...state.login, message: undefined, success: undefined },
            };

        case LOGIN_VERIFY_SUCCESS:
            localStorage.setItem('jwt_token', action.payload.jwt_token || '');
            localStorage.setItem('account_type', 'CONSUMER');
            updateAxios();
            return {
                ...state,
                loggedIn: true,
                loading: false,
                login: { ...state.login, success: true, message: undefined, data: {} },
            };

        case LOGIN_VERIFY_FAILED:
            return {
                ...state,
                login: { ...state.login, success: false, message: action.payload },
            };
        case SIGNUP_STARTED:
            return {
                ...state,
                signup: { ...state.signup, message: undefined, success: undefined },
            };
        case SIGNUP_SUCCESS:
            // localStorage.setItem("token", state.signup?.registerToken || "");
            // updateAxios();
            return {
                ...state,
                loggedIn: false,
                loading: false,
                // signup: {},
            };

        case SIGNUP_COMPLETE:
            return { ...state, signup: {} };
        case SIGNUP_FAILED:
            return {
                ...state,
                signup: { ...state.signup, success: false, message: action.payload },
            };
        case SIGNUP_INITIAL_SUCCESS:
            return {
                ...state,
                signup: {
                    ...state.signup,
                    registerToken: action.payload.token,
                    email: action.payload.email,
                    message: undefined,
                },
            };
        case SIGNUP_INITIAL_FAILED:
            return {
                ...state,
                signup: {
                    ...state.signup,
                    success: undefined,
                    message: action.payload,
                },
            };
        case LOGOUT:
            localStorage.removeItem('jwt_token');
            return { loggedIn: false, loading: false };
        case CLEAR_SIGNUP:
            return { ...state, signup: {} };
        default:
            return state;
    }
};
