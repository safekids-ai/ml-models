import React from 'react';
import {defaultMessages} from '@shared/types/OnboardingMessage';
import {Root} from '@src/GetStartedContainer/footer/footer.style';

const Footer = (): JSX.Element => {
  return (
    <Root>
      <span>{defaultMessages.getStarted_footer_rights_reserved}</span>
      <span>
                {defaultMessages.getStarted_footer_safeKids}{' '}
        <a href="https://www.safekids.ai/terms-and-conditions/" target="_blank" rel="noopener noreferrer">
                    {defaultMessages.getStarted_footer_servicesTerms}
                </a>{' '}
        {defaultMessages.getStarted_footer_and}{' '}
        <a href="https://www.safekids.ai/privacy-policy/" target="_blank" rel="noopener noreferrer">
                    {defaultMessages.getStarted_footer_privacyPolicy}
                </a>
            </span>
    </Root>
  );
};

export default Footer;
