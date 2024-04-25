import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from '../../auth/guard/google-oauth.guard';
import { UserPlanDto } from './dto/user-plan.dto';
import { PlanDto } from './dto/plan.dto';

@ApiTags('Plans')
@Controller('v2/billing/plans')
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @ApiOperation({ summary: 'Returns default plans.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    findAll(@Request() req): Promise<PlanDto[]> {
        return this.planService.findAll();
    }

    @ApiOperation({ summary: 'Returns account plan.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('current')
    findOne(@Request() req): Promise<UserPlanDto> {
        return this.planService.findOneByAccountId(req.user.accountId);
    }
}
