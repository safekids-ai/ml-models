import { Test, TestingModule } from '@nestjs/testing';
import { EmailFeedbackService } from './email-feedback.service';
import { emailFeedbackProviders } from './email-feedback.providers';

describe('EmailFeedbackService', () => {
    let service: EmailFeedbackService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailFeedbackService, ...emailFeedbackProviders],
        }).compile();

        service = module.get<EmailFeedbackService>(EmailFeedbackService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
