import React from 'react';

import {defaultMessages} from '@shared/types/OnboardingMessage';
import {Root, ImageContainer} from '@pages/ui-onboarding/GetStartedContainer/GetStarted/GetStarted.style';
import {Props} from '@pages/ui-onboarding/GetStartedContainer/GetStarted/GetStarted.type';

const GetStarted = ({getStartedClicked}: Props): JSX.Element => {
  const redirectURL = `${import.meta.env.PUBLIC_URL}/signup`;
  return (
    <Root>
      <div className="text-container">
        <span className="welcome-text">{defaultMessages.getStarted_welcome}</span>
        <img src="/assets/images/safekidsAiLogo.svg" alt="SafeKids Logo"/>
        <div className="at-home-text">at Home</div>
        <p>
          Are you a parent or guardian without an account?
          <a target="_blank" href={redirectURL} rel="noreferrer">
            Go Here
          </a>
        </p>
      </div>
      <ImageContainer>
        <img src="/assets/images/getStarted.png" alt="Onboarding family image"/>

        <ul>
          <li>
            Enter your kid-specific <b>access code</b> on the next screen.
          </li>
          <li>
            Optionally, take a <b>couple of minutes to answer some questions</b> as a family.{' '}
          </li>
          <li data-testid="test-all-set-li">
            {"You're all set."} <br/>
            <br/>
            Stay curious, and stay safe.{' '}
          </li>
        </ul>
      </ImageContainer>
      <button id="test-get-started-btn" data-testid="test-get-started-btn" onClick={getStartedClicked}>
        {defaultMessages.getStartedButton}
      </button>
    </Root>
  );
};

export default GetStarted;
