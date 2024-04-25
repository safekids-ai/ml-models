import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ActivityAiDataService } from './activity-ai-data.service';
import type { ActivityAiDataCreationAttributes } from './entities/activity-ai-datum.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';

@ApiTags('ActivityAiData')
@Controller('v2/webusage/activities/ai-data')
export class ActivityAiDataController {
    constructor(private readonly activityAiDataService: ActivityAiDataService) {}

    @ApiOperation({ summary: 'Creates Prr Activity AI data.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Post()
    create(@Body() createActivityAiDatumDto: ActivityAiDataCreationAttributes) {
        return this.activityAiDataService.create(createActivityAiDatumDto);
    }
}
