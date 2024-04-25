import { Test, TestingModule } from '@nestjs/testing';
import { ActivityAiDataController } from './activity-ai-data.controller';
import { ActivityAiDataService } from './activity-ai-data.service';
class Fixture {
    static getMock() {
        return jest.fn();
    }
    static ACTIVITY_AI_DATA_REPOSITORY = class {
        static sequelize = { query: jest.fn() };
        static create = Fixture.getMock();
    };
}
describe('ActivityAiDataController', () => {
    let controller: ActivityAiDataController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActivityAiDataController],
            providers: [
                ActivityAiDataService,
                {
                    provide: 'ACTIVITY_AI_DATA_REPOSITORY',
                    useValue: Fixture.ACTIVITY_AI_DATA_REPOSITORY,
                },
            ],
        }).compile();

        controller = module.get<ActivityAiDataController>(ActivityAiDataController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
