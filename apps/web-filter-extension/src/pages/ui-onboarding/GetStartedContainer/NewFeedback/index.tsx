import React, { useState, useCallback } from 'react';

import { EventType } from '@src/shared/types/message_types';
import { PrrCategory } from '@src/shared/types/PrrCategory';

import { totalQuestions } from '@src/pages/ui-onboarding/GetStartedContainer/NewFeedback/Feedback.config';
import { ButtonSection, Root, SectionSplitter, TextSection } from '@src/pages/ui-onboarding/GetStartedContainer/NewFeedback/Feedback.style';
import { Props } from '@src/pages/ui-onboarding/GetStartedContainer/NewFeedback/Feedback.type';
import SelectChoices from '@src/pages/ui-onboarding/GetStartedContainer/NewFeedback/selectChoicesNew';

const Feedback = ({ onboardingFeedbackComplete, currentOnboardingStep }: Props): JSX.Element => {
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string>('');

    const showNextQuestion = useCallback((): void => {
        switch (currentQuestionNumber) {
            case 0:
                saveSelectedOptions({
                    id: PrrCategory.ONLINE_GAMING,
                    status: selectedOption,
                });
                break;
            case 1:
                saveSelectedOptions({
                    id: PrrCategory.SOCIAL_MEDIA_CHAT,
                    status: selectedOption,
                });
                break;
            default:
                break;
        }
    }, [selectedOption]);

    const saveSelectedOptions = (category: { id: string; status: string }): void => {
        const payload = { type: EventType.UPDATE_CATEGORIES, category };
        chrome.runtime.sendMessage(payload, (): void => {

                if (currentQuestionNumber === 1) {
                    onboardingFeedbackComplete();
                    return;
                }
                setCurrentQuestionNumber(currentQuestionNumber + 1);
                setSelectedOption('');

        });
    };

    return (
        <Root>
            <img className="onboarding-feedback-img" src="/images/getStartedAlt.png" alt="safeKidsAiLogo" />
            <SectionSplitter>
                <TextSection key={`question-${currentQuestionNumber}`}>
                    <div className="prr2-screenD-text">
                        <span className="can-we-talk-about-it">{totalQuestions[currentQuestionNumber]?.questionHeadings}</span>
                        <span className="choose-following">{totalQuestions[currentQuestionNumber]?.choiceParagraph}</span>
                    </div>
                </TextSection>
                <SelectChoices
                    key={`select-choice-${currentQuestionNumber}`}
                    setOption={(val) => {
                        setSelectedOption(val);
                    }}
                    currentSelectedOption={selectedOption}
                />
                <ButtonSection className="section buttons" key={`continue-button-${currentQuestionNumber}`}>
                    <a
                        id="take-me-back"
                        className={selectedOption.length > 0 ? 'enable-btn' : 'disable-btn'}
                        onClick={(e) => {
                            e.preventDefault();
                            showNextQuestion();
                        }}
                    >
                        CONTINUE
                    </a>
                </ButtonSection>
            </SectionSplitter>
        </Root>
    );
};

export default Feedback;
