import React from 'react';

import {EventType} from '@shared/types/message_types';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {HttpUtils} from '@shared/utils/HttpUtils';
import useLanguageMessage from '@shared/hooks/useLanguageMessage';
import {closeTab, getRandomLanguageMessage} from '@pages/ui-prr/Main/common';
import {MainSection, IconsSection, TextSection, ButtonsSection} from '@pages/ui-prr/Main/main.style';

type Props = {
  level: PrrLevel;
  onTellMeMoreEvent: () => void;
};

const InformScreen = ({level, onTellMeMoreEvent}: Props): JSX.Element => {
  const [, language] = useLanguageMessage();
  const category = HttpUtils.getParameterValue('category') as PrrCategory;
  const siteName = HttpUtils.getParameterValue('host');
  const eventId = HttpUtils.getParameterValue('eventId');
  // let status = HttpUtils.getParameterValue('status');
  // let ai = HttpUtils.getParameterValue('ai');
  const triggerInformMessage = (): void => {
    const payload = {url: siteName, categoryId: category, ai: false, eventId};
    const eventPayload = {type: EventType.PRR_INFORM_ACTION, payload};

    chrome.runtime.sendMessage(eventPayload);
  };
  const categoryToShow = category?.replaceAll('_', ' ')?.toLowerCase();
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
        <div className="ask-inform-text  inform-section">
          Hey! This looks like <b className="capitalize">{categoryToShow}</b>.
          <br/>
          <br/>
          You can keep going, <b>we just need to let an adult know.</b>
        </div>
      </TextSection>
      <ButtonsSection className="m-t-26">
        <div lang={language.id} className="prr2-buttons">
          <a id="take-me-back" onClick={async () => await closeTab(false, '', category, siteName, false, level)}
             className="btn btn-light">
            Take me back
          </a>
          <a id="continue-trigger" onClick={triggerInformMessage} className="btn btn-dark btn-light">
            Keep Going
          </a>
        </div>
      </ButtonsSection>
    </MainSection>
  );
};

export default InformScreen;
