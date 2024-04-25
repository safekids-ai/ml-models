import { Test, TestingModule } from '@nestjs/testing';
import { LicenseService } from './license.service';
import { licenseProviders } from './license.providers';

describe.skip('LicenseService', () => {
    let service: LicenseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LicenseService, ...licenseProviders],
            exports: [LicenseService],
        }).compile();

        service = module.get<LicenseService>(LicenseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
