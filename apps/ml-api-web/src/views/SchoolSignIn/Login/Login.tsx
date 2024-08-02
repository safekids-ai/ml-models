import React from 'react';
import logo from '../../../images/safeKidSchools.png';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { GoogleIcon } from '../../../svgs/SchoolOnboarding';

const Root = styled.div`
    display: flex;
    justify-content: space-between;
    & img {
        height: 550px;
        padding: 20px 0px;
    }
`;

const WelcomeTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 490px;
`;

const WelcomeTitle = styled.span`
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 34px;
    line-height: 45px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
`;

const WelcomeDescription = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 29px;
    letter-spacing: -0.363636px;
    color: #979797;
    width: 490px;
`;

const GetStartedContainer = styled.div`
    margin-top: 35px;
    border: 1px solid #ea3349;
    border-radius: 43px;
    padding: 45px 55px;
    display: flex;
    height: 300px;
    flex-direction: column;
`;

const ButtonContainer = styled.div`
    justify-content: space-between;
    display: flex;
    align-items: center;
    width: 80%;
    margin-bottom: 10px;
    > span {
        font-size: 15px;
        font-weight: 700;
    }
`;

const GoogleButton = styled(Button)<{ isTeacher: boolean }>`
    align-self: center;
    display: flex;
    justify-content: flex-start;
    min-height: 40px;
    border: 2px solid ${(props: any) => (props.isTeacher ? '#ffffff' : '#4285f4')};
    background-color: ${(props: any) => (props.isTeacher ? '#ffffff' : '#4285f4')};

    box-shadow: rgb(0 0 0 / 25%) 0px 2px 4px 0px;
    padding: 0;

    width: 190px;
    .MuiButton-label {
        height: 100%;
        display: flex;
        align-items: center;
        .icon-container {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            background-color: white;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 8px;
            & svg {
                height: 18px;
                width: 18px;
            }
        }
        .label-container {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            background-color: ${(props: any) => (props.isTeacher ? '#ffffff' : '#4285f4')};
            height: 40px;
            width: inherit;
            display: flex;
            align-items: center;
            padding: 0 8px;
            span {
                color: ${(props: any) => (props.isTeacher ? 'rgba(0, 0, 0, 0.54)' : '#ffffff')};
                font-family: 'Roboto';
                font-size: 14px;
            }
        }
    }
`;

const GetStartedTitle = styled.span`
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.21875px;
    color: #4a4a4a;
`;

const GetStartedDescription = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #000000;
    margin: 18px 0 30px 0;
`;

const Login = () => {
    return (
        <Root>
            <img src={logo} alt="safeKids for schools" />
            <WelcomeTextContainer>
                <WelcomeTitle>Welcome</WelcomeTitle>
                <WelcomeDescription>
                    Our solution provides a new framework called Pause, Reflect, and Redirect built on a foundation of mental health principles. We combine a
                    unique set of technology and community to solve the challenges faced by online learners in schools today.{' '}
                </WelcomeDescription>
                <GetStartedContainer>
                    <GetStartedTitle>Get Started</GetStartedTitle>
                    <GetStartedDescription>
                        In order to ensure Safe Kids has what we need, we need you to provide some information and you’ll be all set.{' '}
                    </GetStartedDescription>
                    <ButtonContainer>
                        <span>Admin login:</span>
                        <GoogleButton
                            isTeacher={false}
                            onClick={() => {
                                const API_URL = process.env.REACT_APP_API_URL || `http://localhost:4001/`;
                                window.open(`${API_URL}auth/google`, '_self');
                            }}
                        >
                            <div className="icon-container">
                                <GoogleIcon />
                            </div>
                            <div className="label-container">
                                <span>Sign in with Google</span>
                            </div>
                        </GoogleButton>
                    </ButtonContainer>
                    <ButtonContainer>
                        <span>Teacher login:</span>
                        <GoogleButton
                            isTeacher
                            onClick={() => {
                                const API_URL = process.env.REACT_APP_API_URL || `http://localhost:4001/`;
                                window.open(`${API_URL}auth/google/teacher`, '_self');
                            }}
                        >
                            <div className="icon-container">
                                <GoogleIcon />
                            </div>
                            <div className="label-container">
                                <span>Sign in with Google</span>
                            </div>
                        </GoogleButton>
                    </ButtonContainer>
                </GetStartedContainer>
            </WelcomeTextContainer>
        </Root>
    );
};

export default Login;
