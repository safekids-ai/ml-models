import React, { FunctionComponent, ElementType } from 'react';
import { Avatar, Tooltip } from '@mui/material';
import {makeStyles} from '@mui/styles'
import CustomScroll from 'simplebar-react';
import { NotificationsOutlined, LanguageOutlined } from '@mui/icons-material';
import 'simplebar/dist/simplebar.min.css';
import Logo from '../../svgs/Logo';
import { DashboardIcon, SettingsIcon, LogoutIcon, SearchIcon } from '../../svgs';
import { NavLink } from 'react-router-dom';
import { AppTheme } from '../../theme';
import { defaultTo, dissoc } from 'ramda';
import DummyContent from './components/DummyContent';
import { useAuth } from '../../context/AuthContext/AuthContext';
import NotificationPage from './components/NotificationPage/NotificationPage';
import { getFullName, getInitials } from '../../utils/helpers';

import SchoolActivity from './components/Activity/SchoolActivity';
import ConsumerActivity from './components/ConsumerActivity/ConsumerActivity';
import SchoolSettings from './components/SchoolSettings/SchoolSettings';
import WebsiteSettings from './components/WebsiteSettings/WebsiteSettings';
import { useSchoolUserContext } from '../../context/SchoolUserContext/SchoolUserContext';
import SearchPage from './components/SearchPage/SearchPage';
import ConsumerLogo from '../../components/ConsumerLogo/ConsumerLogo';

const useStyles = makeStyles((theme: AppTheme) => ({
    root: {
        width: '240px',
        background: '#fff',
    },
    body: {
        padding: '30px 25px 40px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxHeight: '100vh',
    },
    actionsWrapper: {
        flex: 1,
        '& .rcs-inner-container': {
            marginRight: '0 !important',
            width: '100%',
        },
    },
    logo: {
        textAlign: 'center',
        '& svg': {
            width: '114px',
        },
    },
    search: {
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '21px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minHeight: '18px',
    },
    primaryActions: {
        padding: '0px 0px 30px',
    },
    actions: {
        '& .sidebar-item-wrapper': {
            marginTop: '20px',
            cursor: 'pointer',
        },
        '& .sidebar-item': {
            height: '42px',
            paddingLeft: '21px',
            boxSizing: 'border-box',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textDecoration: 'none',
            outline: 'none',
            color: theme.palette.text.primary,
            '&.disabled': {
                color: theme.colors.lightGrey,
            },
            '&:not(.disabled)': {
                '&.active,&:hover': {
                    color: theme.palette.primary.main,
                    background: '#f7f7f7',
                    borderRadius: '6.9px',
                    outline: 'none',
                    '& svg': {
                        fill: theme.palette.primary.main,
                    },
                },
            },
            '& .sidebar-item-label': {
                marginLeft: '12px',
            },
            '& .badge': {
                justifySelf: 'flex-end',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.palette.primary.contrastText,
                background: theme.palette.primary.main,
                width: '19px',
                height: '19px',
                borderRadius: '50%',
                fontSize: '11px',
            },
        },
    },

    secondaryActions: {
        borderTop: `1px solid ${theme.colors.veryLightBlue}`,
        paddingTop: '10px',
    },
    user: {
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // cursor: "pointer",
        '&:hover': {
            // color: theme.palette.primary.main,
            // background: "#f7f7f7",
            // borderRadius: "6.9px",
        },
        '& .avatar': {
            width: '34px',
            height: '34px',
        },
        '& .user-name': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginLeft: '10px',
        },
    },
    scrollContainer: { maxHeight: 'calc(100vh - 242px)', overflow: 'auto' },
    upgrade: {},
    loadedImage: {
        width: '34px',
        height: '34px',
        borderRadius: '50%',
    },
}));
export type LinkType = {
    label: string;
    icon: ElementType;
    url: string;
    component: FunctionComponent<any>;
    hasBadge?: boolean;
};

export const schoolPrimaryLinks: LinkType[] = [
    {
        label: 'Search',
        icon: SearchIcon,
        url: '/search',
        component: SearchPage,
    },
    {
        label: 'Activity',
        icon: DashboardIcon,
        url: '/dashboard',
        component: SchoolActivity,
    },
    {
        label: 'Notifications',
        icon: NotificationsOutlined,
        url: '/notifications',
        component: NotificationPage,
    },
];

