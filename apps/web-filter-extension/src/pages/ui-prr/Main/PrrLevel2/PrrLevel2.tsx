import React from 'react';

import {Language} from '@shared/types/Language.type';
import {PrrLevel} from '@shared/types/PrrLevel';
import {defaultMessages} from '@shared/types/PrrMessage';
import {IconsSection, TextSection, ButtonsSection, ContainerLevel3} from '@pages/ui-prr/Main/main.style';
import PrrLevel2CountDown from '@pages/ui-prr/Main/PrrLevel2/PrrLevel2CountDown';

type Props = {
  language: Language;
  category: string;
  siteName: string;
  level: PrrLevel;
  prr2LimitExceeded: boolean;
};

const PrrLevel2 = ({language, category, siteName, level, prr2LimitExceeded}: Props): JSX.Element => {
  const [prrLevel2CountDownScreen, setPrrLevel2CountDownScreen] = React.useState(false);

  const showPrrLevel2CountDownScreen = (): void => {
    setPrrLevel2CountDownScreen(true);
  };

  const {prr2Screen1Text1, prr2Screen1Text2} = defaultMessages;

  return (
    <>
      {prrLevel2CountDownScreen ? (
        <PrrLevel2CountDown language={language} category={category} level={level} siteName={siteName}
                            prr2LimitExceeded={prr2LimitExceeded}/>
      ) : (
        <>
          <IconsSection>
            <ContainerLevel3>
              <span className="icon-pause" id="icon-pause"></span>
            </ContainerLevel3>
          </IconsSection>
          <TextSection>
            <div className="it-looks-like-you-are">{prr2Screen1Text1}</div>
          </TextSection>
          <ButtonsSection>
            <div className="prr2-buttons">
              <a id="i-am-good" className="btn btn-dark" onClick={showPrrLevel2CountDownScreen}>
                {prr2Screen1Text2}
              </a>
            </div>
          </ButtonsSection>
        </>
      )}
    </>
  );
};

export default PrrLevel2;
