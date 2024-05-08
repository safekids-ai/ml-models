import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { roleProviders } from './role.providers';

describe('RoleService', () => {
    let service: RoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RoleService, ...roleProviders],
        }).compile();

        service = module.get<RoleService>(RoleService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
