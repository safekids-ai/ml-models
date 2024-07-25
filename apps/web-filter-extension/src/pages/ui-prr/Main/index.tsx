import 'antd/es/slider/style';
import React, { useEffect } from 'react';

import './index.css';
import { ChromeCommonUtils } from '../../../shared/chrome/utils/ChromeCommonUtils';
import { Language } from '../../../shared/types/Language.type';
import { EventType, LetUsKnowEvent, TakeMeBackEvent, TellMeMoreEvent } from '../../../shared/types/message_types';
import { PrrCategory } from '../../../shared/types/PrrCategory';
import { PrrLevel } from '../../../shared/types/PrrLevel';
import { defaultMessages } from '../../../shared/types/PrrMessage';
import { HttpUtils } from '../../../shared/utils/HttpUtils';

import { aiTakeMeBack, getRandomLanguageMessage, triggerInformMessage } from './common';
import LimitAccessScreen from './PrrLevel2/limitAccessScreen';
import PrrLevel2 from './PrrLevel2/PrrLevel2';
import Triggers from './Triggers';
import { ButtonsSection, TextSection } from './main.style';

export const Main: React.FC = () => {
    const defaultLanguage = { name: 'English', id: 'en', direction: 'ltr' };

    useEffect(() => {
        const logger = ChromeCommonUtils.getLogger();
        ChromeCommonUtils.wakeup();

        async function loadLanguage(): Promise<void> {
            let value: Language | undefined | null = await ChromeCommonUtils.readLocalStorage('language');
            if (value == null) {
                value = defaultLanguage;
            }
            setLanguage(value);

            const prr2Limit: boolean = await ChromeCommonUtils.readLocalStorage('prr2LimitExceeded');
            setPrr2LimitExceeded(prr2Limit);

            const accessLimited: boolean = await ChromeCommonUtils.readLocalStorage('accessLimited');
            setAccessLimited(accessLimited);

            if (!accessLimited && prr2Limit) {
                await ChromeCommonUtils.writeLocalStorage({ accessLimitedAt: new Date().getTime() });
                chrome.runtime.sendMessage({
                    type: 'LIMIT_ACCESS',
                    value: true,
                    category,
                });
            }
        }

        loadLanguage().catch(logger.error);
    }, []);
    const category = HttpUtils.getParameterValue('category') as PrrCategory;
    const status = HttpUtils.getParameterValue('status');

    const levelValue = HttpUtils.getParameterValue('level');
    const level: PrrLevel = !(levelValue === '') && !isNaN(+levelValue) ? (levelValue as PrrLevel) : PrrLevel.ONE;
    const host = HttpUtils.getParameterValue('host');
    const ai = HttpUtils.getParameterValue('ai');
    const isAiBack = HttpUtils.getParameterValue('isAiBack');

    const [showScreen1, setShowScreen1] = React.useState(true);
    const [showScreen2, setShowScreen2] = React.useState(false);
    const [showScreen3, setShowScreen3] = React.useState(false);
    const [language, setLanguage] = React.useState(defaultLanguage);
    const [prr2LimitExceeded, setPrr2LimitExceeded] = React.useState(false);
    const alertMessage = getRandomLanguageMessage('alertMessage');
    const situationalPart1Text = getRandomLanguageMessage('situationalAwarenessPart1');
    const situationalPart2Text = getRandomLanguageMessage('situationalAwarenessPart2');
    const weapon1Message = defaultMessages.prr3_weapons_1;
    const weapon2Message = defaultMessages.prr3_weapons_2;
    const explicitPart1Text = getRandomLanguageMessage('explicitContentPart1');
    const explicitPart2Text = getRandomLanguageMessage('explicitContentPart2');
    const [accessLimited, setAccessLimited] = React.useState(false);
    const [, setFromTrigger] = React.useState(false);
    const feedbackText = `${defaultMessages.prr1_feedback_thanks} ${defaultMessages.prr1_feedback_message}`;
    const level1Screen2content =
        category !== PrrCategory.ADULT_SEXUAL_CONTENT
            ? `${situationalPart1Text} ${situationalPart2Text}`
            : category === PrrCategory.ADULT_SEXUAL_CONTENT
            ? `${explicitPart1Text} ${explicitPart2Text}`
            : '';

    const onTellMeMoreEvent = (prrLevelId: PrrLevel): void => {
        setShowScreen1(false);
        setShowScreen2(true);
        setShowScreen3(false);
        // document.querySelector('html').classList.add('step2');

        const tellMeMoreEvent: TellMeMoreEvent = {
            type: EventType.TELL_ME_MORE,
            host,
            browser: HttpUtils.getBrowserInfo(),
            category,
            prrLevelId,
            text: alertMessage,
        };
        chrome.runtime.sendMessage(tellMeMoreEvent);
    };

    const onLetUsKnowEvent = (prrLevelId: PrrLevel): void => {
        setShowScreen1(false);
        setShowScreen3(true);

        document.querySelector('html')?.classList.add('step3');

        const letUsKnowEvent: LetUsKnowEvent = {
            type: EventType.LET_US_KNOW,
            host,
            browser: HttpUtils.getBrowserInfo(),
            category,
            prrLevelId,
            text: level1Screen2content,
        };
        chrome.runtime.sendMessage(letUsKnowEvent);
    };

    const onTakeMeBackEvent = (): void => {
        const takeMeBackEvent: TakeMeBackEvent = {
            type: EventType.TAKE_ME_BACK,
            host,
            browser: HttpUtils.getBrowserInfo(),
            category,
            prrLevelId: level,
            text:
                showScreen1 && level === PrrLevel.ONE
                    ? alertMessage
                    : showScreen2 && level === PrrLevel.ONE
                    ? level1Screen2content
                    : level === PrrLevel.THREE && category !== PrrCategory.SELF_HARM_SUICIDAL_CONTENT
                    ? `${weapon1Message} ${weapon2Message}`
                    : showScreen3
                    ? feedbackText
                    : '',
        };
        if (isAiBack) {
            window.history.go(-1);
        } else {
            window.history.go(-2);
        }
        chrome.runtime.sendMessage(takeMeBackEvent);
    };

    const checkTriggerCondition = (!showScreen2 && ai === 'true') || (!showScreen2 && level === PrrLevel.ONE && (status === 'ask' || status === 'inform'));

    return (
        <main id="prr-trigger-model" className="main">
            <div
                lang={language.id}
                className={`container ${showScreen2 ? 'step2' : showScreen3 ? 'step3' : ''}`}
                style={{ maxWidth: accessLimited || prr2LimitExceeded ? '650px' : '' }}>
                {checkTriggerCondition ? (
                    <Triggers
                        level={level}
                        onTellMeMoreEvent={() => {
                            onTellMeMoreEvent(level);
                        }}
                    />
                ) : accessLimited || prr2LimitExceeded ? (
                    <LimitAccessScreen language={language} category={category} level={level} siteName={host} />
                ) : level !== PrrLevel.TWO ? (
                    <>
                        <section className="section icons">
                            {level === PrrLevel.ONE && (
                                <div lang={language.id} className="container">
                                    <span lang={language.id} className="icon-pause" id="icon-pause"></span>
                                    <span lang={language.id} className="icon-reflect" id="icon-reflect"></span>
                                    <span lang={language.id} className="icon-check" id="icon-check"></span>
                                    <a onClick={() => onTellMeMoreEvent(level)} className="link-more" id="link-more">
                                        {getRandomLanguageMessage('prr1_screen1_tellMeMore')}...
                                    </a>
                                </div>
                            )}
                            {level === PrrLevel.THREE && (
                                <div lang={language.id} className="container-level-3">
                                    <span lang={language.id} className="icon-pause" id="icon-pause"></span>
                                </div>
                            )}
                        </section>
                        <section className="section text">
                            <div lang={language.id} className="container">
                                {level === PrrLevel.THREE && category !== PrrCategory.SELF_HARM_SUICIDAL_CONTENT && (
                                    <div dir={language.direction} style={{ textAlign: 'start' }} lang={language.id} className="It-looks-like-youre">
                                        {weapon1Message}
                                        <br /> <br />
                                        {weapon2Message}
                                    </div>
                                )}
                                {level === PrrLevel.THREE && category === PrrCategory.SELF_HARM_SUICIDAL_CONTENT && (
                                    <>
                                        <div dir={language.direction} style={{ textAlign: 'start' }} lang={language.id} className="Everyone-needs-some">
                                            {getRandomLanguageMessage('prr3_selfHarm_1')}
                                        </div>
                                        <div dir={language.direction} style={{ textAlign: 'start' }} lang={language.id} className="Please-talk-to-teachers">
                                            {getRandomLanguageMessage('prr3_selfHarm_2')}:
                                        </div>
                                        <div dir={language.direction} style={{ textAlign: 'start' }} lang={language.id} className="National-Suicide-Pre">
                                            {getRandomLanguageMessage('prr3_selfHarm_3')}
                                        </div>
                                        <div dir={language.direction} style={{ textAlign: 'start' }} lang={language.id} className="Emergency-number">
                                            988
                                        </div>
                                        <div dir={language.direction} style={{ textAlign: 'start' }} lang={language.id} className="Or-talk-to-one-of-yo">
                                            {getRandomLanguageMessage('prr3_selfHarm_4')}
                                        </div>
                                    </>
                                )}
                                {showScreen1 && level === PrrLevel.ONE && (
                                    <div lang={language.id} id="screen1Content" className="alert-message">
                                        <p id="alertMessage" dir={language.direction} style={{ textAlign: 'start' }}>
                                            {alertMessage}
                                        </p>
                                    </div>
                                )}
                                {showScreen2 && level === PrrLevel.ONE && (
                                    <div dir={language.direction} lang={language.id} id="screen2content" className="more-info">
                                        {category === PrrCategory.ADULT_SEXUAL_CONTENT && (
                                            <p dir={language.direction} style={{ textAlign: 'start' }} lang={language.id} className="explicit-content-p">
                                                {explicitPart1Text}
                                                <br /> <br />
                                                {explicitPart2Text}
                                            </p>
                                        )}
                                        {category !== PrrCategory.ADULT_SEXUAL_CONTENT && (
                                            <p dir={language.direction} style={{ textAlign: 'start' }}>
                                                {situationalPart1Text}
                                                <br /> <br />
                                                {situationalPart2Text}
                                            </p>
                                        )}
                                        {category !== PrrCategory.ADULT_SEXUAL_CONTENT && (
                                            <small>
                                                {getRandomLanguageMessage('prr1_screen2_mistake')}{' '}
                                                <a
                                                    onClick={() => {
                                                        onLetUsKnowEvent(level);
                                                        setFromTrigger(false);
                                                    }}
                                                    id="link-feedback">
                                                    {getRandomLanguageMessage('prr1_screen2_letUsKnow')}
                                                </a>
                                            </small>
                                        )}
                                        {ai === 'true' && category === PrrCategory.ADULT_SEXUAL_CONTENT && (
                                            <TextSection className="flex m-t-20  step2-section-text">
                                                <div className="screen2-last-text">
                                                    {'Now that you know this, do you '}
                                                    <span className="italic-font">{'still'}</span>
                                                    {' want to keep going?'}
                                                </div>
                                            </TextSection>
                                        )}
                                    </div>
                                )}
                                {showScreen3 && level === PrrLevel.ONE && (
                                    <div lang={language.id} id="screen3content" className="feedback">
                                        <p dir={language.direction} style={{ textAlign: 'start' }}>
                                            {defaultMessages.prr1_feedback_thanks}
                                        </p>
                                        <p dir={language.direction} style={{ textAlign: 'start' }}>
                                            {defaultMessages.prr1_feedback_message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                        {category !== PrrCategory.SELF_HARM_SUICIDAL_CONTENT && !(showScreen2 && level === PrrLevel.ONE && ai === 'true') && (
                            <section className="section buttons take-me-back">
                                <div lang={language.id} className="container">
                                    <a id="take-me-back" onClick={onTakeMeBackEvent} className="btn btn-dark">
                                        {defaultMessages.takeMeBack}
                                    </a>
                                </div>
                            </section>
                        )}
                        {showScreen2 && level === PrrLevel.ONE && ai === 'true' && (
                            <ButtonsSection className="m-t-26">
                                <div lang={language.id} className="prr2-buttons">
                                    <a id="take-me-back" onClick={() => aiTakeMeBack(ai, status, category, host, level)} className="btn btn-light">
                                        No
                                    </a>
                                    <a id="continue-trigger" onClick={() => triggerInformMessage(host, category)} className="btn btn-dark btn-light">
                                        Yes
                                    </a>
                                </div>
                            </ButtonsSection>
                        )}
                    </>
                ) : (
                    <PrrLevel2 language={language} level={level} category={category} siteName={host} prr2LimitExceeded={prr2LimitExceeded} />
                )}
            </div>
        </main>
    );
};
