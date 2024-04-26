import React, { useEffect, useState } from 'react';
import { Avatar, Checkbox, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Tooltip, Typography } from '@mui/material';
import { getInitials } from '../../../../../utils/helpers';
import PinInputField from 'react-pin-field';
import { KidCardStyled } from './kidCard.style';
import { KIDS_STATUSES } from './KidCard.type';
import { getStatus, periodTranslateArray } from './KidCard.utils';
import { format } from 'date-fns';
import { PUT_KID_ASK_ACCESS_REQUEST, UPDATE_USER_ACCESS } from '../../../../../utils/endpoints';
import { patchRequest, putRequest } from '../../../../../utils/api';
import { useNotificationToast } from '../../../../../context/NotificationToastContext/NotificationToastContext';
import { SubmitButton } from '../../../../../components/InputFields';
import DoughnutChart from '../../../../../components/Chart/Chart';

interface Props {
    kid: any;
    selectedTimeFilter: string;
}

const KidCard = ({ kid, selectedTimeFilter }: Props) => {
    const { showNotification } = useNotificationToast();
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>(selectedTimeFilter);
    const [grantAccessLoader, setGrantAccessLoader] = useState(false);
    const [clearAccessLoader, setClearAccessLoader] = useState(false);
    const [showAccessCode, setShowAccessCode] = useState(false);
    const [checkedRequests, setCheckedRequests] = React.useState<string[]>([]);
    const [requests, setRequests] = React.useState<any[]>([]);
    const [accessLimited, setAccessLimited] = React.useState<boolean>(true);
    const [chartLabel, setChartLabel] = useState<string[]>([]);
    const [chartData, setChartData] = useState<number[]>([]);
    const setAccessCode = (ref: any, accessCode: string) => {
        ref?.forEach((input: any, index: number) => (input.value = accessCode[index]));
    };

    useEffect(() => {
        if (kid?.status === KIDS_STATUSES.NOT_CONNECTED) {
            setShowAccessCode(true);
        }
        setSelectedTimePeriod(periodTranslateArray[selectedTimeFilter]);
        setRequests(kid?.kidRequests);
        setAccessLimited(kid?.accessLimited);

        if ((kid?.activity?.casual > 0 || kid?.activity?.coached > 0 || kid?.activity?.crisis > 0)) {
            const sentenceCaseLabels = Object.keys(kid?.activity)?.map((s: string) => s.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()));
            setChartLabel(sentenceCaseLabels);
            setChartData(Object.values(kid?.activity));
        }
    }, [kid?.accessLimited, kid?.activity, kid?.kidRequests, kid?.status, selectedTimeFilter]);

    // const totalInterceptedCategoriesCount = totalCategoriesCount(kid?.topCategories);

    const handleToggle = (value: string) => () => {
        const currentIndex = checkedRequests?.indexOf(value);
        const newChecked = [...checkedRequests];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedRequests(newChecked);
    };

    const grantAccess = () => {
        setGrantAccessLoader(true);
        putRequest(PUT_KID_ASK_ACCESS_REQUEST, {
            kidId: kid.id,
            requests: checkedRequests,
        })
            .then((res: any) => {
                setCheckedRequests([]);
                setRequests(res?.data);
                showNotification({
                    type: 'success',
                    message: 'Access granted Successfully.',
                });
            })
            .catch((err) => {
                showNotification({
                    type: 'error',
                    message: 'Failed to grant access',
                });
            })
            .finally(() => setGrantAccessLoader(false));
    };

    const clearAccess = () => {
        setClearAccessLoader(true);
        patchRequest(UPDATE_USER_ACCESS.replace('{userId}', kid.id), { limit: false }, {}, true)
            .then((res: any) => {
                setAccessLimited(false);
                showNotification({
                    type: 'success',
                    message: 'Access has been restored successfully.',
                });
            })
            .catch((err) => {
                showNotification({
                    type: 'error',
                    message: 'Failed to removed limit access!',
                });
            })
            .finally(() => setClearAccessLoader(false));
    };

    return (
        <KidCardStyled>
            <div className="kid-info-container">
                <div className="kid-info">
                    <Avatar>{getInitials(`${kid?.firstName} ${kid?.lastName}`)}</Avatar>
                    <div className="kid-info-inner-container">
                        <span className="kid-name">{`${kid?.firstName} ${kid?.lastName}`}</span>
                        <span className={kid?.status === KIDS_STATUSES.CONNECTED ? 'kid-status connected' : 'kid-status not-connected'}>
                            {getStatus(kid?.status)}
                        </span>
                    </div>
                    {showAccessCode ? (
                        <span
                            className="show-access-link"
                            onClick={() => {
                                setShowAccessCode(false);
                            }}>
                            Hide Access Code
                        </span>
                    ) : (
                        <span
                            className="show-access-link"
                            onClick={() => {
                                setShowAccessCode(true);
                            }}>
                            Show Access Code
                        </span>
                    )}
                </div>
                {showAccessCode && (
                    <div className="access-code-container">
                        <span>Access Code</span>
                        <div className="access-code-field">
                            <PinInputField length={6} ref={(ref) => setAccessCode(ref, kid?.accessCode ? kid.accessCode : '')} disabled />
                        </div>
                    </div>
                )}
            </div>
            {(kid?.activity?.casual > 0 || kid?.activity?.coached > 0 || kid?.activity?.crisis > 0) && (
                <div className="chart-container">
                    <span className="title">Activity</span>
                    <span className="description">
                        This chart shows activity for: <span className="selected-time-period">{selectedTimePeriod}</span>
                    </span>
                    <div className="chart">
                        <DoughnutChart chartLabel={chartLabel} chartData={chartData}/>
                    </div>
                </div>
            )}
            {/* {kid?.topCategories?.length > 0 && (
                <div>
                    <div className="instances-container">
                        <span className="intercepts-title">TOTAL INTERCEPTS</span>
                        <span className="intercepts-count">{totalInterceptedCategoriesCount}</span>
                        <span className="intercepts-text">number of instances for the top categories</span>
                    </div>
                    <div className="top-intercept">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="title-head">Top categories</th>
                                    <th className="number-head">#</th>
                                </tr>
                            </thead>
                            {kid?.topCategories.map((category: CategoryIntercept) => (
                                <tbody key={category.name}>
                                    <tr key={category.name}>
                                        <td>{category.name}</td>
                                        <td>{category.count}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
            )} */}

            {accessLimited ? (
                <div className="main-access-limited-container">
                    <span className="title">LIMITED ACCESS:</span>

                    <div className="access-limited-container">
                        <div className="content">
                            <span>
                                {kid.firstName}'s access has been limited because they tried to access restricted content too many times within our set time
                                frame. To return their access, choose CLEAR.
                            </span>
                        </div>
                        <SubmitButton className="clear-button" isSubmitting={clearAccessLoader} text="Clear" onClick={clearAccess} marginTop={0} />
                    </div>
                </div>
            ) : (
                requests?.length > 0 && (
                    <div className="main-requests-container">
                        <span className="title">PERMANANTLY ALLOW ACCESS TO:</span>

                        <List className="requests-container">
                            {requests.map((request: any) => {
                                const labelId = `checkbox-list-label-${request.url}`;

                                return (
                                    <ListItem className="request" key={request.url} role={undefined} onClick={handleToggle(request.url)}>
                                        <ListItemIcon className="checkbox-list">
                                            <Checkbox color="primary" edge="start" tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': labelId }} />
                                        </ListItemIcon>
                                        <Tooltip title={request.url}>
                                            <ListItemText
                                                className="url"
                                                id={labelId}
                                                primary={
                                                    <Typography className="text">
                                                        <a className="url-text" href={request.url} target="_blank" rel="noreferrer">
                                                            {request.url}
                                                        </a>
                                                    </Typography>
                                                }
                                            />
                                        </Tooltip>
                                        <ListItemSecondaryAction>
                                            <span>{format(new Date(request.updatedAt), `MMM. d, yyyy`)}</span>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                        <div className="button">
                            <SubmitButton
                                className="add-button"
                                isSubmitting={grantAccessLoader}
                                text="ADD"
                                onClick={grantAccess}
                                marginTop={0}
                                disabled={!checkedRequests.length}
                            />
                        </div>
                    </div>
                )
            )}
        </KidCardStyled>
    );
};
export default KidCard;
