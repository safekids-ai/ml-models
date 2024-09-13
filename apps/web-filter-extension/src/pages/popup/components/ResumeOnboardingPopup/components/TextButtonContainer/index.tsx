import React from 'react';
import {
  Root,
  CustomButton
} from '@pages/popup/components/ResumeOnboardingPopup/components/TextButtonContainer/textButtonContainer.style';

type Props = {
  paragraph: string;
  buttonText: string;
  btnOnClick: () => void;
};

const TextButtonContainer = ({paragraph, buttonText, btnOnClick}: Props) => {
  return (
    <Root>
      <p>{paragraph}</p>
      <div className="btn-wrapper">
        <CustomButton data-testid="test-btn-textBtn" onClick={() => btnOnClick()}>
          {buttonText}
        </CustomButton>
      </div>
    </Root>
  );
};

export default TextButtonContainer;
