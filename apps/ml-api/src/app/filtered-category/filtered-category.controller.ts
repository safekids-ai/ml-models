import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { FilteredCategoryService } from './filtered-category.service';
import { FilteredCategoryDto } from './dto/filtered-category.dto';
import { OrgUnitsValidator } from './validation/org-units-validator';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Filtered categories')
@Controller('v2/webfilter/filteredcategories')
export class FilteredCategoryController {
    constructor(private readonly filteredCategoryService: FilteredCategoryService) {}

    @ApiOperation({ summary: 'Deletes existing and create latest filtered categories for provided org unit.' })
    @ApiBearerAuth()
    @Post('orgunits')
    @UseGuards(GoogleOauthGuard, OrgUnitsValidator)
    saveFilteredCategories(@Body() dto: FilteredCategoryDto, @Request() req) {
        return this.filteredCategoryService.saveFilteredCategories(dto, req.user.accountId);
    }
}
