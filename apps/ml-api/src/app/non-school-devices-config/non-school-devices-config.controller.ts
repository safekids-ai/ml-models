import { Body, Controller, Get, ParseBoolPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { NonSchoolDevicesConfigService } from './non-school-devices-config.service';
import { IsAdminGuard } from '../auth/guard/is-admin-guard';
import { ExemptEmailsDto } from './dto/exempt-emails.dto';
import { ExemptedEmailsValidator } from './validation/exempted-emails-validator';
import { ChromeExtensionAuthGuard } from '../auth/guard/chrome-extension-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Non school devices')
@Controller('/v2/config/accounts/non-school-devices')
export class NonSchoolDevicesConfigController {
    constructor(private readonly nonSchoolDevicesConfigService: NonSchoolDevicesConfigService) {}

    @ApiOperation({ summary: 'Returns extension status for given account.' })
    @ApiBearerAuth()
    @UseGuards(IsAdminGuard)
    @Get()
    findExtensionStatus(@Request() req) {
        return this.nonSchoolDevicesConfigService.findExtensionStatus(req.user.accountId);
    }

    @ApiOperation({ summary: 'Updates extension status for given account.' })
    @ApiBearerAuth()
    @Patch()
    @UseGuards(IsAdminGuard)
    async updateExtensionStatus(@Request() req, @Query('enableExtension', ParseBoolPipe) enableExtension: boolean) {
        await this.nonSchoolDevicesConfigService.updateExtensionStatus(req.user.accountId, enableExtension);
    }

    @ApiOperation({ summary: 'Updates exempted emails for given account.' })
    @ApiBearerAuth()
    @Patch('exempt-emails')
    @UseGuards(IsAdminGuard, ExemptedEmailsValidator)
    async updateExemptedEmails(@Request() req, @Body() dto: ExemptEmailsDto) {
        await this.nonSchoolDevicesConfigService.updateExemptedEmails(req.user.accountId, dto);
    }

    @ApiOperation({ summary: 'Check extension status for given account and user email.' })
    @ApiBearerAuth()
    @Post('status')
    @UseGuards(ChromeExtensionAuthGuard)
    async checkStatus(@Request() req): Promise<{ status: boolean }> {
        return await this.nonSchoolDevicesConfigService.checkStatus(req.user.accountId, req.user.email);
    }
}
