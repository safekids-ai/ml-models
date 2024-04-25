import { Test, TestingModule } from '@nestjs/testing';
import { RosterOrgService } from './roster-org.service';

describe.skip('RosterOrgService', () => {
    let service: RosterOrgService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RosterOrgService],
        }).compile();

        service = module.get<RosterOrgService>(RosterOrgService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
