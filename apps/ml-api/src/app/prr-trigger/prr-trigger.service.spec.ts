import { Test, TestingModule } from '@nestjs/testing';
import { PrrTriggerService } from './prr-trigger.service';

describe.skip('PrrTriggerService', () => {
    let service: PrrTriggerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrrTriggerService],
        }).compile();

        service = module.get<PrrTriggerService>(PrrTriggerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
