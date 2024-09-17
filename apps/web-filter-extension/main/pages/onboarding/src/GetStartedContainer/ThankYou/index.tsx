import React from 'react';

import {defaultMessages} from '@shared/types/OnboardingMessage';

import {Root} from '@src/GetStartedContainer/ThankYou/ThankYou.style';
import {Props} from '@src/GetStartedContainer/ThankYou/ThankYou.type';

const ThankYou = ({customSettings}: Props): JSX.Element => {
  const heading = customSettings ? defaultMessages.thank_you_message_header_custom : defaultMessages.thank_you_message_header_recommended;
  return (
    <Root>
      <div className="heading">{heading}</div>
      <div className="images-container">
        <div className="image-container">
          <img src="/pages/onboarding/images/thankyou-laptop-1.svg" alt="laptop-1"/>
          <span>{defaultMessages.thank_you_laptop1Text}</span>
        </div>
        <div className="image-container">
          <img src="/pages/onboarding/images/thankyou-laptop-2.svg" alt="laptop-2"/>
          <span>{defaultMessages.thank_you_laptop2Text1}</span>
          <span>
                        <b>{defaultMessages.thank_you_laptop2Text2}</b>
                    </span>
        </div>
        <div className="image-container">
          <img src="/pages/onboarding/images/thankyou-laptop-3.svg" alt="laptop-3"/>
          <span>{defaultMessages.thank_you_laptop3Text}</span>
        </div>
      </div>
      <div className="heading footer">{defaultMessages.thank_you_message_footer}</div>
    </Root>
  );
};

export default ThankYou;
