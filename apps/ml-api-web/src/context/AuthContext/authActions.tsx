import {updateAxios, postRequest, history, getRequest} from '../../utils/api';
import {SignupFormValues} from '../../views/Signup/Signup';
import {pathOr, propEq, find} from 'ramda';
import {Dispatch} from 'react';
import * as Endpoints from '../../utils/endpoints';
import {LoginResponse, SignupResponse, SignupVerifyResponse, VerifyLoginResponse} from '../../types/api-responses';
import {LoginRequest, VerifySignupRequest, VerifyLoginRequest} from './types';
import {State} from './authReducer';
import {isError, getErrorMessage} from '../../utils/helpers';
import {
  invalidCredentials,
  errorMessage,
  invalidCode,
  RequestType,
  noNetworkConnection
} from '../../utils/error-messages';
import {MixPanel} from '../../MixPanel';

export const LOGIN_STARTED = 'LOGIN_STARTED',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_SUCCESS_WITHOUT_2FA = 'LOGIN_SUCCESS_WITHOUT_2FA',
  LOGIN_TOKEN_SUCCESS = 'LOGIN_TOKEN_SUCCESS',
  LOGOUT = 'LOGOUT',
  LOGIN_VERIFY_STARTED = 'LOGIN_VERIFY_STARTED',
  LOGIN_VERIFY_SUCCESS = 'LOGIN_VERIFY_SUCCESS',
  LOGIN_VERIFY_FAILED = 'LOGIN_VERIFY_FAILED',
  SIGNUP_INITIAL_STARTED = 'SIGNUP_INITIAL_STARTED',
  SIGNUP_INITIAL_SUCCESS = 'SIGNUP_INITIAL_SUCCESS',
  SIGNUP_INITIAL_FAILED = 'SIGNUP_INITIAL_FAILED',
  SIGNUP_STARTED = 'SIGNUP_STARTED',
  SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
  SIGNUP_FAILED = 'SIGNUP_FAILED',
  CLEAR_SIGNUP = 'CLEAR_SIGNUP',
  SIGNUP_COMPLETE = 'SIGNUP_COMPLETE';

const loginFailed = (message: string) => {
  return {type: LOGIN_FAILED, payload: message};
};
const loginSuccess = (data: { username: string; password: string }) => ({
  type: LOGIN_SUCCESS,
  payload: {data},
});
const loginSuccessWithout2FA = (token: string) => ({
  type: LOGIN_SUCCESS_WITHOUT_2FA,
  payload: {token},
});

export function login(email: string, pw: string, onLogin: (message: string | undefined) => void) {
  return async (dispatch: Dispatch<any>) => {
    let message = undefined;
    dispatch({type: LOGIN_STARTED});
    try {
      const {data: response} = await postRequest<LoginRequest, LoginResponse>(Endpoints.LOGIN, {
        email,
        password: pw,
      });

      if ('jwt_token' in response && response.jwt_token) {
        dispatch(loginSuccessWithout2FA(response.jwt_token));
      } else if ('twoFactorEnabled' in response && response.twoFactorEnabled) {
        dispatch(loginSuccess({username: email, password: pw}));
      } else {
        dispatch(loginFailed(invalidCredentials));
        message = invalidCredentials;
      }
    } catch (ex) {
      const responseStatus = pathOr<number>(0, ['response', 'status'], ex);
      message = responseStatus === 401 ? invalidCredentials : errorMessage;
      if (responseStatus === 423) {
        message = 'Your account has been locked. In order to get back the control, please reset you password from the link below';
      }
      dispatch(loginFailed(message));
    }
    onLogin(message);
  };
}

export function loginWithToken(jwt_token: string) {
  return (dispatch: any) => {
    dispatch({type: LOGIN_STARTED});
    dispatch({
      type: LOGIN_TOKEN_SUCCESS,
      payload: {jwt_token},
    });
    updateAxios();
  };
}

export function logout() {
  return (dispatch: any) => {
    MixPanel.track('Logout', {});
    dispatch({type: LOGOUT});
  };
}

const signUpFailed = (message: string) => {
  return {type: SIGNUP_INITIAL_FAILED, payload: message};
};
const signUpSuccess = (token: string, email: string) => ({
  type: SIGNUP_INITIAL_SUCCESS,
  payload: {token, email},
});
const verifySignupSuccess = () => ({
  type: SIGNUP_SUCCESS,
});
const verifySignupFailed = (message: string) => ({
  type: SIGNUP_FAILED,
  payload: message,
});

export function signUp(values: SignupFormValues, onSignup: (message?: string) => void) {
  return async (dispatch: any) => {
    let message: string | undefined = undefined;
    dispatch({type: SIGNUP_INITIAL_STARTED});
    postRequest<SignupFormValues, SignupResponse>(Endpoints.SIGNUP, values)
      .then(({data}) => {
        if (!isError(data) && 'jwt_token' in data) {
          dispatch(signUpSuccess(data.jwt_token, values.email));
        } else {
          message = invalidCredentials;
          dispatch(signUpFailed(message));
        }
      })
      .catch((err) => {
        message = getErrorMessage(RequestType.Signup, err);
        dispatch(signUpFailed(message));
      })
      .finally(() => {
        onSignup(message);
      });
  };
}

export const verifySignUp = (verificationCode: string, token: string, onSignup: () => void) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({type: SIGNUP_STARTED});
    postRequest<VerifySignupRequest, SignupVerifyResponse>(
      Endpoints.SIGNUP_VERIFY,
      {code: verificationCode},
      {headers: {Authorization: `Bearer ${token}`}},
    )
      .then(({status}) => {
        if (status === 201) {
          dispatch(verifySignupSuccess());
          dispatch({type: SIGNUP_COMPLETE});
          MixPanel.track('Email Verified', {});
          onSignup();
        } else {
          dispatch(verifySignupFailed(invalidCode));
        }
      })
      .catch((error) => {
        const message = getErrorMessage(RequestType.SignupVerify, error);
        dispatch(verifySignupFailed(message));
      });
  };
};
export const subscribePlan = (planID: string, token: string) => {
  return (dispatch: any) => {
    postRequest<{ planID: string }, {}>(
      Endpoints.UPDATE_USER_PLAN,
      {
        planID,
      },
      {headers: {Authorization: `Bearer ${token}`}},
    )
      .then(() => {
        dispatch({type: SIGNUP_COMPLETE});
        history.push('/signin');
      })
      .catch(() => {
      });
  };
};
export const clearSignup = () => ({type: CLEAR_SIGNUP});
const loginVerifySuccess = (data: VerifyLoginResponse) => ({
  type: LOGIN_VERIFY_SUCCESS,
  payload: data,
});
const loginVerifyFailed = (message: string) => ({
  type: LOGIN_VERIFY_FAILED,
  payload: message,
});
