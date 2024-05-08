import { Module } from '@nestjs/common';
import { InterceptionTimeService } from './interception-time.service';
import { InterceptionTimeController } from './interception-time.controller';
import { interceptionTimeProviders } from './interception-time.providers';
import { orgUnitProviders } from '../org-unit/org-unit.providers';
import { OrgUnitModule } from '../org-unit/org-unit.module';

@Module({
    controllers: [InterceptionTimeController],
    providers: [InterceptionTimeService, ...interceptionTimeProviders],
    exports: [InterceptionTimeService],
})
export class InterceptionTimeModule {}
