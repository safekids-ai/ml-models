import { Module } from '@nestjs/common';
import { KidConfigService } from './kid-config.service';
import { kidConfigProviders } from './kid-config.providers';

@Module({
    providers: [KidConfigService, ...kidConfigProviders],
    exports: [KidConfigService],
})
export class KidConfigModule {}
