import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { OrgUnitService } from './org-unit.service';
import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
import { OrgUnitDto } from './dto/org-unit.dto';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { OrgUnitCategoryDto } from './dto/org-unit-category-dto';
import { OrgUnitUrlDTO } from './dto/org-unit-url-dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Organization unit')
@Controller('v2/directory/orgunits')
export class OrgUnitController {
    constructor(private readonly orgUnitService: OrgUnitService) {}

    @ApiOperation({ summary: 'Returns filtered categories by account id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('filtered-categories')
    findFilteredCategories(@Request() req): Promise<OrgUnitCategoryDto[]> {
        return this.orgUnitService.findFilteredCategories(req.user.accountId);
    }

    @ApiOperation({ summary: 'Updates filtered categories by given org unit ids.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Put('filtered-categories')
    async saveFilteredCategories(@Request() req, @Body() dto: OrgUnitCategoryDto[]): Promise<void> {
        await this.orgUnitService.updateFilteredCategories(req.user.accountId, dto);
    }

    @ApiOperation({ summary: 'Returns filtered urls for org units.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('filtered-urls')
    async findFilteredUrls(@Request() req): Promise<OrgUnitUrlDTO[]> {
        return await this.orgUnitService.findFilteredUrls(req.user.accountId);
    }

    @ApiOperation({ summary: 'Creates filtered urls for given org unit.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Post('filtered-urls')
    async createFilteredUrls(@Request() req, @Body() dto: OrgUnitUrlDTO): Promise<OrgUnitUrlDTO> {
        return await this.orgUnitService.createFilteredUrls(req.user.accountId, dto);
    }

    @ApiOperation({ summary: 'Deletes filtered url for given id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Delete('filtered-urls/:id')
    async deleteFilteredUrl(@Param('id') id: string): Promise<void> {
        await this.orgUnitService.deleteFilteredUrl(id);
    }

    @ApiOperation({ summary: 'Creates org unit.' })
    @ApiBearerAuth()
    @Post()
    create(@Body() createOrgUnitDto: CreateOrgUnitDto) {
        return this.orgUnitService.create(createOrgUnitDto);
    }

    @ApiOperation({ summary: 'Returns all org units by account id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    findAll(@Request() req): Promise<OrgUnitDto[]> {
        return this.orgUnitService.findAll(req.user.accountId);
    }

    @ApiOperation({ summary: 'Returns single org unit by given id.' })
    @ApiBearerAuth()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orgUnitService.findOne(id);
    }
}
