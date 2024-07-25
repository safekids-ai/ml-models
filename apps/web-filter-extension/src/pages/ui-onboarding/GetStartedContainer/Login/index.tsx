import React from 'react';

import { Root } from '@src/pages/ui-onboarding/GetStartedContainer/Login/Login.style';
import { Props } from '@src/pages/ui-onboarding/GetStartedContainer/Login/Login.type';
import LoginForm from '@src/pages/ui-onboarding/GetStartedContainer/Login/LoginForm';

const Login = ({ loginComplete, onboardingFeedbackComplete }: Props) : JSX.Element => {
    return (
        <Root>
            <img src="/images/getStartedAlt.png" alt="getStarted alternate image" />
            <div className="login-wrapper">
                <LoginForm loginComplete={loginComplete} onboardingFeedbackComplete={onboardingFeedbackComplete} />
            </div>
        </Root>
    );
};

export default Login;
