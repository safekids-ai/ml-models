import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { FilteredProcessService } from './filtered-process.service';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilteredProcessDto } from './dto/filtered-process.dto';

@ApiTags('Filtered process')
@Controller('v2/webfilter/filtered-process')
export class FilteredProcessController {
    constructor(private readonly filteredProcessService: FilteredProcessService) {}

    @ApiOperation({ summary: 'Returns filtered Process for org units.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    async findFilteredProcess(@Request() req): Promise<FilteredProcessDto[]> {
        return await this.filteredProcessService.findFilteredProcess(req.user.accountId);
    }

    @ApiOperation({ summary: 'Creates filtered Process for given org unit.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Post()
    async createFilteredProcess(@Request() req, @Body() dto: FilteredProcessDto): Promise<FilteredProcessDto> {
        return await this.filteredProcessService.createFilteredProcess(req.user.accountId, dto);
    }

    @ApiOperation({ summary: 'Deletes filtered Process for given id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.filteredProcessService.delete(id);
    }
}
