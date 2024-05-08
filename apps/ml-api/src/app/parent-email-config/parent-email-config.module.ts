import { Module } from '@nestjs/common';
import { ParentEmailConfigService } from './parent-email-config.service';
import { LoggingModule } from '../logger/logging.module';
import { KidConfigModule } from '../kid-config/kid-config.module';

@Module({
    imports: [LoggingModule, KidConfigModule],
    providers: [ParentEmailConfigService],
    exports: [ParentEmailConfigService],
})
export class ParentEmailConfigModule {}
