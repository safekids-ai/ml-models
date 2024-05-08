import { Test, TestingModule } from '@nestjs/testing';
import { PrrLevelService } from './prr-level.service';

describe.skip('PrrLevelService', () => {
    let service: PrrLevelService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrrLevelService],
        }).compile();

        service = module.get<PrrLevelService>(PrrLevelService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
