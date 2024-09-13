import React from 'react';
import ThankyouPopup from '@pages/popup/components/ResumeOnboardingPopup/components/ThankyouPopup';
import TextButtonContainer from '@pages/popup/components/ResumeOnboardingPopup/components/TextButtonContainer';
import {Container} from '@pages/popup/components/ResumeOnboardingPopup/resumeOnboarding.styles'; //ThankyouPopup

interface Props {
  isLoggedIn: boolean;
}

export const ResumeOnboardingPopup = ({isLoggedIn}: Props) => {
  const startOnboardingPage = () => {
    const url = 'chrome-extension://' + chrome.runtime.id + '/src/pages/ui-onboarding/index.html';
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
