import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { UrlDto } from '../filtered-url/dto/filtered-url.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Default urls')
@Controller('v2/webfilter/urls')
export class UrlController {
    constructor(private readonly service: UrlService) {}

    @ApiOperation({ summary: 'Returns all urls by account id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    findAll(@Request() req): Promise<UrlDto[]> {
        return this.service.findAll(req.user.accountId);
    }
}
