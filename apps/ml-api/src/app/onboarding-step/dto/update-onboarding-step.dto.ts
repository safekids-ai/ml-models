import { PartialType } from '@nestjs/mapped-types';
import { CreateOnboardingStepDto } from './create-onboarding-step.dto';

export class UpdateOnboardingStepDto extends PartialType(CreateOnboardingStepDto) {}
