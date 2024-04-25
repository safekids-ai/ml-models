import React, { useEffect, useState, useCallback } from 'react';
import { addResponseInterceptor } from '../utils/api';
import { identity, pathOr } from 'ramda';
import { Snackbar, makeStyles, SnackbarCloseReason } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import * as Sentry from '@sentry/react';
import { logDebug } from '../utils/helpers';
import { isProduction } from '../constants';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiAlert-root': {
            padding: '12px 18px',
            '& .MuiAlert-message': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            '& .MuiAlert-action': {
                padding: '0px 18px 0px 8px',
                textDecoration: 'underline',
            },
        },
    },
    refresh: {
        display: 'flex',
        flexDirection: 'column',
        padding: '4px 8px',
        cursor: 'pointer',
        color: theme.palette.primary.main,
        '&:hover': {
            background: 'rgba(247, 39, 74, 0.2)',
        },
        '& .text': {
            fontSize: '13px',
            marginBottom: '2px',
            height: '16px',
        },
        '& .underline': {
            height: '1px',
            background: theme.palette.primary.main,
        },
    },
}));
const NoNetworkNotification: React.FC<{ children: any }> = ({ children }) => {
    const classes = useStyles();
    const [visible, setVisible] = useState(false);
    useEffect(function onMount() {
        addResponseInterceptor(identity, (error) => {
            const responseStatus = pathOr<number>(-1, ['response', 'status'], error);
            if (responseStatus < 0) {
                setVisible(true);
                if (navigator.onLine && isProduction) {
                    logDebug('Could not connect to API Server');
                    Sentry.captureMessage('Could not connect to API Server');
                }
            }
            return Promise.reject(error);
        });
    }, []);
    const onRefresh = useCallback(() => {
        window.location.reload();
    }, []);
    const onClose = useCallback(
        (event: any, reason: SnackbarCloseReason) => {
            if (reason !== 'clickaway') setVisible(false);
        },
        [setVisible],
    );
    return (
        <>
            {children}
            {visible && (
                <Snackbar
                    className={classes.root}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={visible}
                    onClose={onClose}
                    autoHideDuration={5000}
                >
                    <Alert severity="error">
                        Unable to connect please check your internet connection.
                        <div className={classes.refresh} onClick={onRefresh}>
                            <div className="text">Refresh</div>
                            <div className="underline" />
                        </div>
                    </Alert>
                </Snackbar>
            )}
        </>
    );
};
export default NoNetworkNotification;
