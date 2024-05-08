import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { UserService } from '../user/user.service';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { GmailReportDto } from './dto/gmail-report.dto';
import { EmailEventService } from '../email-event/email-event.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Insights')
@Controller('v2/insights')
export class InsightController {
    constructor(
        private readonly activityService: ActivityService,
        private readonly emailEventService: EmailEventService,
        private readonly userService: UserService
    ) {}

    @ApiOperation({ summary: 'Returns top categories for given account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('dashboard/aggregated/categories')
    findTopCategories(@Request() req, @Query() query) {
        return this.activityService.findTopCategoriesByAccount(req.user.accountId, query.start, query.end);
    }

    @ApiOperation({ summary: 'Returns top urls for given account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('dashboard/aggregated/urls')
    findTopUrls(@Request() req, @Query() query) {
        return this.activityService.findTopURLs(req.user.accountId, query.start, query.end, query.orgPath);
    }

    @ApiOperation({ summary: 'Returns interceptions percentage change .' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('dashboard/aggregated/interceptions')
    findPercentageChange(@Request() req, @Query() query) {
        return this.activityService.findInterceptionsPercentageChange(req.user.accountId, query.start, query.end, query.orgPath);
    }

    @ApiOperation({ summary: 'Returns top interception for given account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('dashboard/interceptions/top')
    findTopInterceptions(@Request() req, @Query() query) {
        return this.activityService.findTopInterceptions(req.user.accountId, query.start, query.end, query.orgPath);
    }

    @ApiOperation({ summary: 'Returns all users with access limited for given account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('dashboard/users/accesslimited')
    findAllUserWithAccessLimited(@Request() req, @Query() query) {
        return this.userService.findAllUsersWithAccessLimited(query.page, query.size, req.user.accountId, query.start, query.end, query.orgPath);
    }

    @ApiOperation({ summary: 'Returns all users who triggered prr level 3 for given account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('dashboard/users/crises')
    findAllPrrLevel3(@Request() req, @Query() query) {
        return this.activityService.findAllPrrLevel3(query.page, query.size, req.user.accountId, query.start, query.end, query.orgPath);
    }

    @ApiOperation({ summary: 'Returns all no interceptions.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('dashboard/reports/urls/notintercepted')
    findAllNotIntercepted(@Request() req, @Query() query) {
        return this.activityService.findAllNotIntercepted(query.page, query.size, req.user.accountId, query.start, query.end, query.orderBy, query.orgPath);
    }

    @ApiOperation({ summary: 'Returns gmail report for given dates.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('dashboard/reports/gmail')
    async findGmailReport(@Request() req, @Query() query): Promise<GmailReportDto> {
        return await this.emailEventService.getGmailReport(req.user.accountId, query.start, query.end);
    }
}
