import React, { useState, useEffect } from 'react';
import { API_HEARTBEAT, E2E_HEARTBEAT } from '../utils/endpoints';
import { getRequest } from '../utils/api';
import Logo from '../svgs/Logo';
import Loader from './Loader';
import { DoneIcon, CancelIcon } from '../svgs';
import { makeStyles } from '@mui/material';
import { AppTheme, customProperties } from '../theme';

const useStyles = makeStyles((theme: AppTheme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    },
    card: {
        width: '50vw',
        padding: '32px 64px',
        background: '#fff',
        borderRadius: '6.9px',
        border: `1px solid ${theme.colors.lightPeriwinkle}`,
    },
    logo: {
        textAlign: 'center',
    },
    failIcon: {
        fill: customProperties.colors.red,
        color: customProperties.colors.red,
    },
    service: {
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gridGap: '60px',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: '28px',
        fontWeight: 'bold',
    },
    icon: {
        width: '48px',
        height: '48px',
        '& svg': {
            width: '48px',
            height: '48px',
        },
    },
}));
const HeartBeat = () => {
    const classes = useStyles();
    const [e2eState, setE2EState] = useState({ loading: true, success: false });
    const [apiState, setAPIState] = useState({ loading: true, success: false });
    useEffect(() => {
        getRequest(API_HEARTBEAT, {})
            .then(() => setAPIState({ loading: false, success: true }))
            .catch(() => setAPIState({ loading: false, success: false }));
    }, []);
    useEffect(() => {
        getRequest(E2E_HEARTBEAT, {})
            .then(() => setE2EState({ loading: false, success: true }))
            .catch(() => setE2EState({ loading: false, success: false }));
    }, []);
    return (
        <div className={classes.root}>
            <div className={classes.card}>
                <div className={classes.logo}>
                    <a href="https://www.safekids.ai">
                        <Logo />
                    </a>
                </div>
                <div className={classes.service}>
                    <div className={classes.name}>API Server</div>
                    <div className={classes.icon}>
                        {apiState.loading ? (
                            <Loader width="48px" height="48px" pathColor="rgba(247, 39, 74, 0.4)" loaderColor={'rgba(247, 39, 74, 1)'} />
                        ) : apiState.success ? (
                            <DoneIcon color={customProperties.colors.seaweedGreen} />
                        ) : (
                            <CancelIcon className={classes.failIcon} />
                        )}
                    </div>
                </div>
                <div className={classes.service}>
                    <div className={classes.name}>E2E</div>
                    <div className={classes.icon}>
                        {e2eState.loading ? (
                            <Loader width="48px" height="48px" pathColor="rgba(247, 39, 74, 0.4)" loaderColor={'rgba(247, 39, 74, 1)'} />
                        ) : e2eState.success ? (
                            <DoneIcon color={customProperties.colors.seaweedGreen} />
                        ) : (
                            <CancelIcon className={classes.failIcon} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HeartBeat;
