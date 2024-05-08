import { Test, TestingModule } from '@nestjs/testing';
import { NonSchoolDaysConfigService } from './non-school-days-config.service';

describe.skip('NonSchoolDaysConfigService', () => {
    let service: NonSchoolDaysConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [NonSchoolDaysConfigService],
        }).compile();

        service = module.get<NonSchoolDaysConfigService>(NonSchoolDaysConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
