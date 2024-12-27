import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Logo from '../../svgs/Logo';
import { getInitials, logError } from '../../utils/helpers';
import NotificationUserIcon from '../../svgs/NotificationUserIcon';
import Loader from '../../components/Loader';
import { useLocation } from 'react-router';
import { getRequest } from '../../utils/api';
import { DataType } from './CrisisEngagement.types';
import { GET_VERIFY_TOKEN_CRISIS_MANAGEMENT } from '../../utils/endpoints';
import { format } from 'date-fns';

const Root = styled.div`
    display: flex;
    flex-direction: column;
    & span {
        font-family: 'Merriweather';
        font-style: normal;
        font-weight: 900;
        font-size: 15px;
        line-height: 20px;
        letter-spacing: -0.25px;
        color: #4a4a4a;
    }
    & .MuiAvatar-colorDefault {
        background: #000;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    & svg {
        height: 26px;
        width: 185px;
    }
    padding: 20px;
    border-bottom: 1px solid #979797;
`;

const CheckInText = styled.div`
    display: flex;
    flex-direction: column;
    & span {
        font-size: 30px;
        line-height: 40px;
    }
    text-align: center;
`;

const NotificationContainer = styled.div`
    border: 1px solid #e02020;
    border-radius: 10px;
    border-top: none;
    margin: 15px 0;
`;

const NotificationHeader = styled.div`
    display: flex;
    justify-content: space-between;
    border-radius: 10px;
    background-color: #e02020;
    align-items: center;
    padding: 7px 10px;
`;

const InfoContainer = styled.div`
    display: flex;
    width: calc(100% - 60px);
    & svg {
        height: 32px;
        width: 30px;
    }
`;

const StudentInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 7px;
    width: calc(100% - 40px);
    color: #fff;
    & span {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        line-height: 26px;
        color: #ffffff;
    }
`;

const StudentName = styled.span`
    margin-top: 3px;
    font-family: 'Lato' !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 22px !important;
    line-height: 26px !important;
    color: #000000 !important;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 15px;
`;

const SchoolName = styled.span`
    font-size: 14px !important;
`;

const NotificationContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 44px;
`;

const ContentInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    & span {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: #000000;
    }
`;

const HeadingFont = styled.span`
    font-size: 22px !important;
`;

const Ellipsis = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const LoaderContainer = styled.div`
    display: flex;
    height: 100vh;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const CrisisEngagement = () => {
    const searchParams = useLocation().search;
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [data, setData] = useState<DataType>();

    useEffect(() => {
        const token = new URLSearchParams(searchParams).get('token');
        getRequest<{}, any[]>(`${GET_VERIFY_TOKEN_CRISIS_MANAGEMENT}?token=${token}`, {})
            .then((res: any) => setData(res.data))
            .catch((err) => {
                logError('GET CRISIS ENGAGEMENT INFO', err);
                setErrorMessage(err?.response?.data || 'Session is expired');
            })
            .finally(() => setLoading(false));
    }, []);

    const getDate = (date?: string) => {
        if (!date) return '';
        const result = format(new Date(date), 'EEEE LLLL dd, yyyy');
        return result;
    };
    const getTime = (date?: string) => {
        if (!date) return '';
        const result = format(new Date(date), 'p 	O');
        return result;
    };

    return loading ? (
        <LoaderContainer>
            <Loader height="50px" width="50px" pathColor="rgba(247, 39, 74, 0.4)" loaderColor={'rgba(247, 39, 74, 1)'} />
        </LoaderContainer>
    ) : (
        <Root>
            {errorMessage || (
                <>
                    <Header>
                        <Logo />
                        <Avatar>{getInitials(data?.userName || '')}</Avatar>
                    </Header>
                    <Content>
                        <span>Check-In</span>
                        <span>Crisis Management</span>
                        <NotificationContainer>
                            <NotificationHeader>
                                <InfoContainer>
                                    <NotificationUserIcon />
                                    <StudentInfo>
                                        <Ellipsis>
                                            <span>{data?.kidName || ''}</span>
                                        </Ellipsis>
                                        <Ellipsis>
                                            <SchoolName>{data?.schoolName || ''}</SchoolName>
                                        </Ellipsis>
                                    </StudentInfo>
                                </InfoContainer>
                                <Avatar>{getInitials(data?.kidName || '')}</Avatar>
                            </NotificationHeader>
                            <NotificationContent>
                                <ContentInfoContainer>
                                    <span>{data?.lastIntercept ? 'Last Intercept:' : 'Last Intercepted Category:'}</span>
                                    <Ellipsis>
                                        <HeadingFont>{data?.lastIntercept || ''}</HeadingFont>
                                    </Ellipsis>
                                    <span>{data?.category || ''}</span>
                                </ContentInfoContainer>
                                <ContentInfoContainer>
                                    <HeadingFont>Occuring on:</HeadingFont>
                                    <span>{getDate(data?.activityTime)}</span>
                                    <span>{getTime(data?.activityTime)}</span>
                                </ContentInfoContainer>
                            </NotificationContent>
                        </NotificationContainer>
                        <CheckInText>
                            <span>{data?.userName || ''}</span>
                            <span>Checked-in for:</span>
                            <StudentName>{data?.kidName || ''}</StudentName>
                        </CheckInText>
                    </Content>
                </>
            )}
        </Root>
    );
};

export default CrisisEngagement;
