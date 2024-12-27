import React, { useState, useEffect } from 'react';
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    Button,
    Tooltip,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ExpandMore } from '@mui/icons-material';
import moment from 'moment';

import { AppTheme } from '../../../../theme';
import { getRequest, patchRequest } from '../../../../utils/api';
import { GET_NOTIFICATION_ACTIVITIES_MESSAGES, UPDATE_USER_ACCESS } from '../../../../utils/endpoints';
import { logError } from '../../../../utils/helpers';
import { useMobile } from '../../../../utils/hooks';
import { useUserContext } from '../../../../context/UserContext/UserContext';
import { StyleProps } from '../../types';
import { Notification, PrrMessagesBody } from './NotificationPage.type';
import NotificationUserIcon from '../../../../svgs/NotificationUserIcon';
import NoDataAvailable from '../Activity/NoDataAvailable';

const useStyles = makeStyles((theme: AppTheme) => ({
    root: { width: '100%', textAlign: 'left' },
    content: {
        width: 'fit-content',
        minWidth: '100%',
        margin: '40px',
        backgroundColor: 'white',
        padding: '15px 15px 0 15px',
        borderRadius: '10px',
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: ({ isMobile = false }: StyleProps) => (isMobile ? '80px' : 'unset'),
        '& svg': {
            marginLeft: ({ isMobile = false }: StyleProps) => (isMobile ? '15px' : '55px'),
            cursor: 'pointer',
        },
    },
    spinner: {
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    notificationContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        '& span, & p': {
            fontFamily: 'Lato',
            fontSize: 15,
        },
    },
    notificationUserIcon: {
        width: '70px',
        height: '70px',
    },
    font10: {
        fontSize: '10px',
    },
    font15: {
        fontSize: 15,
    },
    font18: {
        fontSize: 18,
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        width: 450,
    },
    rightContainer: {
        paddingLeft: 60,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: 'inherit',
        justifyContent: 'space-between',
    },
    accordion: {
        marginBottom: 15,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '&:before': { display: 'none' },
        '& .MuiAccordionSummary-root.Mui-disabled': {
            opacity: 1,
        },
    },
    accordionSummary: {
        borderRadius: '10px !important',
        border: '1px solid #de350b',
        backgroundColor: 'white',
    },
    accordionDetails: {
        padding: '20px 31px',
        border: '1px solid #f57f35',
        borderRadius: '10px !important',
        borderTop: 'none',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
    },
    expandIcon: {
        transform: 'rotate(-90deg)',
    },
    restrictionBar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    buttonDark: {
        margin: '5px 10px 0px 0px',
        width: 120,
        backgroundColor: '#fff',
        color: '#f7274a',
        border: '1px solid #f7274a',
        fontSize: 15,
        height: 40,
        letterSpacing: 1.25,
        borderRadius: 6.9,
        '&:hover': {
            color: '#fff',
            backgroundColor: '#f7274a',
        },
    },
    revealButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Merriweather',
        fontSize: 15,
        fontWeight: 900,
        margin: '0 0 40px 20px',
    },
    queryText: {
        fontSize: '20px',
        color: '#4a4a4a',
        marginBottom: 5,
    },
    divider: {
        marginTop: 15,
        width: '100%',
        border: 'none',
        borderBottom: '2px solid black',
    },
    messageBody: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    notificationUserIconContainer: {
        '& svg': {
            height: 50,
            width: 50,
        },
    },
    responses: {
        display: 'flex',
        flexDirection: 'column',
    },
    answers: {
        fontSize: 16,
    },
    teacherName: {
        color: '#f7274a',
    },
    dataContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        margin: '20px 20px 20px 0',
        height: '95%',
        borderRadius: 10,
    },
    interceptedUrl: {
        fontSize: '15px',
        maxWidth: '375px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    dummyIcon: {
        width: '24px',
        height: '24px',
    },
}));

