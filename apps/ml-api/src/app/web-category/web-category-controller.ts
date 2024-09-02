import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {WebCategoryService} from "./web-category.services";
import {GoogleOauthGuard} from "../auth/guard/google-oauth.guard";
import {WebCategoryType, WebMeta} from "@safekids-ai/web-categorize";
import {CacheInterceptor, CacheTTL} from "@nestjs/cache-manager";
import {LoggingService} from "../logger/logging.service";

@Controller()
@ApiTags('Web Categorize')
export class WebCategoryController {
  constructor(private readonly webCategoryService: WebCategoryService,
              private readonly log: LoggingService) {}

  @ApiBearerAuth()
//  @UseGuards(GoogleOauthGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(7*24*3600*1000)
  @Get('v2/web-category/categorize')
  getCategory(@Query('url') url?: string, @Query('text') text?: string): Promise<WebCategoryType[]> {
    if (!url && !text) {
      throw new BadRequestException('Provide either a URL or a text website description');
    }
    return this.webCategoryService.categorize(url, text);
  }

  @ApiBearerAuth()
//  @UseGuards(GoogleOauthGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(7*24*3600*1000)
  @Get('v2/web-category/meta')
  getMeta(@Query('url') url: string): Promise<WebMeta> {
    return this.webCategoryService.getMeta(url);
  }
}
