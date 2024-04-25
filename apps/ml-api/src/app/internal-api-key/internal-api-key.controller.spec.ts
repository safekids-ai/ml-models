import { Test, TestingModule } from '@nestjs/testing';
import { InternalApiKeyController } from './internal-api-key.controller';
import { InternalApiKeyService } from './internal-api-key.service';
import { internalApiKeyProviders } from './internal-api-key.providers';

describe('InternalApiKeyController', () => {
    let controller: InternalApiKeyController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InternalApiKeyController],
            providers: [InternalApiKeyService, ...internalApiKeyProviders],
        }).compile();

        controller = module.get<InternalApiKeyController>(InternalApiKeyController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
