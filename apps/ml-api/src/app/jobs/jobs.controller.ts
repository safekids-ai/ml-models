import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobDTO } from './dto/jobDTO';
import { IsAdminGuard } from '../auth/guard/is-admin-guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Jobs')
@Controller('v2/jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @ApiOperation({ summary: 'Creates job with given job type and account id.' })
    @ApiBearerAuth()
    @Post('org-units')
    @UseGuards(IsAdminGuard)
    create(@Body() jobDTO: JobDTO, @Request() req) {
        return this.jobsService.create(jobDTO, req.user.userId, req.user.accountId);
    }

    @ApiOperation({ summary: 'Returns job status for given id.' })
    @ApiBearerAuth()
    @Get('org-units/:jobId/status')
    @UseGuards(IsAdminGuard)
    findOne(@Param('jobId') jobId: string) {
        return this.jobsService.findOne(jobId);
    }
}
