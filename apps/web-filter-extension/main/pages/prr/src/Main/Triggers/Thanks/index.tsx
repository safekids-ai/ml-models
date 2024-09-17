import React from 'react';

import {PrrCategory} from '@shared/types/PrrCategory';
import {HttpUtils} from '@shared/utils/HttpUtils';
import useLanguageMessage from '@shared/hooks/useLanguageMessage';
import {closeTab, getRandomLanguageMessage} from '@src/Main/common';
import {MainSection, IconsSection, TextSection, ButtonsSection} from '@src/Main/main.style';
import {PrrLevel} from '@shared/types/PrrLevel';

type Props = {
  level: PrrLevel;
  category: string;
  siteName: string;
  onTellMeMoreEvent: () => void;
};

const ThanksScreen = ({level, onTellMeMoreEvent}: Props): JSX.Element => {
  const [, language] = useLanguageMessage();
  const category = HttpUtils.getParameterValue('category') as PrrCategory;
  const siteName = HttpUtils.getParameterValue('host');
  // let status = HttpUtils.getParameterValue('status');
  // let ai = HttpUtils.getParameterValue('ai');
  return (
    <MainSection>
      <IconsSection className="catch-step-2">
        <div className="container">
          <span className="icon-pause" id="icon-pause"></span>
          <a onClick={() => onTellMeMoreEvent()} className="link-more" id="link-more">
            {getRandomLanguageMessage('prr1_screen1_tellMeMore')}...
          </a>
        </div>
      </IconsSection>
      <TextSection className="flex m-t-20  step2-section-text">
        <div className="ask-inform-text">
          Thank you.
          <br/>
          <br/>
          {"We've asked your adult know. Please check with them"}
        </div>
      </TextSection>
      <ButtonsSection className="m-t-26">
        <div lang={language?.id} className="prr2-buttons">
          <a id="take-me-back" onClick={() => closeTab(false, '', category, siteName, false, level)}
             className="btn btn-dark">
            Take me back
          </a>
        </div>
      </ButtonsSection>
    </MainSection>
  );
};

export default ThanksScreen;
