import { Test, TestingModule } from '@nestjs/testing';
import { AccountLicenseService } from './account-license.service';
import { accountLicenseProviders } from './account-license.providers';

describe.skip('AccountLicenseService', () => {
    let service: AccountLicenseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AccountLicenseService, ...accountLicenseProviders],
        }).compile();

        service = module.get<AccountLicenseService>(AccountLicenseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
