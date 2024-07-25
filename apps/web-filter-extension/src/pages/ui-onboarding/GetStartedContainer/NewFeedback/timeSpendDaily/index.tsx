import type { Moment } from 'moment';
import moment from 'moment';
import React from 'react';

import { EventType } from '@src/shared/types/message_types';
import { PrrCategory } from '@src/shared/types/PrrCategory';
import { OnboardingStatus } from '@src/pages/ui-onboarding/GetStartedContainer/GetStartedContainer.config';
import { ButtonSection } from '@src/pages/ui-onboarding/GetStartedContainer/NewFeedback/Feedback.style';

import { Root, TimeChoiceContainer, CustomSelect, CustomOption, CustomTimePicker } from '@src/pages/ui-onboarding/GetStartedContainer/NewFeedback/timeSpendDaily/timeSpendDaily.style';

type Props = {
    step: number;
    onboardingFeedbackComplete: () => void;
};
const defaultDuration = '60';

const TimeSpendDaily = ({ step, onboardingFeedbackComplete }: Props) => {
    const [gamingTime, setGamingTime] = React.useState<string>(defaultDuration);
    const [socialMediaTime, setSocialMediaTime] = React.useState<string>(defaultDuration);
    const [disconnectTime, setDisconnectTime] = React.useState<Moment>(moment(new Date()));
    const onTimeChange = (time: Moment, timeString: string) => {
        setDisconnectTime(time);
    };
    const onClickMethod = () => {
        const offtime = moment(disconnectTime).format('h:mm a');
        const categories = [
            {
                id: PrrCategory.ONLINE_GAMING,
                timeDuration: parseInt(gamingTime),
            },
            {
                id: PrrCategory.SOCIAL_MEDIA_CHAT,
                timeDuration: parseInt(socialMediaTime),
            },
        ];

        const payload = { type: EventType.UPDATE_CATEGORIES_TIME, categories, offtime };
        chrome.runtime.sendMessage(payload, async (response: any) => {
            onBoardingComplete();
        });
    };
    const onBoardingComplete = () => {
        /**
         *  Will only run for TimeSpendDaily screen.
         *  This is teh final screen and onboarding will complete after this
         */
        const payload = { type: EventType.SAVE_ONBOARDING_STATUS, status: OnboardingStatus.COMPLETED, step };
        onboardingFeedbackComplete();
    };
    return (
        <Root>
            <p className="question">How much time daily do you think you should spend on...</p>
            <TimeChoiceContainer>
                <div className="time-container">
                    <div className="type">Gaming?</div>
                    <CustomSelect id={'gameTimeId'} defaultValue={gamingTime} onChange={(value: string) => setGamingTime(value)}>
                        <CustomOption value="30">30 minutes</CustomOption>
                        <CustomOption value="60">60 minutes</CustomOption>
                        <CustomOption value="90">90 minutes</CustomOption>
                        <CustomOption value="120">120 minutes</CustomOption>
                    </CustomSelect>
                </div>
                <div className="time-container">
                    <div className="type">Social media?</div>
                    <CustomSelect id={'socialMediaTimeId'} defaultValue={socialMediaTime} onChange={(value: string) => setSocialMediaTime(value)}>
                        <CustomOption value="30">30 minutes</CustomOption>
                        <CustomOption value="60">60 minutes</CustomOption>
                        <CustomOption value="90">90 minutes</CustomOption>
                        <CustomOption value="120">120 minutes</CustomOption>
                    </CustomSelect>
                </div>
            </TimeChoiceContainer>
            <p className="question">When do you think you should disconnect at night?</p>
            <TimeChoiceContainer>
                <div className="time-container">
                    <div className="type"></div>
                    <CustomTimePicker data-testid={'disconnectTimeId'} value={disconnectTime} use12Hours format="h:mm a" onChange={onTimeChange} />
                </div>
            </TimeChoiceContainer>
            <ButtonSection className="section buttons">
                <a
                    id="take-me-back"
                    className={'enable-btn'}
                    onClick={() => {
                        onClickMethod();
                    }}>
                    CONTINUE
                </a>
            </ButtonSection>
        </Root>
    );
};

export default TimeSpendDaily;
