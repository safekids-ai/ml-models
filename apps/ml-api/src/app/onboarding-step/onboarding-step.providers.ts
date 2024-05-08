import { ONBOARDING_STEP_REPOSITORY } from '../constants';
import { OnBoardingStep } from './entities/onboarding-step.entity';

export const onboardingStepProviders = [
    {
        provide: ONBOARDING_STEP_REPOSITORY,
        useValue: OnBoardingStep,
    },
];
