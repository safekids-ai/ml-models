import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CategoriesIcon, WebsitesIcon, SISIcon, SchoolScheduleIcon, InterceptionTimeIcon, CrisisManagementIcon } from '../../svgs/SchoolOnboarding';
import Logo from '../../svgs/Logo';
import Steps, { StepType } from '../../components/Steps/Steps';
import Categories from './Categories/Categories';
import Websites from './Websites/Websites';
import CrisisManagement from './CrisisManagement/CrisisManagement';
import { getRequest, history, patchRequest } from '../../utils/api';
import { GET_ONBOARDING_ORGUNITS, GET_ONBOARDING_STATUS, UPDATE_ONBOARDING_STEP } from '../../utils/endpoints';
import { logError } from '../../utils/helpers';
import SIS from './SIS/SIS';
import SchoolSchedule from './SchoolSchedule/SchoolSchedule';
import InterceptionTime from './InterceptionTime/InterceptionTime';
import FinishScreen from './FinishScreen/FinishScreen';
import cloneDeep from 'lodash/cloneDeep';
import { useSchoolUserContext } from '../../context/SchoolUserContext/SchoolUserContext';
import { onBoardingSteps, ONBOARDING_COMPLETED, ONBOARDING_IN_PROGRESS, StepDescription } from './SchoolOnboardingConstants';
import Footer from '../../components/Footer';

const Root = styled.div`
    min-height: inherit;
    height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    background: white;
    padding: 40px 90px 40px 120px;
    justify-content: space-between;
`;

const ContentContainer = styled.div`
    display: flex;
    justify-content: flex start;
    align-items: start;
`;

const Content = styled.div`
    margin-left: 12%;
    align-self: stretch;
`;

const Description = styled.span`
    height: 100px;
    margin-top: 20px;
    line-height: 18px;
    max-width: 630px;
    color: #000;
`;

const steps: StepType[] = [
    {
        index: 1,
        title: 'Categories',
        icon: CategoriesIcon,
    },
    {
        index: 2,
        title: 'Websites',
        icon: WebsitesIcon,
    },
    {
        index: 3,
        title: 'SIS Access',
        icon: SISIcon,
    },
    {
        index: 4,
        title: 'School Schedule',
        icon: SchoolScheduleIcon,
    },
    {
        index: 5,
        title: 'Interception Time',
        icon: InterceptionTimeIcon,
    },
    {
        index: 6,
        title: 'Crisis Engagement',
        icon: CrisisManagementIcon,
    },
];

const SchoolOnboarding = () => {
    const [step, setStep] = useState<number>(1);
    const currentStep = steps[step - 1];
    const [ouTree, setOuTree] = useState<any[]>([]);
    const [showFinishScreen, setShowFinishScreen] = useState<boolean>(false);
    const { isAdmin } = useSchoolUserContext();

    useEffect(() => {
        if (localStorage.getItem('account_type') === 'CONSUMER') {
            history.push('/onboarding');
        }
        if (!isAdmin) {
            history.push('/dashboard');
        } else {
            getRequest<{}, any[]>(GET_ONBOARDING_STATUS, {})
                .then((response: any) => {
                    if (response.data.onBoardingStatus === ONBOARDING_COMPLETED) {
                        history.push('/dashboard');
                    } else {
                        // redirect it to thank you screen as all on boarding steps are previously completed
                        if (response.data.onBoardingStep === onBoardingSteps.CRISIS_MANAGEMENT) {
                            setShowFinishScreen(true);
                            setStep(response.data.onBoardingStep);
                        } else {
                            // onBoardingStep states the completed step so adding 1 to move on next step
                            setStep(response.data.onBoardingStep + 1);
                        }

                        patchRequest<{}, any[]>(GET_ONBOARDING_STATUS, {
                            onBoardingStatus: ONBOARDING_IN_PROGRESS,
                        }).catch((err) => {
                            logError('UPDATE ONBOARDING STATUS', err);
                        });
                    }
                })
                .catch((err) => {
                    logError('GET ONBOARDING ORG UNITS', err);
                });
            getRequest<{}, any[]>(GET_ONBOARDING_ORGUNITS, {})
                .then((response) => {
                    if (response.data) {
                        setOuTree(response.data);
                    }
                })
                .catch((err) => {
                    logError('GET ONBOARDING ORG UNITS', err);
                });
        }
    }, []);

    const nextStep = (onboardingStep: Number = 0) => {
        // update onboarding step
        updateOnBoardingStep(onboardingStep);

        if (step === 6) {
            setShowFinishScreen(true);
        } else {
            setStep(step + 1);
        }
    };

    const finishOnboarding = (toSettings?: boolean) => {
        patchRequest<{}, any[]>(GET_ONBOARDING_STATUS, {
            onBoardingStatus: 'COMPLETED',
        })
            .then(() => {
                history.push(toSettings ? '/settings' : '/dashboard');
            })
            .catch((err) => {
                logError('UPDATE ONBOARDING STATUS', err);
            });
    };

    const updateOnBoardingStep = (onBoardingStep?: Number) => {
        patchRequest<{}, any[]>(UPDATE_ONBOARDING_STEP, {
            onBoardingStep,
        }).catch((err) => {
            logError('UPDATE ONBOARDING STEP', err);
        });
    };

    return (
        <Root>
            <a href="https://www.safekids.ai">
                <Logo />
            </a>
            <Description dangerouslySetInnerHTML={{ __html: !showFinishScreen ? StepDescription[step - 1] : '' }}></Description>
            <ContentContainer>
                <Steps steps={steps} currentStep={currentStep} horizontal={false} isSchool={true} done={showFinishScreen} />
                <Content>
                    {!showFinishScreen ? (
                        <>
                            {step === 1 && <Categories ouTree={cloneDeep(ouTree)} nextStep={() => nextStep(onBoardingSteps.CATEGORIES)} />}
                            {step === 2 && <Websites ouTree={cloneDeep(ouTree)} nextStep={() => nextStep(onBoardingSteps.WEBSITES)} />}
                            {step === 3 && <SIS nextStep={() => nextStep(onBoardingSteps.SIS)} />}
                            {step === 4 && <SchoolSchedule nextStep={() => nextStep(onBoardingSteps.SCHOOL_SCHEDULE)} />}
                            {step === 5 && <InterceptionTime nextStep={() => nextStep(onBoardingSteps.INTERCEPTION_TIME)} />}
                            {step === 6 && <CrisisManagement nextStep={() => nextStep(onBoardingSteps.CRISIS_MANAGEMENT)} />}
                        </>
                    ) : (
                        <FinishScreen finishOnboarding={finishOnboarding} />
                    )}
                </Content>
            </ContentContainer>
            <Footer anchorColor="#f7274a" />
        </Root>
    );
};

export default SchoolOnboarding;
