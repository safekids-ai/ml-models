import { Test, TestingModule } from '@nestjs/testing';
import { UserOptInService } from './user-opt-in.service';
import { UserOptInController } from './user-opt-in.controller';
import { userOptInProviders } from './user-opt-in.providers';

describe('OptInController', () => {
    let controller: UserOptInController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserOptInController],
            providers: [UserOptInService, ...userOptInProviders],
        }).compile();

        controller = module.get<UserOptInController>(UserOptInController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
