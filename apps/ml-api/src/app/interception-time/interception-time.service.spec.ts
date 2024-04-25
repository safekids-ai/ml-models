import { Test, TestingModule } from '@nestjs/testing';
import { InterceptionTimeService } from './interception-time.service';
import { interceptionTimeProviders } from './interception-time.providers';

describe.skip('InterceptionTimeService', () => {
    let service: InterceptionTimeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InterceptionTimeService, ...interceptionTimeProviders],
        }).compile();

        service = module.get<InterceptionTimeService>(InterceptionTimeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
