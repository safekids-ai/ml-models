import React, { useCallback, useEffect, useState } from 'react';
import PinInputField from 'react-pin-field';
import { makeStyles, Typography, MenuItem, Select, Avatar } from '@mui/material';
import GmailReporting from './GmailReporting';
import { StyleProps } from '../../types';
import { useMobile } from '../../../../utils/hooks';
import Loader from '../../../../components/Loader';
import TotalIntercept from './TotalIntercept';
import { getRequest, putRequest } from '../../../../utils/api';
import PrrSummary from './PrrSummary';
import KidsListWidget from './KidsListWidget/index';
import {
    SCHOOL_KID,
    GET_ACCESS_LIMITED_USERS,
    GET_CRISIS_ENGAGEMENT,
    GET_TOP_5_INTERCEPTED_CATEGORIES,
    GET_TOP_5_INTERCEPTED_URL,
    GET_GMAIL_REPORTS,
    PUT_KID_REQUEST,
} from '../../../../utils/endpoints';
import { getInitials, logError } from '../../../../utils/helpers';
import 'react-week-picker/src/lib/calendar.css';
import NonInterceptedReport from './NonInterceptedReport';
import NoDataAvailable from './NoDataAvailable';
import { KidWidgetType } from './SchoolActivity.type';
import { KidInfo } from '../../../ConsumerOnboarding/NextSteps/NextSteps';
import { useNotificationToast } from '../../../../context/NotificationToastContext/NotificationToastContext';
import { KidContainer, KidCodeContainer } from './SchoolActivity.style';
import { useLocation } from 'react-router';

enum KIDS_STATUSES {
    CONNECTED = 'connected',
    ACTIVE = 'inactive',
    INACTIVE = 'pending',
}

const useStyles = makeStyles({
    title: {
        marginLeft: ({ isMobile }: StyleProps) => (isMobile ? '80px' : 'initial'),
    },
    noReportsPlaceholder: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        marginTop: 'calc(50vh - 200px)',
        fontSize: 30,
        color: 'black',
    },
    loader: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'calc(50vh - 190px)',
    },
    reportsLabel: {
        fontSize: 60,
        color: 'red',
    },
    crisisEngagementLoader: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'calc(50vh - 190px)',
    },
    userAccessLimitedLoader: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'calc(50vh - 190px)',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    prrText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Merriweather',
        fontSize: 14,
        fontWeight: 900,
        marginTop: 40,
    },
    dataContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        margin: '20px 20px 0 0',
        height: '95%',
        borderRadius: 10,
    },
    totalInterceptContainer: {
        width: 550,
    },
    prrNotificationsContainer: {
        margin: '0 20px',
        marginRight: '0',
        width: '100%',
    },
    selectWeek: {
        color: 'black',
        width: '200px',
        background: 'white',
        padding: '0 0 10px',
        '& svg': {
            display: 'flex',
            marginTop: '3px',
        },
    },

    weekSelector: {
        marginLeft: 20,
        '& button': {
            padding: 15,
            borderRadius: 7,
            border: '1px solid #e4e4e4',
            fontSize: 13,
            width: 260,
            backgroundColor: 'white',
            cursor: 'pointer',
            '& svg': {
                display: 'none',
            },
        },
    },
});

