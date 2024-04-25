import { Test, TestingModule } from '@nestjs/testing';
import { EmailEventTypeService } from './email-event-type.service';
import { emailEventTypeProviders } from './email-event.providers';

describe('EmailEventTypeService', () => {
    let service: EmailEventTypeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailEventTypeService, ...emailEventTypeProviders],
        }).compile();

        service = module.get<EmailEventTypeService>(EmailEventTypeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
