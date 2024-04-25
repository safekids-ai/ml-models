import { Body, Controller, Put, Query, Request, UseGuards } from '@nestjs/common';
import { KidRequestService } from './kid-request.service';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { KidAccessRequestsDto, KidRequestDto } from './domain/kid-request-dto';

@ApiTags('Kid request')
@Controller('v2/kid-request')
export class KidRequestController {
    constructor(private readonly kidRequestService: KidRequestService) {}

    @ApiOperation({ summary: 'Update kid access for particular website and add url to allowed list.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Put()
    async updateAccess(@Request() req, @Query('access-code') token: string): Promise<{ message: string }> {
        return await this.kidRequestService.update(req.user.accountId, token);
    }

    @ApiOperation({ summary: 'Update kid access limit.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Put('/access-update')
    async updateAccessLimit(@Query('access-request') token: string): Promise<{ message: string }> {
        return await this.kidRequestService.clearAccessLimit(token);
    }

    @ApiOperation({ summary: 'Update access requests and add url to allowed list.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Put('/bulk')
    async updateAccessRequests(@Request() req, @Body() accessRequests: KidAccessRequestsDto): Promise<KidRequestDto[]> {
        return await this.kidRequestService.updateAccessRequests(req.user.accountId, accessRequests);
    }
}
