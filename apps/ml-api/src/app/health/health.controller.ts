import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health-service';

@Controller()
@ApiTags('Health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @ApiOperation({ summary: 'Check application health.' })
    @Get('health/check')
    checkHealth() {
        return;
    }
}
