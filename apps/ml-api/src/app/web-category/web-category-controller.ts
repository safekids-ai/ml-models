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
// import {CacheInterceptor, CacheTTL} from "@nestjs/cache-manager";
import {LoggingService} from "../logger/logging.service";
import {GetWebCategoryDto, WebCategoryUrlResponseDto} from "./dto/web-category-url.dto";
import {ConfigService} from "@nestjs/config";
import {HTMLWebData} from "@safekids-ai/web-category-types";
import {ChromeExtensionOpenAuthGuard} from "../auth/guard/chrome-extension-auth-open.guard";
import {StringUtils} from "../utils/stringUtils";


// @Injectable()
// export class CustomCacheInterceptor extends CacheInterceptor {
//   trackBy(context: ExecutionContext): string | undefined {
//     const request = context.switchToHttp().getRequest();
//     const meta = request.body;
//
//     if (!meta || !meta.url) {
//       return undefined;
//     }
//
//     return `wc:${meta.url}`;
//   }
// }

@Controller()
@ApiTags('Web Categorize')
export class WebCategoryController {
  apiProvider: string

  constructor(private readonly webCategoryService: WebCategoryService,
              private readonly config: ConfigService,
              private readonly log: LoggingService) {
  }

  @ApiOperation({summary: 'Gets the category of a website based on url'})
  @ApiBearerAuth()
  //@UseInterceptors(CustomCacheInterceptor)
  //@CacheTTL(1)
  @UseGuards(ChromeExtensionOpenAuthGuard)
  @Post('v2/web-category')
  async getCategory(@Body() categoryDto: GetWebCategoryDto): Promise<WebCategoryUrlResponseDto> {
    const htmlData = categoryDto?.htmlMeta;
    this.log.debug(`[GetCategoryAPI]-Request: url:${categoryDto.url}
      description: ${htmlData?.description}
      rating: ${htmlData?.rating}
      htmlData:${StringUtils.ltrim(htmlData?.htmlText, 50)}`);

    const resp = await this.webCategoryService.categorize(categoryDto.url, categoryDto.htmlMeta)
    this.log.debug(`[GetCategoryAPI]-Response: url:${categoryDto.url} response:`, resp);
    return resp;
  }

  @ApiOperation({summary: 'Gets the category of a website based on text'})
  @ApiBearerAuth()
  //@UseInterceptors(CustomCacheInterceptor)
  //@CacheTTL(1)
  @UseGuards(ChromeExtensionOpenAuthGuard)
  @Post('v2/web-category-text')
  async getCategoryText(@Body() text: string): Promise<WebCategoryUrlResponseDto> {
    const resp = await this.webCategoryService.categorizeText(text)
    this.log.debug("GetCategoryTextAPI:", text, resp);
    return resp;
  }

  @ApiBearerAuth()
  // @UseInterceptors(CacheInterceptor)
  @UseGuards(ChromeExtensionOpenAuthGuard)
  // @CacheTTL(60000)
  @Get('v2/web-category/html')
  getMeta(@Query('url') url: string): Promise<HTMLWebData> {
    return this.webCategoryService.getHtmlData(url);
  }
}
