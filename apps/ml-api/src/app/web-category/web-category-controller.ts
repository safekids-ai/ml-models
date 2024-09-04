import {
  BadRequestException,
  Body,
  Controller, ExecutionContext,
  Get, Injectable,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {WebCategoryService} from "./web-category.services";
import {GoogleOauthGuard} from "../auth/guard/google-oauth.guard";
import {WebCategoryType, WebMeta} from "@safekids-ai/web-categorize";
import {CacheInterceptor, CacheTTL} from "@nestjs/cache-manager";
import {LoggingService} from "../logger/logging.service";
import {WebCategory} from "./entities/web-category-entity";
import {CreateWebCategoryDto} from "./dto/web-category.dto";
import {ConfigService} from "@nestjs/config";
import {WebCategoryProviderType} from "../../../../../libs/web-categorize/src/lib/web-category-types";

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const meta = request.body;

    if (!meta || !meta.url) {
      return undefined;
    }

    return `wc:${meta.url}`;
  }
}

@Controller()
@ApiTags('Web Categorize')
export class WebCategoryController {
  apiProvider: string

  constructor(private readonly webCategoryService: WebCategoryService,
              private readonly config: ConfigService,
              private readonly log: LoggingService) {
  }

  @ApiOperation({summary: 'Gets the category of a website.'})
  @ApiBearerAuth()
  @UseInterceptors(CustomCacheInterceptor)
  @CacheTTL(60000)
  // @UseGuards(GoogleOauthGuard)
  @Post('v2/web-category/categorize')
  async getCategory(@Body() createCategoryDto: CreateWebCategoryDto): Promise<WebCategoryType[]> {
    return await this.webCategoryService.categorize(createCategoryDto.url, createCategoryDto.meta)
  }

  @ApiBearerAuth()
//  @UseGuards(GoogleOauthGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000)
  @Get('v2/web-category/meta')
  getMeta(@Query('url') url: string): Promise<WebMeta> {
    return this.webCategoryService.getMeta(url);
  }
}
