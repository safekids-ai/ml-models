import { Test, TestingModule } from '@nestjs/testing';
import { PrrManagerService } from './prr-manager.service';
import { PrrManagerController } from './prr-manager.controller';
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

describe('PrrManagerController', () => {
    let controller: PrrManagerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PrrManagerController],
            providers: [
                PrrManagerService,
                {
                    provide: ConfigService,
                    useValue: Fixture.getConfigService,
                },
            ],
        }).compile();

        controller = module.get<PrrManagerController>(PrrManagerController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
