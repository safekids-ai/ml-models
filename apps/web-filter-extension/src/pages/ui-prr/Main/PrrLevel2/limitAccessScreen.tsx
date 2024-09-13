import cx from 'classnames';
import React, {useEffect, useState} from 'react';
import {format, addMinutes} from 'date-fns';

import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {Language} from '@shared/types/Language.type';
import {PrrLevel} from '@shared/types/PrrLevel';
import {defaultMessages} from '@shared/types/PrrMessage';
import {closeTab} from '@pages/ui-prr/Main/common';
import {MainSection, IconsSection, TextSection, ButtonsSection, ContainerLevel3} from '../main.style';

type Props = {
  language: Language;
  category: string;
  siteName: string;
  level: PrrLevel;
};

const LimitAccessScreen = ({language, category, siteName, level}: Props): JSX.Element => {
  const {iUnderstand} = defaultMessages;
  const [permissibleURL, setPermissibleUrl] = useState<string[]>([]);
  const [accessRestoreTime, setAccessRestoreTime] = useState<string>('');

  useEffect(() => {
    void ChromeCommonUtils.getAccessLimitedTime().then((accessLimitedAt: string) => {
      if (accessLimitedAt) {
        // display time is 6 minute for roundoff seconds
        const displayTime = format(addMinutes(new Date(accessLimitedAt), 6), 'h:mm a');
        setAccessRestoreTime(displayTime);
      }
    });
  });

  useEffect(() => {
    void ChromeCommonUtils.getPermissibleURLs().then((res: string[]) => {
      setPermissibleUrl(res);
    });
  }, []);

  const accessLimitedMessage = `Sorry, but your access has been limited to the sites listed for around 5 minutes.<br><br>Please wait till, ${accessRestoreTime} to access the internet again.`;
  const accessLimitedMessageForEmptyState = `Sorry, your access has been limited for around 5 minutes.<br><br>Your parent hasn't set up any allowed sites so you'll just have to wait till ${accessRestoreTime} to start using the internet again.`;

  return (
    <MainSection>
      <IconsSection>
        <ContainerLevel3>
          <span className="icon-pause" id="icon-pause"></span>
        </ContainerLevel3>
      </IconsSection>
      <div className={cx({flex: !!permissibleURL.length})}>
        <TextSection className="flex">
          <div
            className={cx('it-looks-like-you-are', {'limited-access-width': !!permissibleURL.length})}
            dangerouslySetInnerHTML={{__html: !!permissibleURL.length ? accessLimitedMessage : accessLimitedMessageForEmptyState}}></div>
        </TextSection>
        {!!permissibleURL.length && (
          <div className="allowed-url-list-container">
            {permissibleURL.map((url, i) => (
              <a key={`allowedUrl-${i}`} target="_blank" rel="noreferrer" href={`https://${url}`}>
                {url}
              </a>
            ))}
          </div>
        )}
      </div>
      <ButtonsSection>
        <div lang={language.id} className="prr2-buttons">
          <a id="take-me-back" onClick={() => closeTab(true, accessLimitedMessage, category, siteName)}
             className="btn btn-dark">
            {iUnderstand}
          </a>
        </div>
      </ButtonsSection>
    </MainSection>
  );
};

export default LimitAccessScreen;
