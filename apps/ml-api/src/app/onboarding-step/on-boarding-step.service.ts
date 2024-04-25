import { Inject, Injectable } from '@nestjs/common';
import { CreateOnboardingStepDto } from './dto/create-onboarding-step.dto';
import { UpdateOnboardingStepDto } from './dto/update-onboarding-step.dto';
import { ONBOARDING_STEP_REPOSITORY } from '../constants';
import { OnBoardingStep } from './entities/onboarding-step.entity';
import { QueryException } from '../error/common.exception';
import { onBoardingSteps } from './onboarding-steps';

@Injectable()
export class OnBoardingStepService {
    constructor(@Inject(ONBOARDING_STEP_REPOSITORY) private readonly onboardingStepRepo: typeof OnBoardingStep) {}
    async create(createOnboardingStepDto: CreateOnboardingStepDto) {
        return await this.onboardingStepRepo.create(createOnboardingStepDto);
    }

    async findAll() {
        return await this.onboardingStepRepo.findAll({ order: [['id', 'ASC']] });
    }

    async findOne(id: number) {
        return await this.onboardingStepRepo.findOne({ where: { id } });
    }

    async update(id: number, updateOnboardingStepDto: UpdateOnboardingStepDto) {
        return await this.onboardingStepRepo.update(updateOnboardingStepDto, { where: { id } });
    }

    async remove(id: number) {
        return await this.onboardingStepRepo.destroy({ where: { id } });
    }

    async seedDefaultData() {
        try {
            for (const onBoardingStep of onBoardingSteps) {
                await this.onboardingStepRepo.upsert(onBoardingStep);
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
