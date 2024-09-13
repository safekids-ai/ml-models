import React from 'react';
import {CustomButton} from '@pages/popup/components/ResumeOnboardingPopup/resumeOnboarding.styles';
import {
  Root,
  Description,
  IconsSection,
  QuestionOval
} from '@pages/popup/components/ResumeOnboardingPopup/components/OnboardingProgress/onboardingProgress.style';

type Props = {
  totalQuestions: number;
  currentQuestionNumber: number;
  onClick: () => void;
};
const OnboardingProgress = ({totalQuestions, currentQuestionNumber, onClick}: Props): JSX.Element => {
  const onboardingFeedbackQuestions = new Array(totalQuestions).fill(0);
  return (
    <Root>
      <Description>Onboarding progress:</Description>
      <IconsSection>
        <div className="icon-section-container">
          <div className="ovals-container">
            {onboardingFeedbackQuestions.map((_, index) => (
              <QuestionOval key={index} currentIndex={index} questionNumber={currentQuestionNumber}/>
            ))}
          </div>
        </div>
      </IconsSection>
      <div className="btn-wrapper">
        <CustomButton onClick={onClick}>Continue</CustomButton>
      </div>
    </Root>
  );
};

export default OnboardingProgress;