const NotificationPage: React.FC = () => {
    const { userProfile } = useUserContext();
    const isMobile = useMobile();
    const classes = useStyles({ isMobile });
    const [notification, setNotification] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedNotifications, setExpandedNotifications] = useState<any>();
    const accountType = localStorage.getItem('account_type');

    useEffect(() => {
        getRequest<{}, any>(GET_NOTIFICATION_ACTIVITIES_MESSAGES, {})
            .then((response) => {
                const payload = response.data as Notification[];
                if (payload.length > 0) {
                    setNotification(payload);
                }
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                logError('GET USERS', err);
            });
    }, [userProfile]);

    const clearAccess = (userId: number, i: any) => {
        patchRequest<{}, any[]>(UPDATE_USER_ACCESS.replace('{userId}', userId.toString()), { limit: false }, {}, true)
            .then(() => {
                const updatedNotifications = [...notification].map((data) => (data.userId === userId ? { ...data, accessLimited: false } : data));
                setNotification(updatedNotifications);
                if (!updatedNotifications[i].accessLimited && hasNoMessages(i)) {
                    const newExpandedObj = { ...expandedNotifications };
                    newExpandedObj[`panel${i}`] = false;
                    setExpandedNotifications(newExpandedObj);
                }
            })
            .catch((err) => {
                logError('KID ACCESS', err);
            });
    };

    const parseText = (text: string) => {
        const div = document?.createElement('div');
        div.innerHTML = text;
        return div?.innerText || text;
    };

    const handleExpand = (panel: any, i: number) => (event: any, isExpanded: boolean) => {
        const newExpandedObj = { ...expandedNotifications };
        if (newExpandedObj.hasOwnProperty(panel)) {
            if (!(!notification[i].accessLimited && hasNoMessages(i))) {
                newExpandedObj[panel] = isExpanded;
            }
        } else {
            if (!(!notification[i].accessLimited && hasNoMessages(i))) {
                newExpandedObj[panel] = true;
            }
        }
        setExpandedNotifications(newExpandedObj);
    };

    const hasNoMessages = (i: number) => {
        return notification[i].prrMessages === null || !notification[i].prrMessages[0]?.responses?.length;
    };

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="h4">
                Notifications
            </Typography>
            <div className={classes.content}>
                {loading ? (
                    <div className={classes.spinner}>
                        <CircularProgress size={25} color="primary" />
                    </div>
                ) : notification.length ? (
                    <>
                        <div className={classes.revealButtonContainer}>
                            <span>Coached Engagement</span>
                        </div>
                        {notification.map((data: Notification, i: number) => {
                            const url = data.fullWebUrl || data.webUrl;
                            return (
                                <>
                                    <Accordion
                                        className={classes.accordion}
                                        expanded={!!expandedNotifications && expandedNotifications[`panel${i}`] === true}
                                        onChange={handleExpand(`panel${i}`, i)}
                                    >
                                        <AccordionSummary
                                            className={classes.accordionSummary}
                                            expandIcon={!data?.accessLimited && hasNoMessages(i) ? <div className={classes.dummyIcon}></div> : <ExpandMore />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <div className={classes.notificationContainer}>
                                                <div className={classes.leftContainer}>
                                                    <div className={classes.notificationUserIconContainer}>
                                                        <NotificationUserIcon />
                                                    </div>
                                                    <div style={{ paddingLeft: 15 }}>
                                                        <Typography
                                                            className={classes.font15}
                                                            style={{
                                                                fontWeight: 'bold',
                                                                lineBreak: 'anywhere',
                                                            }}
                                                        >
                                                            {data.firstName} {data.lastName}
                                                        </Typography>
                                                        <Typography className={classes.font10} style={{ paddingTop: 5 }}>
                                                            {data.schoolName}
                                                        </Typography>
                                                        <Typography className={classes.font10} style={{ paddingTop: 5 }}>
                                                            Message to:{' '}
                                                            <span className={classes.teacherName}>{data.teacherName ? data.teacherName : 'None Selected'}</span>
                                                        </Typography>
                                                    </div>
                                                </div>
                                                <div className={classes.rightContainer}>
                                                    <div>
                                                        <Typography className={classes.font10}>Last Intercept:</Typography>
                                                        <Tooltip title={url || ''}>
                                                            <Typography className={classes.interceptedUrl} style={{ fontWeight: 'bold' }}>
                                                                {url}
                                                            </Typography>
                                                        </Tooltip>
                                                        <Typography className={classes.font10} style={{ paddingTop: 5 }}>
                                                            {data.prrCategory}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ paddingLeft: 20 }}>
                                                        <Typography className={classes.font15} style={{ fontWeight: 'bold' }}>
                                                            Occurring on:
                                                        </Typography>
                                                        <Typography className={classes.font10}>
                                                            {moment(new Date(data.activityTime)).format('ddd MMM, DD YYYY')}
                                                        </Typography>
                                                        <Typography className={classes.font10}>
                                                            {moment(new Date(data.activityTime)).format('h:mm:ss z')}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails className={classes.accordionDetails}>
                                            {data?.accessLimited ? (
                                                <>
                                                    <div className={classes.restrictionBar}>
                                                        <span className={classes.font15}>
                                                            This {accountType === 'SCHOOL' ? 'student' : 'kid'} is currently restricted to permissible sites
                                                            based on their online behavior. To acknowledge, choose, 'In Process' and when you think they're
                                                            ready to open their browsing, choose 'Clear'.
                                                        </span>
                                                        <div>
                                                            <Button
                                                                className={classes.buttonDark}
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => clearAccess(data.userId, i)}
                                                            >
                                                                CLEAR
                                                            </Button>
                                                            <span>
                                                                {moment(new Date()).diff(moment(new Date(data.activityTime)), 'days')} Day
                                                                {moment(new Date()).diff(moment(new Date(data.activityTime)), 'days') > 0 ? 's' : ''} since
                                                                Incident
                                                            </span>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                            <div className={classes.messageBody}>
                                                {data.accessLimited && !hasNoMessages(i) ? <hr className={classes.divider} /> : <></>}
                                                {data.prrMessages?.map((msg: PrrMessagesBody) => {
                                                    return (
                                                        <>
                                                            <p className={classes.queryText}>{parseText(msg.query)}</p>
                                                            <div style={{ paddingBottom: '10px' }} className={classes.responses}>
                                                                {msg.responses.map((rsp: string, index: number) => {
                                                                    return (
                                                                        <span key={index} className={classes.answers}>
                                                                            {rsp}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    );
                                                })}
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                </>
                            );
                        })}
                    </>
                ) : (
                    <div className={classes.dataContainer}>
                        <NoDataAvailable message="No Current Instances" />
                    </div>
                )}
            </div>
        </div>
    );
};
export default NotificationPage;
