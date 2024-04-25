import { Test, TestingModule } from '@nestjs/testing';
import { EmailEventConfigController } from './email-event-config.controller';
import { EmailEventConfigService } from './email-event-config.service';

describe.skip('EmailEventConfigController', () => {
    let controller: EmailEventConfigController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmailEventConfigController],
            providers: [EmailEventConfigService],
        }).compile();

        controller = module.get<EmailEventConfigController>(EmailEventConfigController);
    });

    it.skip('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
