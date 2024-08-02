import React, { useEffect } from 'react';
import { getRequest, history, updateAxios } from '../../utils/api';
import { useLocation } from 'react-router-dom';
import { useNotificationToast } from '../../context/NotificationToastContext/NotificationToastContext';
import { GET_ONBOARDING_STATUS, GET_SCHOOL_USER_PROFILE } from '../../utils/endpoints';
import { GetUserProfileResponse } from '../../types/api-responses';
import { logError } from '../../utils/helpers';

const RedirectComponent = () => {
    const { search, pathname } = useLocation();
    const { showNotification } = useNotificationToast();
    useEffect(() => {
        const code = new URLSearchParams(search).get('code');
        if (pathname.includes('/teacher')) {
            getRequest<{}, any[]>(`auth/google/redirect/teacher?code=${code}`, {})
                .then((res: any) => {
                    localStorage.setItem('jwt_token', res.data.jwt_token);
                    localStorage.setItem('account_type', 'SCHOOL');
                    updateAxios();
                    getRequest<{}, any>(GET_SCHOOL_USER_PROFILE, {})
                        .then(({ data }) => {
                            const { isAdmin, role } = data;
                            if (role === 'DISTRICT_USER' && !isAdmin) {
                                history.push('/dashboard');
                            } else {
                                history.push('/school-signin');
                            }
                        })
                        .catch((e) => {
                            throw e;
                        });
                })
                .catch((err) => {
                    showNotification({ type: 'error', message: err?.response?.data });
                    history.push('/school-signin');
                });
        } else {
            getRequest<{}, any[]>(`auth/google/redirect?code=${code}`, {})
                .then((res: any) => {
                    localStorage.setItem('jwt_token', res.data.jwt_token);
                    localStorage.setItem('account_type', 'SCHOOL');
                    updateAxios();
                    getRequest<{}, any>(GET_SCHOOL_USER_PROFILE, {})
                        .then(({ data }) => {
                            const { isAdmin, role } = data;
                            if (isAdmin) {
                                getRequest<{}, any[]>(GET_ONBOARDING_STATUS, {})
                                    .then((response: any) => {
                                        if (response.data.onBoardingStatus === 'COMPLETED' || response.data.onBoardingStatus === 'Completed') {
                                            history.push('/dashboard');
                                        } else {
                                            history.push('/school-onboarding');
                                        }
                                    })
                                    .catch((err) => {
                                        throw err;
                                    });
                            } else if (role === 'DISTRICT_USER' && !isAdmin) {
                                history.push('/dashboard');
                            }
                        })
                        .catch((e) => {
                            throw e;
                        });
                })
                .catch((err) => {
                    if (err?.response?.status === 401) {
                        showNotification({ type: 'error', message: 'User Unauthorized.' });
                    }
                    history.push('/school-signin');
                });
        }
    }, []);
    return <></>;
};

export default RedirectComponent;
