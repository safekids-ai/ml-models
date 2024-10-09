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
import {CacheInterceptor, CacheTTL} from "@nestjs/cache-manager";
import {LoggingService} from "../logger/logging.service";
import {WebCategoryUrl} from "apps/ml-api/src/app/web-category/entities/web-category-url-entity";
import {GetWebCategoryDto, WebCategoryUrlResponseDto} from "apps/ml-api/src/app/web-category/dto/web-category-url.dto";
import {ConfigService} from "@nestjs/config";
import {WebCategoryType, WebMeta} from "@safekids-ai/web-category-types";
import {ChromeExtensionOpenAuthGuard} from "../auth/guard/chrome-extension-auth-open.guard";


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
  //@UseInterceptors(CustomCacheInterceptor)
  //@CacheTTL(1)
  @UseGuards(ChromeExtensionOpenAuthGuard)
  @Post('v2/web-category')
  async getCategory(@Body() categoryDto: GetWebCategoryDto): Promise<WebCategoryUrlResponseDto> {
    const resp = await this.webCategoryService.categorize(categoryDto.url, categoryDto.meta)
    this.log.debug("GetCategoryAPI:", categoryDto, resp);
    return resp;
  }

  @ApiBearerAuth()
  @UseInterceptors(CacheInterceptor)
  @UseGuards(ChromeExtensionOpenAuthGuard)
  @CacheTTL(60000)
  @Get('v2/web-category/meta')
  getMeta(@Query('url') url: string): Promise<WebMeta> {
    return this.webCategoryService.getMeta(url);
  }
}
