import { Test, TestingModule } from '@nestjs/testing';
import { OnBoardingStepService } from './on-boarding-step.service';

describe.skip('OnboardingStepService', () => {
    let service: OnBoardingStepService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OnBoardingStepService],
        }).compile();

        service = module.get<OnBoardingStepService>(OnBoardingStepService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
