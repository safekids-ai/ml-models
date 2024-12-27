import { Test, TestingModule } from '@nestjs/testing';
import { ActivityAiDataService } from './activity-ai-data.service';
import { PrrTriggers } from '../prr-trigger/prr-triggers.default';
import { Categories } from '../category/default-categories';
import { ActivityAiDataCreationAttributes } from './entities/activity-ai-datum.entity';

class Fixture {
    static getMock() {
        return jest.fn();
    }
    static ACTIVITY_AI_DATA_REPOSITORY = class {
        static sequelize = { query: jest.fn() };
        static create = Fixture.getMock();
        static findAll = Fixture.getMock();
    };
}
describe('Test ActivityAiDataService', () => {
    let service: ActivityAiDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActivityAiDataService,
                {
                    provide: 'ACTIVITY_AI_DATA_REPOSITORY',
                    useValue: Fixture.ACTIVITY_AI_DATA_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<ActivityAiDataService>(ActivityAiDataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create Activity AI Data', async () => {
        const aiData: ActivityAiDataCreationAttributes = {
            webUrl: 'google.com',
            fullWebUrl: 'google.com?search=adult',
            prrImages: ['https://google.com/1.jpg', 'https://google.com/2.jpg'],
            prrTexts: ['weapons1', 'ak47 gun'],
            prrTriggerId: PrrTriggers.AI_NLP_VISION,
            prrCategoryId: Categories.WEAPONS,
            activityTime: new Date(),
            falsePositive: false,
            os: '',
            extensionVersion: '',
            mlVersion: '',
            nlpVersion: '',
            browserVersion: '',
            browser: 'Chrome 10',
        };
        await service.create(aiData);

        expect(service).toBeDefined();
    });

    it('should find Ai Data for given date', async () => {
        const aiData: ActivityAiDataCreationAttributes = {
            webUrl: 'google.com',
            fullWebUrl: 'google.com?search=adult',
            prrImages: ['https://google.com/1.jpg', 'https://google.com/2.jpg'],
            prrTexts: ['weapons1', 'ak47 gun'],
            prrTriggerId: PrrTriggers.AI_NLP_VISION,
            prrCategoryId: Categories.WEAPONS,
            activityTime: new Date(),
            falsePositive: false,
            os: '',
            extensionVersion: '',
            mlVersion: '',
            nlpVersion: '',
            browserVersion: '',
            browser: 'Chrome 10',
        };
        jest.spyOn(Fixture.ACTIVITY_AI_DATA_REPOSITORY, 'findAll').mockResolvedValue([aiData]);

        const date = new Date();
        const data = await service.findAllByDate(date);

        expect(data).toBeTruthy();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
