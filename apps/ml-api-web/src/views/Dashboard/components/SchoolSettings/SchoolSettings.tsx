import React from 'react';
import styled from 'styled-components';
import { useMobile } from '../../../../utils/hooks';
import CrisisManagement from '../../../SchoolOnboarding/CrisisManagement/CrisisManagement';
import InterceptionTime from '../../../SchoolOnboarding/InterceptionTime/InterceptionTime';
import SchoolSchedule from '../../../SchoolOnboarding/SchoolSchedule/SchoolSchedule';
import SIS from '../../../SchoolOnboarding/SIS/SIS';
import ExtensionInfo from './ExtensionInfo/ExtensionInfo';
import ExtensionSettings from './ExtensionSettings/ExtensionSettings';
import OrganizationalUnits from './OrganizationalUnits/OrganizationalUnits';

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

const SchoolSettings = () => {
    const isMobile = useMobile();
    return (
        <Root>
            <Title isMobile={isMobile}>Settings</Title>
            <SettingContainer>
                <ExtensionInfo />
            </SettingContainer>
            <SettingContainer>
                <ExtensionSettings />
            </SettingContainer>
            <SettingContainer>
                <SIS isSettings={true} showSync={true} />
            </SettingContainer>
            <SettingContainer>
                <OrganizationalUnits />
            </SettingContainer>
            <SettingContainer>
                <SchoolSchedule isSettings={true} />
            </SettingContainer>
            <SettingContainer>
                <InterceptionTime isSettings={true} />
            </SettingContainer>
            <SettingContainer>
                <CrisisManagement isSettings={true} />
            </SettingContainer>
        </Root>
    );
};

export default SchoolSettings;
