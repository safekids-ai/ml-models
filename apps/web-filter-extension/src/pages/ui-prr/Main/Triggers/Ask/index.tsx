import React, { useState } from 'react';

import { EventType } from '../../../../../shared/types/message_types';
import { PrrLevel } from '../../../../../shared/types/PrrLevel';
import { HttpUtils } from '../../../../../shared/utils/HttpUtils';
import useLanguageMessage from '../../../../content/hooks/useLanguageMessage';
import { closeTab, getRandomLanguageMessage } from '../../common';
import { MainSection, IconsSection, TextSection, ButtonsSection } from '../../main.style';
import Thanks from '../Thanks';
import { PrrCategory } from '../../../../../shared/types/PrrCategory';
type Props = {
    level: PrrLevel;
    onTellMeMoreEvent: () => void;
};

const AskScreen = ({ level, onTellMeMoreEvent }: Props): JSX.Element => {
    const [showThanks, setShowThanks] = useState(false);
    const [, language] = useLanguageMessage();

    const category = HttpUtils.getParameterValue('category') as PrrCategory;
    const siteName = HttpUtils.getParameterValue('host');
    const ai = HttpUtils.getParameterValue('ai');

    const triggerAskMessage = async (): Promise<void> => {
        const url = HttpUtils.refineHost(siteName);
        const payload = {
            type: EventType.PRR_ASK_ACTION,
            payload: { url, ai: ai === 'true', categoryId: category },
        };
        await chrome.runtime.sendMessage(payload, (response) => {
            if (response) {
                setShowThanks(true);
            }
        });
    };
    const categoryToShow = category?.replaceAll('_', ' ')?.toLowerCase();
    return (
        <>
            {!showThanks ? (
                <MainSection>
                    <IconsSection className="catch-step-2">
                        <div className="container">
                            <span className="icon-pause" id="icon-pause"></span>
                            <a onClick={() => onTellMeMoreEvent()} className="link-more" id="link-more" data-testid="linkMore">
                                {getRandomLanguageMessage('prr1_screen1_tellMeMore')}...
                            </a>
                        </div>
                    </IconsSection>
                    <TextSection className="flex m-t-20  step2-section-text">
                        <div className="ask-inform-text ask-section">
                            {"Hello! Before you visit this site, we need to ask an adult if it's okay since it's"}{' '}
                            <b className="capitalize">{categoryToShow}</b>
                        </div>
                    </TextSection>
                    <ButtonsSection className="m-t-26">
                        <div lang={language.id} className="prr2-buttons">
                            <a
                                data-testid={'takeMeBack'}
                                id="take-me-back"
                                onClick={() => closeTab(false, '', category, siteName, false, level)}
                                className="btn btn-light">
                                Take me back
                            </a>
                            <a id="continue-trigger" onClick={async () => await triggerAskMessage()} className="btn btn-dark btn-light">
                                Ask An Adult
                            </a>
                        </div>
                    </ButtonsSection>
                </MainSection>
            ) : (
                <Thanks category={category} level={level} onTellMeMoreEvent={onTellMeMoreEvent} siteName={siteName} />
            )}
        </>
    );
};

export default AskScreen;
