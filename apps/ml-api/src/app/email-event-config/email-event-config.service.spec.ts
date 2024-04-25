import { Test, TestingModule } from '@nestjs/testing';
import { EmailEventConfigService } from './email-event-config.service';

describe.skip('EmailEventConfigService', () => {
    let service: EmailEventConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailEventConfigService],
        }).compile();

        service = module.get<EmailEventConfigService>(EmailEventConfigService);
    });

    it.skip('should be defined', () => {
        expect(service).toBeDefined();
    });
});