const SchoolActivity = () => {
    const { showNotification } = useNotificationToast();
    const activityTime = (value: string): Date => {
        const today = new Date();
        switch (value) {
            case 'week':
                const previousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                previousWeek.setHours(0, 0, 0, 0);
                return previousWeek;
            case 'day':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                yesterday.setHours(0, 0, 0, 0);
                return yesterday;
            case 'month':
                const month = new Date().getMonth();
                const previousMonth = new Date(today.setMonth(month - 1));
                previousMonth.setHours(0, 0, 0, 0);
                return previousMonth;
            case 'year':
                const year = new Date().getFullYear();
                const previousYear = new Date(today.setFullYear(year - 1));
                previousYear.setHours(0, 0, 0, 0);
                return previousYear;
            default:
                const defaultWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                defaultWeek.setHours(0, 0, 0, 0);
                return defaultWeek;
        }
    };
    const accountType = localStorage.getItem('account_type');
    const isMobile = useMobile();
    const classes = useStyles({ isMobile });
    const activityStartTime = activityTime('week');
    const today = new Date();
    const [startDate, setStartDate] = useState<Date>(activityStartTime);
    const [endDate, setEndDate] = useState<Date>(today);
    const [userAccessLimitedLoading, setUserAccessLimitedLoading] = useState(false);
    const [crisisEngagementLoading, setCrisisEngagementLoading] = useState(false);
    const [userAccessLimitedData, setUserAccessLimitedData] = useState<KidWidgetType>({ items: [], totalItems: 0 });
    const [crisisEngagementData, setCrisisEngagementData] = useState<KidWidgetType>({ items: [], totalItems: 0 });
    const [selectedTimeFilter, setSelectedTimeFilter] = useState('week');
    const [loading, setLoading] = useState(false);
    const [topCategories, setTopCategories] = useState([]);
    const [totalCountCategory, setTotalCountCategories] = useState(0);
    const [topUrl, setTopUrl] = useState([]);
    const [gmailReportData, setGmailReportData] = useState(null);
    const [kids, setkids] = useState<KidInfo[]>([]);
    const { search } = useLocation();

    useEffect(() => {
        getRequest<{}, KidInfo[]>(SCHOOL_KID, {})
            .then(({ data }) => {
                setkids(data);
            })
            .catch((err) => {
                showNotification({
                    type: 'error',
                    message: 'Failed to get kids',
                });
                logError('CONSUMER_KID', err);
            });

        const kidAccessCode = new URLSearchParams(search).get('access-request') || '';

        if (kidAccessCode && accountType !== 'SCHOOL') {
            putRequest<{}, { message: string }>(`${PUT_KID_REQUEST}/access-update?access-request=${kidAccessCode}`, {})
                .then((response) => {
                    if (response.status === 200) {
                        showNotification({ message: response.data.message, type: 'success' });
                    }
                    getAccessLimitedUsers(startDate, endDate);
                })
                .catch((err) => {
                    showNotification({ message: err.response.data, type: 'error' });
                    getAccessLimitedUsers(startDate, endDate);
                });
        } else {
            getAccessLimitedUsers(startDate, endDate);
        }
    }, [accountType, endDate, search, showNotification, startDate]);

    const setAccessCode = (ref: any, accessCode: string) => {
        ref?.forEach((input: any, index: number) => (input.value = accessCode[index]));
    };
    const onWeekChange = (value: string) => {
        setSelectedTimeFilter(value);
        const activityStartTime = activityTime(value);
        setStartDate(activityStartTime);
        setEndDate(endDate);
        getKidsActivity(activityStartTime, today);
    };

    const TopInterceptActivity = useCallback( async (startDate: Date, endDate: Date) => {
        try {
            await getGmailReports(startDate, endDate);
            await getTopInterceptCategory(startDate, endDate);
            await getTopInterceptUrl(startDate, endDate);
            setLoading(false);
        } catch (error) {
            logError('Top Intercept ACTIVITY', error);
            setLoading(false);
        }
    }, []);

    const getKidsActivity = useCallback( async (startDate: Date, endDate: Date) => {
        setLoading(true);
        TopInterceptActivity(startDate, endDate);
    }, [TopInterceptActivity]);
    useEffect(() => {
        getKidsActivity(startDate, endDate);
    }, [endDate, getKidsActivity, startDate]);
    useEffect(() => {
        if (totalCountCategory > 0) {
            getAccessLimitedUsers(startDate, endDate);
            getCrisisEngagement(startDate, endDate);
        }
    }, [endDate, startDate, totalCountCategory]);

    const getGmailReports = async (startDate: Date, endDate: Date) => {
        try {
            const result = await getRequest<{}, any>(GET_GMAIL_REPORTS, {
                start: startDate,
                end: endDate,
            });
            if (result.data) {
                setGmailReportData(result?.data);
            }
        } catch (error) {
            logError('Gmail Reports ', error);
        }
    };
    const getTopInterceptCategory = async (startDate: Date, endDate: Date) => {
        try {
            const result = await getRequest<{}, any>(GET_TOP_5_INTERCEPTED_CATEGORIES, {
                start: startDate,
                end: endDate,
            });
            setTopCategories(result.data.list);
            setTotalCountCategories(result.data.sum);
        } catch (error) {
            logError('Top Intercept ACTIVITY', error);
        }
    };
    const getTopInterceptUrl = async (startDate: Date, endDate: Date) => {
        try {
            const result = await getRequest<{}, any>(GET_TOP_5_INTERCEPTED_URL, {
                start: startDate,
                end: endDate,
            });
            setTopUrl(result.data.list);
        } catch (error) {
            logError('Top Url Intercept ', error);
        }
    };

    const getAccessLimitedUsers = async (startDate: Date, endDate: Date) => {
        try {
            setUserAccessLimitedLoading(true);
            const result = await getRequest<{}, any>(GET_ACCESS_LIMITED_USERS, {
                start: startDate,
                end: endDate,
                page: 0,
                size: 6,
            });
            setUserAccessLimitedData(result.data);
            setUserAccessLimitedLoading(false);
        } catch (error) {
            logError('Get Access Limited Users', error);
            setUserAccessLimitedLoading(false);
        }
    };

    const getCrisisEngagement = async (startDate: Date, endDate: Date) => {
        try {
            setCrisisEngagementLoading(true);
            const result = await getRequest<{}, any>(GET_CRISIS_ENGAGEMENT, {
                start: startDate,
                end: endDate,
                page: 0,
                size: 100,
            });
            setCrisisEngagementData(result.data);
            setCrisisEngagementLoading(false);
        } catch (error) {
            logError('Get Crisis Engagement', error);
            setCrisisEngagementLoading(false);
        }
    };

    const MenuProps = {
        PaperProps: {
            style: {
                marginTop: 55,
                height: 175,
            },
        },
    };

    const getStatus = (status?: string) => {
        if (status === 'CONNECTED') return KIDS_STATUSES.CONNECTED;
        else if (status === 'ACTIVE') return KIDS_STATUSES.ACTIVE;
        else if (status === 'INACTIVE') return KIDS_STATUSES.INACTIVE;
    };

    const getStatusColorClass = (status?: string) => {
        if (status === 'CONNECTED') return 'connected';
        else if (status === 'ACTIVE') return 'not-connected';
        else if (status === 'INACTIVE') return 'not-connected';
    };

    return (
        <>
            {loading ? (
                <div className={classes.loader}>
                    <Loader height="50px" width="50px" pathColor="rgba(247, 39, 74, 0.4)" loaderColor={'rgba(247, 39, 74, 1)'} />
                </div>
            ) : (
                <>
                    <div className={classes.header}>
                        <Typography className={classes.title} variant="h4">
                            Activity:
                        </Typography>
                        <div className={classes.weekSelector}>
                            <Select
                                className={classes.selectWeek}
                                MenuProps={MenuProps}
                                variant="outlined"
                                label="Filter"
                                value={selectedTimeFilter}
                                onChange={(evt: any) => onWeekChange(evt.target.value)}>
                                <MenuItem value="week">Week</MenuItem>
                                <MenuItem value="day">Day</MenuItem>
                                <MenuItem value="month">Month</MenuItem>
                                <MenuItem value="year">Year</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div>
                        {loading ? (
                            <div className={classes.loader}>
                                <Loader height="50px" width="50px" pathColor="rgba(247, 39, 74, 0.4)" loaderColor={'rgba(247, 39, 74, 1)'} />
                            </div>
                        ) : (
                            <>
                                {totalCountCategory > 0 ? (
                                    <div className={classes.dataContainer}>
                                        <div className={classes.totalInterceptContainer}>
                                            <TotalIntercept topCategories={topCategories} totalCountCategory={totalCountCategory} topUrl={topUrl} />
                                        </div>
                                        <div className={classes.prrNotificationsContainer}>
                                            <PrrSummary startDate={startDate} endDate={endDate} />
                                            {userAccessLimitedLoading ? (
                                                <div className={classes.userAccessLimitedLoader}>
                                                    <Loader
                                                        height="50px"
                                                        width="50px"
                                                        pathColor="rgba(247, 39, 74, 0.4)"
                                                        loaderColor={'rgba(247, 39, 74, 1)'}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    {' '}
                                                    <KidsListWidget level={2} event={userAccessLimitedData} showViewButton={true} />
                                                </>
                                            )}
                                            {crisisEngagementLoading ? (
                                                <div className={classes.crisisEngagementLoader}>
                                                    <Loader
                                                        height="50px"
                                                        width="50px"
                                                        pathColor="rgba(247, 39, 74, 0.4)"
                                                        loaderColor={'rgba(247, 39, 74, 1)'}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <KidsListWidget level={3} event={crisisEngagementData} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={classes.dataContainer}>
                                        <NoDataAvailable message="No Data Available" />
                                    </div>
                                )}
                                {accountType === 'SCHOOL' && <GmailReporting reportData={gmailReportData} />}
                                <div className={classes.dataContainer}>
                                    {accountType === 'SCHOOL' ? (
                                        <NonInterceptedReport startDate={startDate} endDate={endDate} />
                                    ) : (
                                        <KidContainer>
                                            <KidCodeContainer>
                                                <span className="heading">Kid Codes</span>
                                                <div className="content">
                                                    <div className="kid-info-list">
                                                        {kids.map((kid) => {
                                                            const fullName = `${kid.firstName} ${kid.lastName}`;
                                                            return (
                                                                <div className="kid-info-container">
                                                                    <div className="kid-info">
                                                                        <Avatar>{getInitials(fullName)}</Avatar>
                                                                        <div className="kid-info-inner-container">
                                                                            <span className="kid-name-email">
                                                                                {`${fullName} `}(
                                                                                <span className={getStatusColorClass(kid?.status)}>
                                                                                    {getStatus(kid?.status)}
                                                                                </span>
                                                                                )
                                                                            </span>
                                                                            <span className="kid-name-email">{kid?.email}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="access-code-container">
                                                                        <span>Access Code</span>
                                                                        <div className="access-code-field">
                                                                            <PinInputField
                                                                                length={6}
                                                                                disabled={true}
                                                                                ref={(ref) => setAccessCode(ref, kid?.accessCode ? kid.accessCode : '')}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </KidCodeContainer>
                                        </KidContainer>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};
export default SchoolActivity;
