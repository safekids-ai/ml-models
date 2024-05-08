import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTypeService } from './activity-type.service';

describe.skip('ActivityTypeService', () => {
    let service: ActivityTypeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ActivityTypeService],
        }).compile();

        service = module.get<ActivityTypeService>(ActivityTypeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
