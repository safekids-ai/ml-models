import { pickBy, either, isEmpty, isNil, complement, equals, findIndex, splitAt, trim, all, pipe, head, keys, pathOr, filter, join } from 'ramda';
import { Error, FieldError } from '../types/api-responses';
import { ErrorMessages, RequestType, noNetworkConnection, errorMessage } from '../utils/error-messages';
import * as Sentry from '@sentry/react';
import { isProduction } from '../constants';

export const isNothing = either(isEmpty, isNil);

export const isSomething = complement(isNothing);

export const extractErrors = pickBy(isSomething);

export const getShortName = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length > 1) return `${names[0]} ${names[1][0] || ''}.`;
    return fullName;
};

export const getBaseDomain = (url: string) => {
    if (!url) return null;
    let tempUrl: any = url.replace(/(http?:\/\/)?(https?:\/\/)?(www.)?/i, '');
    if (tempUrl.split('/').length > 1) tempUrl = tempUrl.split('/')[0];
    tempUrl = tempUrl.split('.');
    if (tempUrl.length === 2) return tempUrl.join('.');
    let composeUrl = tempUrl.slice(1 - tempUrl.length).join('.');
    if (composeUrl.indexOf('/') !== -1) return composeUrl.split('/')[0];
    console.log(url, ' < composeUrl > ', composeUrl);
    return composeUrl;
};

export const getKidDateOfBirthRange = () => {
    let currentYear = new Date().getFullYear(),
        years: any = [];
    let maxAge = 18,
        counter = 0;
    while (counter <= maxAge) {
        const calcYear: number = currentYear - counter;
        years = [calcYear.toString(), ...years];
        ++counter;
    }
    return years;
};

export const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[1][0] || ''}`.toUpperCase();
    return names[0][0].toUpperCase();
};

export const getFirstAndLastNames = (fullName: string): { firstName: string; lastName: string } => {
    const spaceIndex = findIndex<string>(equals(' '), fullName.split(''));
    if (spaceIndex < 0) return { firstName: fullName, lastName: '' };
    const name = filter((word) => trim(word).length > 0, fullName.split(' ')).join(' ');

    const [firstName, lastName] = splitAt(spaceIndex, name);

    return { firstName, lastName: trim(lastName) };
};

export const getFullName = (firstName: string, lastName: string) => {
    if (lastName) return firstName + ' ' + lastName;
    return firstName;
};

export const getFormattedName = (name: string) => {
    const names = filter((word) => trim(word).length > 0, name.split(' '));
    return join(' ', names);
};
export const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export const transformErrors = (errors: Error) => {
    return typeof errors === 'string'
        ? errors
        : errors.reduce<{
              [field: string]: string[];
          }>((result, error) => {
              result[error.property] = Object.keys(error.constraints);
              return result;
          }, {});
};

export const isError = (response: any): response is Error => {
    return typeof response === 'string' || isErrorObject(response);
};
export const isErrorObject = (response: any): response is FieldError[] => {
    return (
        Array.isArray(response) &&
        response.length > 0 &&
        all((error) => error.property !== undefined && error.constraints !== undefined, response as FieldError[])
    );
};

const getFieldErrorMessage = (context: RequestType, response: FieldError[]): string => {
    const errorField = pathOr('', [0, 'property'], response);
    const firstError = pipe(pathOr({}, [0, 'constraints']), keys, head)(response) as string;
    return pathOr('', [context, errorField, firstError], ErrorMessages);
};
export function getErrorMessage(context: RequestType, error: any, fallbackMessage: string = errorMessage) {
    const response = pathOr([], ['response', 'data'], error);
    let message: string;
    if (isNothing(response)) message = noNetworkConnection;
    else if (isErrorObject(response)) {
        message = getFieldErrorMessage(context, response);
    } else {
        message = response as string;
    }
    return message || fallbackMessage;
}

export const sendError = (error: any) => {
    Sentry.captureException(error);
};
export enum LogType {
    Debug,
    Info,
    Warning,
    Error,
}
export const log = (tag: string = '', type: LogType = LogType.Debug, ...message: any[]) => {
    let logFunction = console.log;
    switch (type) {
        case LogType.Error:
            logFunction = console.error;
            break;
        case LogType.Info:
            logFunction = console.info;
            break;
        case LogType.Warning:
            logFunction = console.warn;
    }
    logFunction(tag, ...message);
};
export const logDebug = (tag: string, ...params: any[]) => {
    if (!isProduction) log(tag, LogType.Debug, ...params);
};
export const logMessage = (tag: string, ...params: any[]) => {
    log(tag, LogType.Debug, ...params);
};

export const logInfo = (tag: string, ...params: any[]) => log(tag, LogType.Info, ...params);
export const logError = (tag: string, ...params: any[]) => log(tag, LogType.Error, ...params);

export const logWarning = (tag: string, ...params: any[]) => log(tag, LogType.Warning, ...params);

export type CancellablePromise = { promise: Promise<any>; cancel: () => void };
export const cancellablePromise = (promise: Promise<any>): CancellablePromise => {
    let isCanceled = false;

    const wrappedPromise = new Promise<any>((resolve, reject) => {
        promise.then(
            (value) => (isCanceled ? reject({ isCanceled, value }) : resolve(value)),
            (error) => reject({ isCanceled, error })
        );
    });

    return {
        promise: wrappedPromise,
        cancel: () => (isCanceled = true),
    };
};

export const delay = (n: number) => new Promise((resolve) => setTimeout(resolve, n));
/*!
 * Check if an element is out of the viewport
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}  elem The element to check
 * @return {Object}     A set of booleans for each side of the element
 */
export const isOutOfViewport = function (elem: any) {
    // Get element's bounding
    const bounding = elem.getBoundingClientRect();

    // Check if it's out of the viewport on each side
    const out: any = {};
    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    out.any = out.top || out.left || out.bottom || out.right;
    out.all = out.top && out.left && out.bottom && out.right;

    return out;
};

export function isPromise(p: any) {
    if (typeof p === 'object' && typeof p.then === 'function') {
        return true;
    }

    return false;
}
