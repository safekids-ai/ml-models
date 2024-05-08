import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DefaultCategoryService } from './default-category.service';
import { CategoryDto } from './dto/category.dto';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Default categories')
@Controller('v2/webfilter/categories')
export class CategoryController {
    constructor(private readonly categoryService: DefaultCategoryService) {}

    @ApiOperation({ summary: 'Returns all default categories in ascending order by name.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    findAll(@Request() req): Promise<CategoryDto[]> {
        return this.categoryService.findAll();
    }
}
