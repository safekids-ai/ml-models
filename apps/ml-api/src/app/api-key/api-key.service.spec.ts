import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from './api-key.service';
import { apiKeyProviders } from './auth-key.providers';

describe.skip('ApiKeyService', () => {
    let service: ApiKeyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ApiKeyService, ...apiKeyProviders],
        }).compile();

        service = module.get<ApiKeyService>(ApiKeyService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
