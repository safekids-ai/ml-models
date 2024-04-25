import { Module } from '@nestjs/common';
import { InternalApiKeyService } from './internal-api-key.service';
import { InternalApiKeyController } from './internal-api-key.controller';
import { internalApiKeyProviders } from './internal-api-key.providers';

@Module({
    controllers: [InternalApiKeyController],
    providers: [InternalApiKeyService, ...internalApiKeyProviders],
    exports: [InternalApiKeyService],
})
export class InternalApiKeyModule {}
