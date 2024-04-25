import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { NonSchoolDaysConfigService } from './non-school-days-config.service';
import type { NonSchoolDaysConfigCreationAttributes } from './entities/non-school-days-config.entity';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Non school days')
@Controller('/v2/config/accounts/nonschooldays')
export class NonSchoolDaysConfigController {
    constructor(private readonly nonSchoolDaysConfigService: NonSchoolDaysConfigService) {}

    @ApiOperation({ summary: 'Returns non school days configuration by account id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    findByAccountId(@Request() req) {
        return this.nonSchoolDaysConfigService.findByAccountId(req.user.accountId);
    }

    @ApiOperation({ summary: 'Updates non school days configuration by account id.' })
    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(GoogleOauthGuard)
    update(@Request() req, @Param('id') id: string, @Body() updateNonSchoolDaysConfigDto: Partial<NonSchoolDaysConfigCreationAttributes>) {
        updateNonSchoolDaysConfigDto.accountId = id;
        return this.nonSchoolDaysConfigService.update(req.user.accountId, updateNonSchoolDaysConfigDto);
    }

    @ApiOperation({ summary: 'Updates or creates non school days configuration by account id.' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(GoogleOauthGuard)
    upsert(@Request() req, @Body() upsertNonSchoolDaysConfigDto: NonSchoolDaysConfigCreationAttributes) {
        upsertNonSchoolDaysConfigDto.accountId = req.user.accountId;
        return this.nonSchoolDaysConfigService.upsert(upsertNonSchoolDaysConfigDto);
    }

    @ApiOperation({ summary: 'Deletes non school days configuration by account id.' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(GoogleOauthGuard)
    remove(@Request() req, @Param('id') id: string) {
        return this.nonSchoolDaysConfigService.remove(req.user.accountId);
    }
}
