import React from 'react';
import styled from 'styled-components';
import { SubmitButton } from '../../../components/InputFields';
import ExtensionDescription from '../../Dashboard/components/SchoolSettings/ExtensionInfo/ExtensionDescription/ExtensionDescription';

import { Props } from './FinishScreen.types';

const Root = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.span`
    display: flex;
    align-items: center;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
`;

const Description = styled.span`
    margin-top: 10px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #000000;
    margin-bottom: 15px;
    width: 632px;
    margin-bottom: 20px;
`;

const FinishButton = styled.div`
    margin-top: 50px !important;
    margin-left: 100px;
    width: 200px;
    & button {
        margin-top: 0;
    }
    & .MuiButton-label {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }
`;

const SettingsSpan = styled.span`
    color: #f7274a;
    text-decoration: underline;
    cursor: pointer;
`;

const FinishScreen = ({ finishOnboarding }: Props) => (
    <Root>
        <Title>Thank you for setting up Safe Kids</Title>
        <Description>
            You can always change things in the administrative interface in <SettingsSpan onClick={() => finishOnboarding(true)}>settings</SettingsSpan>.
        </Description>
        <ExtensionDescription />
        <FinishButton onClick={() => finishOnboarding()}>
            <SubmitButton text="Finish" />
        </FinishButton>
    </Root>
);

export default FinishScreen;
