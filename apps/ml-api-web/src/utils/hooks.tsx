import React, { useState, useMemo, useCallback, ReactNode, useRef, useEffect } from 'react';
import { Snackbar, useMediaQuery } from '@mui/material';
import Alert from '@mui/material/Alert';

import { cancellablePromise, delay, CancellablePromise } from './helpers';
import { AppTheme } from '../theme';

type MessageType = 'error' | 'success' | 'info' | 'warning' | undefined;
type State = {
    message: string | ReactNode;
    open: boolean;
    type: MessageType;
};
export const useMessagePopup = (
    type: MessageType = 'error',
    anchorOrigin: {
        horizontal: 'center' | 'left' | 'right';
        vertical: 'bottom' | 'top';
    } = { horizontal: 'center', vertical: 'bottom' },
) => {
    const [state, setState] = useState<State>({ message: '', open: false, type });
    const setMessage = useCallback(
        (message: string | ReactNode, type?: MessageType) =>
            setState((state) => ({
                ...state,
                open: true,
                message,
                type: type || state.type,
            })),
        [setState],
    );
    const onClose = useCallback(() => setState((state) => ({ ...state, open: false })), [setState]);
    const messageComponent = useMemo(
        () => (
            <Snackbar anchorOrigin={anchorOrigin} autoHideDuration={3000} open={state.open} onClose={onClose}>
                <Alert severity={state.type} onClose={onClose}>
                    {state.message}
                </Alert>
            </Snackbar>
        ),
        [state, onClose, anchorOrigin],
    );
    return { setMessage, messageComponent };
};
export const useCancellablePromises = () => {
    const pendingPromises = useRef<CancellablePromise[]>([]);

    const appendPendingPromise = (promise: CancellablePromise) => (pendingPromises.current = [...pendingPromises.current, promise]);

    const removePendingPromise = (promise: CancellablePromise) =>
        (pendingPromises.current = pendingPromises.current.filter((p: CancellablePromise) => p !== promise));

    const clearPendingPromises = () => pendingPromises.current.map((p: CancellablePromise) => p.cancel());

    const api = {
        appendPendingPromise,
        removePendingPromise,
        clearPendingPromises,
    };

    return api;
};

export const useClickPreventionOnDoubleClick = (onClick: () => void, onDoubleClick: () => void) => {
    const api = useCancellablePromises();

    const handleClick = () => {
        api.clearPendingPromises();
        const waitForClick = cancellablePromise(delay(300));
        api.appendPendingPromise(waitForClick);

        return waitForClick.promise
            .then(() => {
                api.removePendingPromise(waitForClick);
                onClick();
            })
            .catch((errorInfo: any) => {
                api.removePendingPromise(waitForClick);
                if (!errorInfo.isCanceled) {
                    throw errorInfo.error;
                }
            });
    };

    const handleDoubleClick = () => {
        api.clearPendingPromises();
        onDoubleClick();
    };

    return [handleClick, handleDoubleClick];
};
export function usePrevious(value: any) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef(null);

    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes

    // Return previous value (happens before update in useEffect above)
    return ref.current;
}
export const useMobile = () => {
    const isMobile = useMediaQuery((theme: AppTheme) => theme.breakpoints.down('md'));
    return isMobile;
};
