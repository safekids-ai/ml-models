import React, { useCallback, useEffect, useState } from 'react';
import { Typography, MenuItem, Select } from '@mui/material';
import Loader from '../../../../components/Loader';
import { getRequest } from '../../../../utils/api';
import { GET_CONSUMER_KIDS } from '../../../../utils/endpoints';
import { logError } from '../../../../utils/helpers';
import 'react-week-picker/src/lib/calendar.css';
import { KidInfo } from '../../../ConsumerOnboarding/NextSteps/NextSteps';
import { useNotificationToast } from '../../../../context/NotificationToastContext/NotificationToastContext';
import KidCard from './KidCard/KidCard';
import { KidContainer } from './ConsumerActivity.style';
import { activityTime } from './ConsumerActivity.utils';
import { LoadingContainer } from '../Websites/website.style';

const ConsumerActivity = () => {
    const { showNotification } = useNotificationToast();

    const [selectedTimeFilter, setSelectedTimeFilter] = useState('week');
    const [loading, setLoading] = useState(false);
    const [kids, setkids] = useState<KidInfo[]>([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getKids = useCallback((filter: string) => {
        getRequest<{}, KidInfo[]>(GET_CONSUMER_KIDS, {
            start: activityTime(filter),
            end: new Date(),
        })
            .then(({ data }) => {
                setkids(data);
            })
            .catch((err) => {
                showNotification({
                    type: 'error',
                    message: 'Failed to get kids',
                });
                logError('CONSUMER_KID', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [showNotification]);

    useEffect(() => {
        setLoading(true);
        getKids(selectedTimeFilter);
    }, [getKids, selectedTimeFilter]);

    const onWeekChange = (value: string) => {
        setSelectedTimeFilter(value);
    };

    return loading ? (
        <LoadingContainer>
            <Loader />
        </LoadingContainer>
    ) : (
        <KidContainer>
            <div className="header">
                <Typography className="title" variant="h4">
                    Activity:
                </Typography>
                <div className="week-selector">
                    <Select
                        className="select-week"
                        variant="outlined"
                        label="Filter"
                        value={selectedTimeFilter}
                        onChange={(evt: any) => onWeekChange(evt.target.value)}>
                        <MenuItem value="day">Day</MenuItem>
                        <MenuItem value="week">Week</MenuItem>
                        <MenuItem value="month">Month</MenuItem>
                        <MenuItem value="year">Year</MenuItem>
                    </Select>
                </div>
            </div>
            {kids.length > 0 && (
                <div className="card-row">
                    <div className="card-col">
                        {kids.map((kid, index) => {
                            if (index % 2 === 0) {
                                return <KidCard key={kid?.id} kid={kid} selectedTimeFilter={selectedTimeFilter}/>
                            } else {
                                return null;
                            };
                        })}
                    </div>
                    <div className="card-col">
                        {kids.map((kid, index) => {
                            if (index % 2 === 1) {
                                return <KidCard key={kid?.id} kid={kid} selectedTimeFilter={selectedTimeFilter} />;
                            } else {
                                return null;
                            }
                        })}
                    </div>
                </div>
            )}
        </KidContainer>
    );
};
export default ConsumerActivity;