export const schoolSecondaryLinks: LinkType[] = [
    {
        label: 'Settings',
        icon: SettingsIcon,
        url: '/settings',
        component: SchoolSettings,
    },
    {
        label: 'Websites',
        icon: LanguageOutlined,
        url: '/websites',
        component: WebsiteSettings,
    },
];

export const consumerPrimaryLinks: LinkType[] = [
    {
        label: 'Activity',
        icon: DashboardIcon,
        url: '/dashboard',
        component: ConsumerActivity,
    },
    {
        label: 'Notifications',
        icon: NotificationsOutlined,
        url: '/notifications',
        component: NotificationPage,
    },
];
export const consumerSecondaryLinks: LinkType[] = [
    {
        label: 'Settings',
        icon: SettingsIcon,
        url: '/settings',
        component: WebsiteSettings,
    },
];
const Wrapper = (props: any) => {
    return <div {...dissoc('to', props)} />;
};
type ItemProps = {
    link: LinkType;
    notificationCount?: number;
    disabled?: boolean;
    onClick: () => void;
};
const SideBarItem = ({ link, notificationCount, disabled = false, onClick }: ItemProps) => {
    const Component = disabled ? Wrapper : NavLink;
    return (
        <div className="sidebar-item-wrapper">
            <Component to={disabled ? '' : link.url} className={`sidebar-item ${disabled ? 'disabled' : ''}`} onClick={onClick}>
                <link.icon />
                <span className="sidebar-item-label">{link.label}</span>
                {link.hasBadge && false && defaultTo(0, notificationCount) > 0 && <div className="badge">{notificationCount}</div>}
            </Component>
        </div>
    );
};

type SidebarProps = { notificationCount?: number; onClick: () => void };
const SideBar: React.FC<SidebarProps> = ({ notificationCount = 0, onClick }: SidebarProps) => {
    // const { userProfile, accountType, avatarUrl } = useUserContext();
    const { userProfile, avatarUrl, isAdmin } = useSchoolUserContext();
    const { logout } = useAuth();
    const classes = useStyles();
    const accountType = localStorage.getItem('account_type');
    const userFullName = getFullName(userProfile?.firstName || '', userProfile?.lastName || '');

    return (
        <div className={classes.root}>
            <div className={classes.body}>
                {accountType === 'SCHOOL' ? (
                    <div className={classes.logo}>
                        <a href="/">
                            <Logo />
                        </a>
                    </div>
                ) : (
                    <ConsumerLogo className={classes.logo} />
                )}

                <div className={classes.search}>
                    Welcome{' '}
                    <Tooltip title={userProfile?.firstName || ''}>
                        <span>{userProfile?.firstName || ''}</span>
                    </Tooltip>
                    !
                </div>
                <div className={classes.actionsWrapper}>
                    <CustomScroll className={classes.scrollContainer}>
                        <div className={`${classes.primaryActions} ${classes.actions}`}>
                            {(accountType === 'SCHOOL' ? schoolPrimaryLinks : consumerPrimaryLinks).map((link, index) => {
                                return (
                                    <SideBarItem
                                        key={index}
                                        link={link}
                                        notificationCount={notificationCount}
                                        disabled={link.component === DummyContent}
                                        onClick={onClick}
                                    />
                                );
                            })}
                        </div>
                        <div className={`${classes.secondaryActions} ${classes.actions}`}>
                            {(accountType === 'SCHOOL' ? (isAdmin ? schoolSecondaryLinks : []) : consumerSecondaryLinks).map((link, index) => {
                                return <SideBarItem key={index} link={link} disabled={link.component === DummyContent} onClick={onClick} />;
                            })}
                            <div onClick={logout} className="sidebar-item-wrapper">
                                <div className={`sidebar-item`}>
                                    <LogoutIcon />
                                    <span className="sidebar-item-label">Logout</span>
                                </div>
                            </div>
                        </div>
                    </CustomScroll>
                </div>

                <div className={classes.user}>
                    {avatarUrl ? (
                        <img src={avatarUrl} className={classes.loadedImage} alt="Avatar" />
                    ) : (
                        <Avatar className="avatar">{userFullName && getInitials(userFullName)}</Avatar>
                    )}
                    <span className="user-name">
                        <Tooltip title={userFullName || ''}>
                            <span>{userFullName || ''}</span>
                        </Tooltip>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
