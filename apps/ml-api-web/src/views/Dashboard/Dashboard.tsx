import React, { useState, useEffect } from 'react';
import { ClickAwayListener } from '@mui/material';
import {makeStyles} from '@mui/styles'
import { Routes, Route, Navigate, useLocation} from 'react-router-dom';

import { useIdleTimer, workerTimers } from 'react-idle-timer';
import MenuIcon from '@mui/icons-material/Menu';

import SideBar from './SideBar';
import { AppTheme } from '../../theme';
import { consumerPrimaryLinks, consumerSecondaryLinks, schoolPrimaryLinks, schoolSecondaryLinks } from './SideBar';
import { pathOr } from 'ramda';
import { history, getRequest } from '../../utils/api';
import { GET_ONBOARDING_STATUS } from '../../utils/endpoints';
import ScrollContainer from '../../components/ScrollContainer';
import { useMobile } from '../../utils/hooks';
import { StyleProps } from './types';
import { logError } from '../../utils/helpers';
import { SchoolUserProvider } from '../../context/SchoolUserContext/SchoolUserContext';
import { useAuth } from '../../context/AuthContext/AuthContext';

const useStyles = makeStyles((theme: AppTheme) => ({
    root: {
        background: theme.colors.paleGrey,
        display: 'flex',
        minHeight: '100vh',
    },
    content: {
        padding: ({ isMobile = false }: StyleProps) => (isMobile ? '30px 20px 20px' : '100px 80px 20px'),
        flex: '1',
        maxHeight: '100vh',
        overflow: 'auto',
    },
    mobileSidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99,
    },
    sidebarToggle: {
        margin: '20px 0 0 20px',
        padding: '12px',
        background: 'white',
        borderRadius: '6.9px',
        border: '1px solid #f3f5f8',
        display: 'flex',
    },
    notification: {
        padding: '18px',
        borderRadius: '6.9px',
        fontSize: '13px',
        '& .action': {
            textDecoration: 'underline',
            marginLeft: '15px',
            cursor: 'pointer',
            '&:first-of-type': {
                marginLeft: '10px',
            },
        },
        '& .icon': { height: '24px', marginRight: '6px' },
    },
}));

const Dashboard: React.FC = () => {
    const isMobile = useMobile();
    const classes = useStyles({ isMobile });
    const location = useLocation();
    const fromOnboarding = pathOr(false, ['state', 'fromOnboarding'], location);
    const { logout } = useAuth();
    const onIdle = () => {
        logout();
    };

    useIdleTimer({
        onIdle,
        timeout: 1000 * 60 * 15, // 15 mins
        stopOnIdle: true,
        startOnMount: true,
        crossTab: true,
        name: 'idle-timer',
        timers: workerTimers,
    });

    const accountType = localStorage.getItem('account_type');
    useEffect(() => {
        getRequest<{}, any[]>(GET_ONBOARDING_STATUS, {})
            .then((response: any) => {
                if (response.data.onBoardingStatus === 'IN_PROGRESS' && accountType === 'SCHOOL') {
                    history.push('/school-onboarding');
                } else if (response.data.onBoardingStatus === 'IN_PROGRESS' && accountType === 'CONSUMER') {
                    history.push('/onboarding');
                }
            })
            .catch((err) => {
                logError('GET ONBOARDING STATUS', err);
            });
    }, [accountType]);
    const [state, setState] = useState({
        loading: !fromOnboarding,
        sidebarOpen: false,
        notificationOpen: true,
    });

    const sidebarContent = <SideBar notificationCount={0} onClick={() => setState((state) => ({ ...state, sidebarOpen: false }))} />;
    const sidebar = isMobile ? (
        <div className={classes.mobileSidebar}>
            {state.sidebarOpen ? (
                <ClickAwayListener
                    mouseEvent="onMouseDown"
                    touchEvent="onTouchStart"
                    onClickAway={() => {
                        setState((state) => ({ ...state, sidebarOpen: false }));
                    }}>
                    <div>{sidebarContent}</div>
                </ClickAwayListener>
            ) : (
                <div
                    className={classes.sidebarToggle}
                    onClick={() => {
                        setState((state) => ({ ...state, sidebarOpen: true }));
                    }}>
                    <MenuIcon />
                </div>
            )}
        </div>
    ) : (
        sidebarContent
    );
    return (
        <div className={classes.root}>
            {sidebar}
            <ScrollContainer className={classes.content}>
                <Routes>
                    {(accountType === 'SCHOOL' ? schoolPrimaryLinks : consumerPrimaryLinks).map((link, index) => {
                        return <Route key={`primaryLink-${index}`} path={link.url} element={<link.component/>} />;
                    })}
                    {(accountType === 'SCHOOL' ? schoolSecondaryLinks : consumerSecondaryLinks).map((link, index) => {
                        return <Route key={`secondaryLink-${index}`} path={link.url} element={<link.component/>} />;
                    })}
                    <Route element={<Navigate to="/dashboard" />} />
                </Routes>
            </ScrollContainer>
        </div>
    );
};
const DashboardWrapper: React.FC = (props: any) => {
    return (
        <SchoolUserProvider>
            <Dashboard />
        </SchoolUserProvider>
    );
};
export default DashboardWrapper;
