import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ChromeExtensionAuthGuard } from '../auth/guard/chrome-extension-auth.guard';
import { EmailEventService } from '../email-event/email-event.service';
import { UserOptInService } from '../user-opt-in/user-opt-in.service';
import { UserOptIn } from '../user-opt-in/entities/user-opt-in.entity';
import { CreateUserOptInDto } from '../user-opt-in/dto/create-opt-in.dto';
import { EmailEventDto } from '../email-event/dto/email-event.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Email extension')
@Controller('v2/extension/email')
export class EmailExtensionController {
    constructor(private readonly emailEventService: EmailEventService, private readonly userOptInService: UserOptInService) {}

    @ApiOperation({ summary: 'Send email to given address.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Post('api/events')
    saveEmailEvent(@Request() req, @Body() emailEventDto: EmailEventDto) {
        emailEventDto.accountId = req.user.accountId;
        emailEventDto.userId = req.user.userId;
        emailEventDto.googleUserId = req.user.googleUserId;
        emailEventDto.userDeviceLinkId = req.user.deviceLinkId;
        return this.emailEventService.sendMessage(emailEventDto);
    }

    @ApiOperation({ summary: 'Returns user opt in by given id.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Get('api/users/optin')
    async getUserOptIn(@Request() req): Promise<UserOptIn> {
        return await this.userOptInService.findOneById(req.user.userId);
    }

    @ApiOperation({ summary: 'Creates user opt in by given id.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Post('api/users/optin')
    async saveUserOptIn(@Request() req, @Body() optInDto: CreateUserOptInDto): Promise<UserOptIn> {
        optInDto.userId = req.user.userId;
        return await this.userOptInService.upsert(optInDto);
    }
}
