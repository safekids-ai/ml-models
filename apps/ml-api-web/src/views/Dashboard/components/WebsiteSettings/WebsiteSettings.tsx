import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import cloneDeep from 'lodash/cloneDeep';
import { useLocation } from 'react-router';
import { getRequest, putRequest } from '../../../../utils/api';
import { GET_ONBOARDING_ORGUNITS, PUT_KID_REQUEST } from '../../../../utils/endpoints';
import { logError } from '../../../../utils/helpers';
import { useMobile } from '../../../../utils/hooks';
import { useNotificationToast } from '../../../../context/NotificationToastContext/NotificationToastContext';
import AddKid from '../../../ConsumerOnboarding/AddKid/AddKid';
import Categories from '../../../SchoolOnboarding/Categories/Categories';
import Websites from '../../../SchoolOnboarding/Websites/Websites';
import CategoriesStatus from '../Kids/CategoriesStatus';
import AllowedWebsites from '../Websites';
import { Payment } from '../Payment/Payment';
import { Referral } from '../Referral/Referral';
import { CancellationForm } from '../../../../components/CancellationForm/CancellationForm';
import Processes from '../Processes/Processes';

const Title = styled.span<{ isMobile: boolean }>`
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
    margin-bottom: '65px';
    margin-left: ${(props: any) => (props.isMobile ? '80px' : 'initial')};
`;

const Root = styled.div`
    display: flex;
    flex-direction: column;
`;

const SettingContainer = styled.div`
    background-color: white;
    margin: 15px 0;
    width: 950px;
    padding: 30px 35px;
    border: 1px solid #ebecf0;
    border-radius: 7px;
`;

const WebsiteSettings = () => {
    const isMobile = useMobile();
    const { search } = useLocation();
    const { showNotification } = useNotificationToast();
    const [ouTree, setOuTree] = useState<any[]>([]);
    const [refreshCategories, setRefreshCategories] = useState(false);
    const [updateWebsites, setUpdateWebsites] = useState(false);
    const [updateProcesses, setUpdateProcesses] = useState(false);
    const [selectedKidId, setSelectedKidId] = useState('');
    const accountType = localStorage.getItem('account_type');
    useEffect(() => {
        const kidRquestCode = new URLSearchParams(search).get('kid-request') || '';
        if (kidRquestCode && accountType !== 'SCHOOL') {
            putRequest<{}, { message: string; orgUnitId?: string }>(`${PUT_KID_REQUEST}?access-code=${kidRquestCode}`, {})
                .then((response) => {
                    console.log('response', response);
                    console.log('kidRquestCode', kidRquestCode);
                    if (response.status === 200) {
                        setUpdateWebsites(true);
                        setSelectedKidId(response.data.orgUnitId || '');
                        showNotification({ message: response.data.message || 'Requested website has been added to always allowed list', type: 'success' });
                    }
                    getOrgunit();
                })
                .catch((err) => {
                    showNotification({ message: err.response.data.message || 'Unable to requested website to always allowed list', type: 'error' });
                    getOrgunit();
                });
        } else {
            getOrgunit();
        }
    }, []);

    const getOrgunit = () => {
        getRequest<{}, any[]>(GET_ONBOARDING_ORGUNITS, {})
            .then((response) => {
                if (response.data) {
                    setOuTree(response.data);
                }
            })
            .catch((err) => {
                logError('GET ONBOARDING ORG UNITS', err);
            });
    };

    const getCategories = () => {
        if (accountType === 'SCHOOL')
            return (
                <SettingContainer>
                    <Categories isSettings={true} ouTree={cloneDeep(ouTree)} />
                </SettingContainer>
            );
        else if (accountType === 'CONSUMER')
            return (
                <SettingContainer>
                    <CategoriesStatus refreshCategories={refreshCategories} unSetRefreshCategories={() => setRefreshCategories(false)} />
                </SettingContainer>
            );
        else return <></>;
    };

    return (
        <Root>
            <Title isMobile={isMobile}>{accountType === 'SCHOOL' ? 'Websites' : 'Settings'}</Title>

            {accountType === 'CONSUMER' && (
                <SettingContainer>
                    <Referral />
                </SettingContainer>
            )}
            {getCategories()}
            <SettingContainer>
                {accountType === 'CONSUMER' ? (
                    <AllowedWebsites
                        refreshWebsites={updateWebsites}
                        selectedKidId={selectedKidId}
                        clearSelectedKidId={() => setSelectedKidId('')}
                        unSetRefreshWebsites={() => {
                            setUpdateWebsites(false);
                        }}
                    />
                ) : (
                    <Websites isSettings={true} ouTree={cloneDeep(ouTree)} />
                )}
            </SettingContainer>
            {accountType === 'CONSUMER' && (
                <SettingContainer>
                   <Processes
                        refreshProcesses={updateProcesses}
                        selectedKidId={selectedKidId}
                        clearSelectedKidId={() => setSelectedKidId('')}
                        unSetRefreshProcesses={() => {
                            setUpdateProcesses(false);
                        }}
                    />
                </SettingContainer>
            )}
            {accountType === 'CONSUMER' && (
                <SettingContainer>
                    <AddKid
                        nextStep={() => {
                            setRefreshCategories(true);
                            setUpdateWebsites(true);
                            setUpdateProcesses(true);
                            getOrgunit();
                        }}
                        isOnBoarding={false}
                    />
                </SettingContainer>
            )}
            {accountType === 'CONSUMER' && (
                <SettingContainer>
                    <Payment onPlanChange={() => { setRefreshCategories(true) }}/>
                </SettingContainer>
            )}
        </Root>
    );
};

export default WebsiteSettings;
