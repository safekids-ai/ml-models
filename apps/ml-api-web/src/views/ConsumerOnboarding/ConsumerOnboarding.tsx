import React, { useEffect, useState } from 'react';

import COPPA from './COPPA/COPPA';
import AddKid from './AddKid/AddKid';
import NextSteps from './NextSteps/NextSteps';
import { onBoardingSteps, ONBOARDING_COMPLETED } from './ConsumerOnboardingConstants';
import Steps, { StepType } from '../../components/Steps/Steps';

import { COPPAIcon, DollarIcon, FamilyIcon } from '../../svgs/ConsumerOnboarding';
import { getRequest, patchRequest, history } from '../../utils/api';
import { GET_ONBOARDING_STATUS, UPDATE_ONBOARDING_STEP } from '../../utils/endpoints';
import { logError } from '../../utils/helpers';
import { Root, ContentContainer, Content, Description } from './ConsumerOnboarding.style';
import Footer from '../../components/Footer';
import { PlanSelector } from './PlanSelector/PlanSelector';
import ConsumerLogo from '../../components/ConsumerLogo/ConsumerLogo';

const steps: StepType[] = [
    {
        index: 1,
        title: 'COPPA',
        icon: COPPAIcon,
    },
    {
        index: 2,
        title: 'Add Kid',
        icon: FamilyIcon,
    },
    {
        index: 3,
        title: 'Subscription',
        icon: DollarIcon,
    },
];

interface ConsumerOnboardingParams {
    forceShowOnboarding?: boolean;
    forceShowFinishScreen?: boolean;
    forceGoToStep?: number;
}

const defaultConsumerOnboardingParams = {
    forceShowOnboarding: false,
    forceShowFinishScreen: false,
    forceGoToStep: 1,
};

const ConsumerOnboarding = (props: ConsumerOnboardingParams = defaultConsumerOnboardingParams) => {
    const [step, setStep] = useState<number>(props.forceGoToStep ? props.forceGoToStep : 1);
    const currentStep = steps[step - 1];
    const [showOnboarding, setShowOnboarding] = useState<boolean>(!!props.forceShowOnboarding);
    const [showFinishScreen, setShowFinishScreen] = useState<boolean>(!!props.forceShowFinishScreen);
    useEffect(() => {
        if (localStorage.getItem('account_type') === 'SCHOOL') {
            history.push('/school-onboarding');
        }
        getRequest<{}, any[]>(GET_ONBOARDING_STATUS, {})
            .then(({ data }: any) => {
                if (data.onBoardingStatus === ONBOARDING_COMPLETED) {
                    history.push('/dashboard');
                } else {
                    // check if onBoarding Step reached to last step
                    if (data.onBoardingStep === onBoardingSteps.SUBSCRIPTION) {
                        setStep(data.onBoardingStep);
                        setShowFinishScreen(true);
                    } else {
                        // onBoardingStep states the completed step so adding 1 to move on next step
                        data?.onBoardingStep && setStep(data.onBoardingStep + 1);
                    }

                    setShowOnboarding(true);
                }
            })
            .catch((err) => {
                logError('GET ONBOARDING STATUS', err);
            });
    }, []);

    const nextStep = (nextStep?: number) => {
        console.log(nextStep, step);
        updateOnBoardingStep(step);
        if (step === onBoardingSteps.SUBSCRIPTION) {
            setShowFinishScreen(true);
        } else {
            setStep(step + 1);
        }
    };

    const updateOnBoardingStep = (onBoardingStep?: number) => {
        patchRequest<{}, any[]>(UPDATE_ONBOARDING_STEP, {
            onBoardingStep,
        }).catch((err) => {
            logError('UPDATE ONBOARDING STEP', err);
        });
    };

    const finishOnboarding = () => {
        patchRequest<{}, any[]>(GET_ONBOARDING_STATUS, {
            onBoardingStatus: ONBOARDING_COMPLETED,
        })
            .then(() => {
                history.push('/dashboard');
            })
            .catch((err) => {
                logError('UPDATE ONBOARDING STATUS', err);
            });
    };
    return showOnboarding ? (
        <Root>
            <div className="container">
                <ConsumerLogo onboardingInProgress={true}/>
                <Description></Description>
                <ContentContainer>
                    <Steps steps={steps} currentStep={currentStep} horizontal={false} isSchool={true} done={showFinishScreen} isConsumer={true} />
                    <Content>
                        {!showFinishScreen ? (
                            <>
                                {step === onBoardingSteps.COPPA && <COPPA nextStep={() => nextStep(onBoardingSteps.ADD_KID)} />}
                                {step === onBoardingSteps.ADD_KID && <AddKid nextStep={() => nextStep(onBoardingSteps.SUBSCRIPTION)} isOnBoarding />}
                                {step === onBoardingSteps.SUBSCRIPTION && <PlanSelector nextStep={() => nextStep()} isOnBoarding />}
                            </>
                        ) : (
                            <NextSteps finishOnboardings={finishOnboarding} />
                        )}
                    </Content>
                </ContentContainer>
            </div>
            <Footer />
        </Root>
    ) : (
        <div></div>
    );
};

export default ConsumerOnboarding;
