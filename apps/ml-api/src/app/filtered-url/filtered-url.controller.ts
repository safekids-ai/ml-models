import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { FilteredUrlService } from './filtered-url.service';
import type { FilteredUrlCreationAttributes } from './entities/filtered-url.entity';
import { OrgUnitsValidator } from '../filtered-category/validation/org-units-validator';
import { FilteredUrlDto } from './dto/filtered-url.dto';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Filtered urls')
@Controller('v2/webfilter/filteredurls')
export class FilteredUrlController {
    constructor(private readonly filteredUrlService: FilteredUrlService) {}

    @ApiOperation({ summary: 'Deletes existing and create latest filtered urls for provided org unit.' })
    @ApiBearerAuth()
    @Post('orgunits')
    @UseGuards(GoogleOauthGuard, OrgUnitsValidator)
    saveFilteredUrls(@Body() dto: FilteredUrlDto, @Request() req) {
        return this.filteredUrlService.saveFilteredUrls(dto, req.user.accountId);
    }

    @ApiOperation({ summary: 'Updates existing filtered urls for provided org unit.' })
    @ApiBearerAuth()
    @Post('accounts')
    @UseGuards(GoogleOauthGuard)
    saveFilteredUrlsForAccount(@Body() dto: FilteredUrlCreationAttributes, @Request() req) {
        dto.accountId = req.user.accountId;
        return this.filteredUrlService.updateUrlForAccount(dto);
    }
}
