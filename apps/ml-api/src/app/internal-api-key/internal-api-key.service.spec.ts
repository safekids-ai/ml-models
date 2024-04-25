import { Test, TestingModule } from '@nestjs/testing';
import { InternalApiKeyService } from './internal-api-key.service';
import { internalApiKeyProviders } from './internal-api-key.providers';

describe('InternalApiKeyService', () => {
    let service: InternalApiKeyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InternalApiKeyService, ...internalApiKeyProviders],
        }).compile();

        service = module.get<InternalApiKeyService>(InternalApiKeyService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
