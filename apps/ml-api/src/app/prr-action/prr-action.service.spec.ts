import { Test, TestingModule } from '@nestjs/testing';
import { PrrActionService } from './prr-action.service';

describe.skip('PrrActionService', () => {
    let service: PrrActionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrrActionService],
        }).compile();

        service = module.get<PrrActionService>(PrrActionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
