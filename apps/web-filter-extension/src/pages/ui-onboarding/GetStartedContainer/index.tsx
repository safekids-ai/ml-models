import React, { useEffect, useState } from 'react';

import Footer from '@src/pages/ui-onboarding/GetStartedContainer/footer';
import GetStarted from '@src/pages/ui-onboarding/GetStartedContainer/GetStarted';
import { Root } from '@src/pages/ui-onboarding/GetStartedContainer/GetStartedContainer.style';
import Login from '@src/pages/ui-onboarding/GetStartedContainer/Login';
import Feedback from '@src/pages/ui-onboarding/GetStartedContainer/NewFeedback';
import SettingsChoice from '@src/pages/ui-onboarding/GetStartedContainer/SettingsChoice';
import ThankYou from '@src/pages/ui-onboarding/GetStartedContainer/ThankYou';
import { ChromeCommonUtils } from '@src/shared/chrome/utils/ChromeCommonUtils';
import { EventType } from '@src/shared/types/message_types';
import { onBoardingStatus } from '@src/shared/types/onBoardingStatus.type';

const GetStartedContainer = (): JSX.Element => {
    const [getStarted, setGetStarted] = useState<boolean>(false);
    const [loginComplete, setLoginComplete] = useState<boolean>(false);
    const [advanceToFeedback, setAdvanceToFeedback] = useState<boolean>(false);
    const [onboardingFeedbackComplete, setOnboardingFeedbackComplete] = useState<boolean>(false);
    const [customSettings, setCustomSettings] = useState<boolean>(true);
    const [currentOnboardingStep, setCurrentOnboardingStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [planType, setPlanType] = useState<string | undefined>('');
    useEffect(() => {
        ChromeCommonUtils.wakeup();
        checkUserCredentials();
    }, []);

    const checkUserCredentials = async () => {
        setLoading(true);
        const res = await ChromeCommonUtils.getUserCredentials().catch(() => {
            setLoading(false);
        });
        const logger = ChromeCommonUtils.getLogger();
        if (res && res?.accessCode) {
            setLoginComplete(true);
            const payload = { type: EventType.GET_ONBOARDING_STATUS };
            await chrome.runtime.sendMessage(payload, async (response: onBoardingStatus) => {
                setLoading(false);
                setPlanType(response?.planType);
                if (response.status === 'COMPLETED') {
                    setOnboardingFeedbackComplete(true);
                }
            });
        } else {
            logger.log(`setting loading false ${loginComplete}`);
            setLoading(false);
        }
    };

    const getSettingsChoice = (): JSX.Element => {
        if (advanceToFeedback) {
            return (
                <div className="content">
                    <Feedback currentOnboardingStep={currentOnboardingStep} onboardingFeedbackComplete={() => setOnboardingFeedbackComplete(true)} />
                </div>
            );
        }

        return (
            <SettingsChoice
                advanceToFeedbackScreen={() => {
                    setCustomSettings(true);
                    setAdvanceToFeedback(true);
                }}
                onBoardingComplete={() => {
                    setCustomSettings(false);
                    setOnboardingFeedbackComplete(true);
                }}
                planType={planType}
            />
        );
    };

    return (
        <Root>
            {!loading && (
                <>
                    {(getStarted || loginComplete) && (
                        <div className="header">
                            <img src="/images/safekidsAiLogo.svg" alt="safeKidsAiLogo" />
                            <p>at Home</p>
                        </div>
                    )}
                    <>
                        {loginComplete ? (
                            onboardingFeedbackComplete ? (
                                <ThankYou customSettings={customSettings} />
                            ) : (
                                <>{getSettingsChoice()}</>
                            )
                        ) : !getStarted ? (
                            <div className="content">
                                <GetStarted getStartedClicked={() => setGetStarted(true)} />
                            </div>
                        ) : (
                            <div className="content">
                                <Login
                                    loginComplete={(plan) => {
                                        setLoginComplete(true);

                                        plan && setPlanType(plan);
                                    }}
                                    onboardingFeedbackComplete={() => {
                                        setLoginComplete(true);
                                        setOnboardingFeedbackComplete(true);
                                    }}
                                />
                            </div>
                        )}
                    </>
                    <Footer />
                </>
            )}
        </Root>
    );
};

export default GetStartedContainer;
