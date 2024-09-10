import React from 'react';

import { EventType, PrrCrisisAction, PrrInformAIAction } from '@src/shared/types/message_types';
import { PrrLevel } from '@src/shared/types/PrrLevel';
import { HttpUtils } from '@src/shared/utils/HttpUtils';
import useLanguageMessage from '@src/pages/content/hooks/useLanguageMessage';
import { getRandomLanguageMessage, aiTakeMeBack, triggerCrisisMessage } from '@src/pages/ui-prr/Main/common';
import { MainSection, IconsSection, TextSection, ButtonsSection } from '@src/pages/ui-prr/Main/main.style';
import { ChromeCommonUtils } from '@src/shared/chrome/utils/ChromeCommonUtils';
import { PrrCategory } from '@src/shared/types/PrrCategory';
import { PrrCrisis } from '@src/shared/types/PrrCrisis.type';
import { PrrInformAI } from '@src/shared/types/PrrInformAI';

type Props = {
    level: PrrLevel;
    onTellMeMoreEvent: () => void;
};

const InformAIScreen = ({ level, onTellMeMoreEvent }: Props): JSX.Element => {
    const logger = ChromeCommonUtils.getLogger();
    const [, language] = useLanguageMessage();
    const ai = HttpUtils.getParameterValue('ai');
    const status = HttpUtils.getParameterValue('status');
    const category = HttpUtils.getParameterValue('category');
    const host = HttpUtils.getParameterValue('host');

    const triggerInformMessage = (): void => {
        const payload: PrrInformAI = { url: host, categoryId: category, ai: true };
        const eventPayload: PrrInformAIAction = { type: EventType.PRR_INFORM_AI_ACTION, payload };
        try {
            chrome.runtime.sendMessage(eventPayload);
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`unable to send message to backend: ${e.message}`);
            } else {
                logger.error(`unable to send message to backend: ${JSON.stringify(e)}`);
            }
        }
    }

    const aiContinue = (): void => {
        if (level === PrrLevel.THREE) {
            triggerCrisisMessage(host, category, true);
            return;
        }
        triggerInformMessage()
    };

    const categoryToShow = category?.replaceAll('_', ' ')?.toLowerCase();
    const prrMessage =
        level === PrrLevel.THREE
            ? `We agreed to let an adult know if you tried to access content related to <b class="capitalize">${categoryToShow}</b>. This page looks unsafe to us.`
            : 'We agreed to let an adult know if you visit a website that our AI thinks might be unsafe.';

    return (
        <MainSection>
            <IconsSection className="catch-step-2">
                {category === PrrCategory.WEAPONS && level === PrrLevel.THREE ? (
                    <section className="section icons">
                        <div lang={language.id} className="container-level-3">
                            <span lang={language.id} className="icon-pause" id="icon-pause"></span>
                        </div>
                    </section>
                ) : (
                    <div className="container">
                        <span className="icon-pause" id="icon-pause"></span>
                        <a onClick={() => onTellMeMoreEvent()} className="link-more" id="link-more">
                            {getRandomLanguageMessage('prr1_screen1_tellMeMore')}...
                        </a>
                    </div>
                )}
            </IconsSection>
            <TextSection className="flex m-t-20  step2-section-text">
                <div className="ask-inform-text  infrom-section">
                    <div dangerouslySetInnerHTML={{ __html: prrMessage }} />
                    <br />
                    <br />
                    {'Do you want to keep going?'}
                </div>
            </TextSection>
            <ButtonsSection>
                <div lang={language.id} className="prr2-buttons">
                    <a id="take-me-back" onClick={() => aiTakeMeBack(ai, status, category, host, level)} className="btn btn-light">
                        No
                    </a>
                    <a id="continue-trigger" onClick={aiContinue} className="btn btn-dark btn-light">
                        Yes
                    </a>
                </div>
            </ButtonsSection>
        </MainSection>
    );
};

export default InformAIScreen;
