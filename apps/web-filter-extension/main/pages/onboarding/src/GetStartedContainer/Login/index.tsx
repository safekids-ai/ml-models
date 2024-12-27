import React from 'react';

import {Root} from '@src/GetStartedContainer/Login/Login.style';
import {Props} from '@src/GetStartedContainer/Login/Login.type';
import LoginForm from '@src/GetStartedContainer/Login/LoginForm';

const Login = ({loginComplete, onboardingFeedbackComplete}: Props): JSX.Element => {
  return (
    <Root>
      <img src="/pages/onboarding/images/getStartedAlt.png" alt="getStarted alternate image"/>
      <div className="login-wrapper">
        <LoginForm loginComplete={loginComplete} onboardingFeedbackComplete={onboardingFeedbackComplete}/>
      </div>
    </Root>
  );
};

export default Login;
