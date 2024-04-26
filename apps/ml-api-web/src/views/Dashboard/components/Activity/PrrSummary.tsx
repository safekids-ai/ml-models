import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles, Tooltip } from '@mui/material';
import { getRequest } from '../../../../utils/api';
import { logError } from '../../../../utils/helpers';
import { GET_CASUAL_ENGAGEMENT, GET_TOP_INTERCEPT } from '../../../../utils/endpoints';
import Loader from '../../../../components/Loader';
import moment from 'moment';

const useStyles = makeStyles({
    root: {
        width: '100%',
        margin: '20px 0',
        height: 175,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        padding: '25px 30px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '2px solid #000000',
        '& span': {
            fontFamily: 'Merriweather',
            fontWeight: 'bold',
            fontSize: 13,
        },
    },
    columnData: {
        display: 'flex',
        flexDirection: 'column',
        '& .heading': {
            fontSize: '15px',
        },
        '& .instanceCount': {
            fontSize: 50,
            fontFamily: 'Lato',
        },
        '& .categoryText': {
            fontSize: 18,
            fontFamily: 'Lato',
            fontWeight: 'normal',
            width: 'fit-content',
            lineBreak: 'anywhere',
        },
        '& .urlText': {
            color: 'Red',
        },
    },
    divider: {
        height: 65,
        width: 1,
        margin: '0 20px',
        borderLeft: '1px solid #000000',
    },
    ellipsis: {
        color: '#000000',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
});

interface Props {
    startDate: Date;
    endDate: Date;
}
interface CasualEngagement {
    average: number;
    percentage: number;
    since: string;
}
interface TopIntercept {
    topUrl: string;
    topCategory: string;
}

const PrrSummary = ({ startDate, endDate }: Props) => {
    const classes = useStyles({});
    const [categoryOverflow, setCategoryOverflow] = useState<boolean>(false);
    const [urlOverflow, setUrlOverflow] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [topIntercept, setTopIntercept] = useState<TopIntercept>();
    const [casualEngagement, setCasualEngagement] = useState<CasualEngagement>();

    const PrrSummaryActivity = useCallback( async (startDate: Date, endDate: Date) => {
        try {
            setLoading(true);
            await getTopIntercept(startDate, endDate);
            await getCasualEngagement(startDate, endDate);
            setLoading(false);
        } catch (error) {
            logError('Prr Summary ACTIVITY', error);
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        PrrSummaryActivity(startDate, endDate);
    }, [startDate, endDate, PrrSummaryActivity]);
    const getTopIntercept = async (startDate: Date, endDate: Date) => {
        try {
            const result = await getRequest<{}, any>(GET_TOP_INTERCEPT, {
                start: startDate,
                end: endDate,
            });
            setTopIntercept(result.data);
        } catch (error) {
            logError('Top Intercept ACTIVITY', error);
        }
    };
    const getCasualEngagement = async (startDate: Date, endDate: Date) => {
        try {
            const result = await getRequest<{}, any>(GET_CASUAL_ENGAGEMENT, {
                start: startDate,
                end: endDate,
            });
            const payload = {
                percentage: result.data.percentage,
                average: result.data.average,
                since: result.data.since,
            };
            setCasualEngagement(payload);
        } catch (error) {
            logError('Get Average and Percentage Casual Engagement ', error);
        }
    };

    return (
        <div className={classes.root}>
            {loading ? (
                <div>
                    <Loader height="50px" width="50px" pathColor="rgba(247, 39, 74, 0.4)" loaderColor={'rgba(247, 39, 74, 1)'} />
                </div>
            ) : (
                <>
                    <div className={classes.columnData}>
                        <span className="heading">CASUAL Engagement</span>
                        <span>Percent Change</span>
                        <span
                            className="instanceCount"
                            style={{ color: casualEngagement ? (casualEngagement?.percentage < 0 ? 'red' : '#6DD400') : '' }}
                            id="reduction-percentage"
                        >
                            {casualEngagement && casualEngagement.percentage !== null
                                ? `${casualEngagement.percentage.toFixed(2).replace(/[.,]00$/, '')}%`
                                : '--'}
                        </span>
                        <span>
                            Since:
                            <span style={{ fontWeight: 'normal' }} id="reduction-date">
                                {casualEngagement ? moment(new Date(casualEngagement.since)).format('MMM, DD YYYY') : '-'}
                            </span>
                        </span>
                    </div>
                    <div className={classes.divider}></div>
                    <div className={classes.columnData}>
                        <span>Average Daily Instances</span>
                        <span className="instanceCount" id="daily-instances">
                            {casualEngagement ? casualEngagement.average : 0}
                        </span>
                        <span>
                            For: <span style={{ fontWeight: 'normal' }}>This Period</span>
                        </span>
                    </div>
                    <div className={classes.divider}></div>
                    <div className={classes.columnData} style={{ width: 'auto' }}>
                        <span>Top Intercepted Category</span>
                        <Tooltip title={categoryOverflow && topIntercept ? topIntercept.topCategory : '--'}>
                            <div
                                className={classes.ellipsis}
                                style={{ marginBottom: 18 }}
                                ref={(el) => setCategoryOverflow(el ? el?.offsetWidth < el?.scrollWidth : false)}
                            >
                                <span className="categoryText" id="top-intercepted-category">
                                    {topIntercept ? (topIntercept.topCategory ? topIntercept.topCategory : '--') : '--'}
                                </span>
                            </div>
                        </Tooltip>
                        <span>Top Intercepted URL</span>
                        <Tooltip title={urlOverflow && topIntercept ? topIntercept.topUrl : '--'}>
                            <div className={classes.ellipsis && 'urlText'} ref={(el) => setUrlOverflow(el ? el?.offsetWidth < el?.scrollWidth : false)}>
                                <span className="categoryText" id="top-intercepted-url">
                                    {topIntercept ? (topIntercept.topUrl ? topIntercept.topUrl : '--') : '--'}
                                </span>
                            </div>
                        </Tooltip>
                    </div>
                </>
            )}
        </div>
    );
};
export default PrrSummary;
