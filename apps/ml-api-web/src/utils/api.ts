import Axios, {AxiosInstance, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig} from 'axios';
import {pathOr} from 'ramda';
import {createBrowserHistory} from 'history';
import * as Sentry from '@sentry/react';
import {logDebug, logError} from './helpers';
import {GET_NOTIFICATIONS} from './endpoints';
import {hasStorage} from '../constants';

export const history = createBrowserHistory();
const getUrl = () => {
  const url = window.location.origin.split(':');
  return url.length >= 2 ? url[0] + ':' + url[1] : 'http://localhost';
};
// const API_URL = 'https://api.safekids.dev/';
const API_URL = process.env.REACT_APP_API_URL || `${getUrl()}:4001/`;

logDebug('Using API:' + API_URL);

export const publicAPI = Axios.create({
  baseURL: API_URL,
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
});
type RequestMethod =
  | 'POST'
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'
  | undefined;
let privateAPI = publicAPI;
let interceptorKey = 2;
type ResponseInterceptor = {
  key: number;
  id: number;
  onSuccess: (response: AxiosResponse<any>) => AxiosResponse<any>;
  onError: (error: any) => Promise<never>;
};
let responseInterceptors: ResponseInterceptor[] = [
  {
    key: 1,
    id: 0,
    onSuccess: (response: AxiosResponse<any>) => {
      const {url = ''} = response.config || {};
      logDebug('Response from (' + url + ') : ', response.data);

      if (!pathOr(false, ['config', 'headers', 'dontRedirect'], response) && response.status === 401) {
        const accountType = localStorage.getItem('account_type');
        localStorage.removeItem('jwt_token');
        accountType === 'SCHOOL' ? history.push('/school-signin') : history.push('/signin');
        localStorage.removeItem('account_type');
      } else if (url !== GET_NOTIFICATIONS) {
        Sentry.addBreadcrumb({
          category: 'api-response',
          message: 'API response',
          level: Sentry.Severity.Info,
          data: {url: response.config?.url},
        });
      }
      return response;
    },
    onError: (error: any) => {
      const responseStatus = pathOr<number>(0, ['response', 'status'], error);
      const responseData = pathOr('', ['response', 'data'], error);
      logError(`Response Error on (${pathOr('', ['config', 'url'], error)}):`, responseData, ' Status code:', responseStatus);
      if (responseStatus === 401) {
        const accountType = localStorage.getItem('account_type');
        localStorage.removeItem('jwt_token');
        accountType === 'SCHOOL' ? history.push('/school-signin') : history.push('/signin');
        localStorage.removeItem('account_type');
      }
      Sentry.addBreadcrumb({
        category: 'api-error',
        message: 'Error in API response',
        level: Sentry.Severity.Error,
        data: {response: responseData},
      });
      return Promise.reject(error);
    },
  },
];
type RequestInterceptor = {
  key: number;
  id: number;
  onSuccess: (request: AxiosRequestConfig) => AxiosRequestConfig;
  onError: (error: any) => Promise<never>;
};
let requestInterceptors: RequestInterceptor[] = [
  {
    key: 1,
    id: 0,
    onSuccess: (request: AxiosRequestConfig) => {
      logDebug(request.method?.toUpperCase() + ' request sent to ' + request.url);
      return request;
    },
    onError: (error: any) => {
      const requestStatus = pathOr<number>(0, ['request', 'status'], error);
      logError('Error in Request: ', error.request, 'Status: ' + requestStatus);
      return Promise.reject(error);
    },
  },
];

export function addResponseInterceptor(onSuccess: (response: AxiosResponse<any>) => AxiosResponse<any>, onError: (error: any) => any): number {
  const newInterceptor = {
    onSuccess,
    onError,
    key: interceptorKey++,
    id: 0,
  };
  responseInterceptors.push(setResponseInterceptor(newInterceptor));
  return interceptorKey - 1;
}

export function removeResponseInterceptor(keyToRemove: number) {
  const index = responseInterceptors.findIndex(({key}) => {
    return key === keyToRemove;
  });
  privateAPI.interceptors.response.eject(responseInterceptors[index].id);
  delete responseInterceptors[index];
}

export function addRequestInterceptor(onSuccess: (response: AxiosRequestConfig) => AxiosRequestConfig, onError: (error: any) => any): number {
  const newInterceptor = {
    onSuccess,
    onError,
    key: interceptorKey++,
    id: 0,
  };
  requestInterceptors.push(setRequestInterceptor(newInterceptor));
  return interceptorKey - 1;
}

export function removeRequestInterceptor(keyToRemove: number) {
  const index = requestInterceptors.findIndex(({key}) => {
    return key === keyToRemove;
  });
  privateAPI.interceptors.request.eject(responseInterceptors[index].id);
  delete requestInterceptors[index];
}

function setResponseInterceptor(interceptor: Omit<ResponseInterceptor, 'id'>) {
  const id = privateAPI.interceptors.response.use(interceptor.onSuccess, interceptor.onError);
  return {...interceptor, id};
}

function setRequestInterceptor(interceptor: Omit<RequestInterceptor, 'id'>) {
  const id = privateAPI.interceptors.request.use(
    interceptor.onSuccess as (value: InternalAxiosRequestConfig<any>) => InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>>,
    interceptor.onError
  );
  return { ...interceptor, id };
}

function setInterceptors() {
  responseInterceptors = responseInterceptors.map(setResponseInterceptor);
  requestInterceptors = requestInterceptors.map(setRequestInterceptor);
}

setInterceptors();

export function getPrivateAPI(): AxiosInstance {
  return privateAPI;
}

export const getPublicAPI = (): AxiosInstance => publicAPI;

export function httpRequest<T, R>(
  url: string,
  data: T,
  method: RequestMethod = 'POST',
  config?: AxiosRequestConfig,
  setQueryParams?: boolean
): Promise<AxiosResponse<R>> {
  return privateAPI.request<T, AxiosResponse<R>>({
    url,
    method,
    data,
    ...(method === 'GET' || setQueryParams ? {params: data} : {}),
    ...config,
  });
}

export function postRequest<T = any, R = any>(url: string, data: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
  return httpRequest<T, R>(url, data, 'POST', config);
}

export function getRequest<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
  return httpRequest<T, R>(url, data, 'GET', config);
}

export function putRequest<T, R>(url: string, data: T, config?: AxiosRequestConfig, setQueryParams?: boolean): Promise<AxiosResponse<R>> {
  return httpRequest<T, R>(url, data, 'PUT', config, setQueryParams);
}

export function deleteRequest<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
  return httpRequest<T, R>(url, data, 'DELETE', config);
}

export function patchRequest<T, R>(url: string, data: T, config?: AxiosRequestConfig, setQueryParams?: boolean): Promise<AxiosResponse<R>> {
  return httpRequest<T, R>(url, data, 'PATCH', config, setQueryParams);
}

export const updateAxios = () => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    privateAPI = Axios.create({
      baseURL: API_URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } else {
    privateAPI = publicAPI;
  }
  setInterceptors();
};
