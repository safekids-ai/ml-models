import { Test, TestingModule } from '@nestjs/testing';
import { WebTimeController } from './web-time.controller';
import { WebTimeService } from './web-time.service';

describe.skip('WebTimeController', () => {
    let controller: WebTimeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WebTimeController],
            providers: [WebTimeService],
        }).compile();

        controller = module.get<WebTimeController>(WebTimeController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
