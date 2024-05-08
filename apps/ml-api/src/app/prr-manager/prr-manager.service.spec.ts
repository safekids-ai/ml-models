import { Test, TestingModule } from '@nestjs/testing';
import { PrrManagerService } from './prr-manager.service';
import { ConfigService } from '@nestjs/config';
class Fixture {
    static getMock() {
        return jest.fn();
    }

    static getConfigService = class {
        static _isDevelopment = Fixture.getMock().mockReturnValue(true);
        static get = Fixture.getMock().mockReturnValue({ gmailExtension: {} });
    };
}

describe('PrrManagerService', () => {
    let service: PrrManagerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrrManagerService,
                {
                    provide: ConfigService,
                    useValue: Fixture.getConfigService,
                },
            ],
        }).compile();

        service = module.get<PrrManagerService>(PrrManagerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
