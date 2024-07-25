import React, { useEffect, useState } from 'react';

import { Language } from '../../../../shared/types/Language.type';
import { PrrLevel } from '../../../../shared/types/PrrLevel';
import { defaultMessages } from '../../../../shared/types/PrrMessage';
import { closeTab } from '../common';
import { IconsSection, TextSection, ButtonsSection, ContainerLevel3 } from '../main.style';
type Props = {
    language: Language;
    category: string;
    siteName: string;
    level: PrrLevel;
    prr2LimitExceeded: boolean;
};
const PrrLevel2CountDown = ({ language, category, siteName, level, prr2LimitExceeded }: Props): JSX.Element => {
    const [screenText, setScreenText] = useState<string>('');
    const [countdown, setCountDown] = useState<number>(5);

    const { takeMeBack, PrrLevel2CountDownText1, PrrLevel2CountDownText2 } = defaultMessages;
    useEffect(() => {
        setScreenText(PrrLevel2CountDownText1);
    }, []);
    useEffect(() => {
        if (countdown === 1) {
            /* istanbul ignore next */
            setScreenText(PrrLevel2CountDownText2);
        }
        if (countdown > 1) {
            setTimeout(() => {
                /* istanbul ignore next */
                setCountDown(countdown - 1);
            }, 1000);
        }
    }, [countdown]);

    return (
        <>
            <IconsSection>
                <ContainerLevel3>
                    <span className="icon-countDown" id="icon-countDown">
                        {' '}
                        <span className="text-count-down">{countdown}</span>{' '}
                    </span>
                </ContainerLevel3>
            </IconsSection>
            <TextSection>
                <div className="prr2-screenB-text">
                    <span>{screenText}</span>
                </div>
            </TextSection>
            <ButtonsSection>
                <div lang={language.id} className="prr2-buttons">
                    <a
                        id="take-me-back"
                        onClick={() => closeTab(true, screenText, category, siteName, prr2LimitExceeded, level, [], [{ query: '', responses: [] }])}
                        className={'btn btn-dark' + (countdown !== 1 ? ' disable-button' : '')}>
                        {takeMeBack}
                    </a>
                </div>
            </ButtonsSection>
        </>
    );
};

export default PrrLevel2CountDown;
