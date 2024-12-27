import React from 'react';
import ThankyouPopup from '@src/components/ResumeOnboardingPopup/components/ThankyouPopup';
import TextButtonContainer from '@src/components/ResumeOnboardingPopup/components/TextButtonContainer';
import {Container} from '@src/components/ResumeOnboardingPopup/resumeOnboarding.styles'; //ThankyouPopup

interface Props {
  isLoggedIn: boolean;
}

export const ResumeOnboardingPopup = ({isLoggedIn}: Props) => {
  const startOnboardingPage = () => {
    const url = 'chrome-extension://' + chrome.runtime.id + '/pages/onboarding/index.html';
    chrome.tabs.create({url});
  };

  const getOnboardingProgress = () => {
    if (!isLoggedIn)
      return (
        <TextButtonContainer
          paragraph="Welcome, thanks for downloading. Do you have your Access Code?"
          buttonText="Get started"
          btnOnClick={startOnboardingPage}
        />
      );
    else if (isLoggedIn) {
      <ThankyouPopup/>;
    }
    return <></>;
  };

  return <Container>{getOnboardingProgress()}</Container>;
};
