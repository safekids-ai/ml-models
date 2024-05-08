import { forwardRef, Module } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { apiKeyProviders } from './auth-key.providers';
import { OneRosterModule } from '../roster/roster.module';

@Module({
    imports: [forwardRef(() => OneRosterModule)],
    controllers: [ApiKeyController],
    providers: [ApiKeyService, ...apiKeyProviders],
    exports: [ApiKeyService],
})
export class ApiKeyModule {}
