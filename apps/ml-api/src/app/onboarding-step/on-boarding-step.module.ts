import { Module } from '@nestjs/common';
import { OnBoardingStepService } from './on-boarding-step.service';
import { onboardingStepProviders } from './onboarding-step.providers';

@Module({
    providers: [OnBoardingStepService, ...onboardingStepProviders],
    exports: [OnBoardingStepService],
})
export class OnBoardingStepModule {}
