import { Test, TestingModule } from '@nestjs/testing';
import { UserOptInService } from './user-opt-in.service';
import { userOptInProviders } from './user-opt-in.providers';

describe('OptInService', () => {
    let service: UserOptInService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserOptInService, ...userOptInProviders],
        }).compile();

        service = module.get<UserOptInService>(UserOptInService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
