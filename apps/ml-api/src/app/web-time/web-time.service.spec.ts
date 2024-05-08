import { Test, TestingModule } from '@nestjs/testing';
import { WebTimeService } from './web-time.service';

describe.skip('WebTimeService', () => {
    let service: WebTimeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WebTimeService],
        }).compile();

        service = module.get<WebTimeService>(WebTimeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
