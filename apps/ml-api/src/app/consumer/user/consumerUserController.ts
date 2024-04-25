import { Body, Controller, Delete, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ConsumerUserService } from './consumer-user.service';
import { GoogleOauthGuard } from '../../auth/guard/google-oauth.guard';
import { ParentConsentDto } from '../parent-consent/dto/parent-consent.dto';
import { ParentConsentService } from '../parent-consent/parent-consent.service';
import { KidDto } from './dto/kid.dto';
import { UserRoles } from '../../user/user.roles';
import { KidsEmailsValidator } from './validation/kids-emails-validator.service';
import { UserYearValidator } from './validation/user-year-validator';
import { UserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Consumer -> User')
@Controller('v2/consumer/user')
export class ConsumerUserController {
    constructor(private readonly userService: ConsumerUserService, private readonly parentConsentService: ParentConsentService) {}

    @ApiOperation({ summary: 'Synchronize kids with database for current account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard, KidsEmailsValidator, UserYearValidator)
    @Post()
    public async syncKids(@Request() req, @Body() dto: KidDto[]): Promise<void> {
        await this.userService.syncKids(req.user.userId, req.user.accountId, dto);
    }

    @ApiOperation({ summary: 'Returns all kids for current account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    public async getKids(@Request() req): Promise<UserDto[]> {
        return await this.userService.findUsersByAccountId(req.user.accountId, UserRoles.KID);
    }

    @ApiOperation({ summary: 'Returns all kids for current consumer account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('kids')
    public async getConsumerKids(@Request() req, @Query() query): Promise<UserDto[]> {
        return await this.userService.findConsumerKids(req.user.accountId, query.start, query.end);
    }

    @ApiOperation({ summary: 'Creates parent consent for current account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Post('parent-consent')
    public async recordParentConsent(@Request() req, @Body() dto: ParentConsentDto): Promise<void> {
        await this.parentConsentService.create(req.user.userId, req.user.accountId, dto);
    }

    @ApiOperation({ summary: 'TEST API - Delete account and its dependencies.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Delete('delete-account')
    public async deleteAccount(@Request() req, @Body() dto: { email: string }): Promise<void> {
        await this.userService.deleteAccount(req.user.userId, req.user.accountId, dto);
    }
}
