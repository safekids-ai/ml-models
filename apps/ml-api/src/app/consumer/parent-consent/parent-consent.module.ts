import { Module } from '@nestjs/common';
import { ParentConsentService } from './parent-consent.service';
import { parentConsentProviders } from './parent-consent.providers';
import { LoggingModule } from '../../logger/logging.module';

@Module({
    imports: [LoggingModule],
    providers: [...parentConsentProviders, ParentConsentService],
    exports: [ParentConsentService],
})
export class ParentConsentModule {}
