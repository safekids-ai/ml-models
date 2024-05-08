import { Test, TestingModule } from '@nestjs/testing';
import { DefaultDataService } from './default-data.service';
import { LoggingService } from '../logger/logging.service';

describe('DefaultdataService', () => {
    let service: DefaultDataService;
    const mockLoggingService = {
        className: jest.fn(),
        debug: jest.fn(),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: DefaultDataService,
                    useValue: {},
                },
                {
                    provide: LoggingService,
                    useValue: mockLoggingService,
                },
            ],
        }).compile();

        service = module.get<DefaultDataService>(DefaultDataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
