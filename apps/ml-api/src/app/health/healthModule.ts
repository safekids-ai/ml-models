import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health-service';
import { healthProviders } from './health.providers';

@Module({
    controllers: [HealthController],
    providers: [HealthService, ...healthProviders],
    exports: [HealthService],
})
export class HealthModule {}
