import { KidRequestTypes } from './../kid-request/domain/kid-request-dto';
import { Body, Controller, Get, InternalServerErrorException, Patch, Post, Put, Query, Request, Res, UseGuards } from '@nestjs/common';
import { UserDeviceLinkService } from '../user-device-link/user-device-link.service';
import { ChromeExtensionAuthGuard } from '../auth/guard/chrome-extension-auth.guard';
import { ActivityService } from '../activity/activity.service';
import { ChromeService } from './chrome.service';
import { CreateFeedbackDto } from '../feedback/dto/create-feedback.dto';
import { CreateWebTimeDto } from '../web-time/dto/create-web-time.dto';
import { NonSchoolDevicesConfigService } from '../non-school-devices-config/non-school-devices-config.service';
import { CategoryDTO } from '../filtered-category/dto/filtered-category.dto';
import { CategoryTimeDto } from './domain/category.time.dto';
import { OnboardStatusDto } from './domain/onboard.status.dto';
import { KidRequestDto } from '../kid-request/domain/kid-request-dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LimitAccessDTO } from './domain/limit_access.dto';
import { KidConfigDTO } from '../kid-config/dto/kid-config.dto';

@ApiTags('Consumer extension')
@Controller('v2/chrome/consumer')
export class ConsumerController {
    constructor(
        private readonly userDeviceService: UserDeviceLinkService,
        private readonly activityService: ActivityService,
        private readonly chromeService: ChromeService,
        private readonly nonSchoolDevicesConfigService: NonSchoolDevicesConfigService
    ) {}

    @ApiOperation({ summary: 'Returns kid configurations including urls, categories, interception categories and offTime etc.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Get('api/webfilter/configuration')
    getWebFilterConfiguration(@Request() req) {
      return this.chromeService.getWebFilterConfiguration(req.user.accountId, req.user.userId, req.user.orgUnitId, req.user.deviceLinkId);
    }

    @ApiOperation({ summary: 'Returns kid non school days configurations.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Get('api/settings/calendars/checkholiday')
    checkHoliday(@Request() req, @Query() query) {
        return this.chromeService.checkHoliday(req.user.accountId, query.date);
    }

    @ApiOperation({ summary: 'Returns kid interception times configurations.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Get('api/settings/interceptiontimes')
    getInterceptTimes(@Request() req, @Query() query) {
        return this.chromeService.getInterceptTimes(req.user.accountId);
    }

    @ApiOperation({ summary: 'Updates kid access for extension use.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Patch('api/users/accesslimited')
    updateAccessLimit(@Request() req, @Body() dto: LimitAccessDTO) {
        return this.chromeService.updateAccessLimit(req.user.userId, req.user.accountId, dto);
    }

    @ApiOperation({ summary: 'Returns kid access for extension use.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Get('api/users/accesslimited')
    getAccessLimit(@Request() req) {
        return this.chromeService.isAccessLimited(req.user.accountId, req.user.userId);
    }

    @ApiOperation({ summary: 'Creates feedback for kid.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Post('api/webusage/activities/feedback')
    saveFeedback(@Request() req, @Body() feedback: CreateFeedbackDto) {
        return this.chromeService.saveFeedback(req.user.accountId, req.user.deviceLinkId, feedback);
    }

    @ApiOperation({ summary: 'Creates web times for kid like when kids are online/offline.' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Post('api/webusage/webtime')
    saveWebTime(@Request() req, @Body() webTime: CreateWebTimeDto) {
        webTime.accountId = req.user.accountId;
        webTime.userId = req.user.userId;
        webTime.userDeviceLinkId = req.user.deviceLinkId;
        return this.chromeService.saveWebTime(webTime);
    }

    @ApiOperation({ summary: 'Returns all parents for kid' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Get('api/consumer/home/parent')
    getTeachers(@Request() req) {
        return this.chromeService.findParent(req.user.accountId);
    }

    @ApiOperation({ summary: 'Returns extension use status for kid' })
    @ApiBearerAuth()
    @Get('api/settings/extension/status')
    @UseGuards(ChromeExtensionAuthGuard)
    async checkStatus(@Request() req): Promise<{ status: boolean }> {
        try {
            return await this.nonSchoolDevicesConfigService.checkStatus(req.user.accountId, req.user.email);
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    @ApiOperation({ summary: 'Updates categories for specific kid' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Put('categories')
    async updateCategory(@Request() req, @Body() categoryDTO: CategoryDTO): Promise<void> {
        await this.chromeService.updateCategory(req.user.accountId, req.user.orgUnitId, categoryDTO);
    }

    @ApiOperation({ summary: 'Updates categories and time for specific kid' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Put('categories-time')
    async updateCategoryTimeAndConfig(@Request() req, @Body() categoryTime: CategoryTimeDto): Promise<void> {
        await this.chromeService.updateCategoryTimeAndConfig(req.user.accountId, req.user.orgUnitId, req.user.userId, categoryTime);
    }

    @ApiOperation({ summary: 'Updates on board status for specific kid' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Put('onboard-status')
    async saveOnBoardingStatus(@Request() req, @Body() onboardStatusDto: OnboardStatusDto): Promise<void> {
        await this.chromeService.updateOnBoardingStatus(req.user.userId, onboardStatusDto);
    }

    @ApiOperation({ summary: 'Returns on board status for specific kid' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Get('onboard-status')
    async getOnBoardingStatus(@Request() req): Promise<KidConfigDTO> {
        return await this.chromeService.getOnBoardingStatus(req.user.userId, req.user.accountId);
    }

    @ApiOperation({ summary: 'Sends inform email about category to parent for specific kid' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Post('inform-parent')
    async informParent(@Request() req, @Body() informParentDTO: KidRequestDto): Promise<void> {
        // check ai (true/false) and set type
        informParentDTO.ai ? (informParentDTO.type = KidRequestTypes.INFORM_AI) : (informParentDTO.type = KidRequestTypes.INFORM);
        informParentDTO.userDeviceLinkId = req.user.deviceLinkId;
        await this.chromeService.saveKidRequests(req.user.userId, req.user.accountId, req.user.orgUnitId, informParentDTO);
    }

    @ApiOperation({ summary: 'Sends ask email for enabling category to parent for specific kid' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Post('ask-parent')
    async askParent(@Request() req, @Body() informParentDTO: KidRequestDto): Promise<void> {
        informParentDTO.type = KidRequestTypes.ASK;
        informParentDTO.userDeviceLinkId = req.user.deviceLinkId;
        await this.chromeService.saveKidRequests(req.user.userId, req.user.accountId, req.user.orgUnitId, informParentDTO);
    }

    @ApiOperation({ summary: 'Updates kid configuration and sends email to parent informing kid uninstalled extension' })
    @ApiBearerAuth()
    @Get('reportAppUninstall')
    async updateExtensionStatus(@Query() query, @Res() res): Promise<void> {
        return await this.chromeService.updateExtensionStatus(query.code, res);
    }

    @ApiOperation({ summary: 'Schedule extension uninstall for specific kid email for parent ' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Post('ext-uninstall-inform')
    async extUninstallInform(@Request() req): Promise<void> {
        await this.chromeService.extUninstallInform(req.user.userId, req.user.accountId);
    }

    @ApiOperation({ summary: 'Update extension status to installed' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Post('ext-uninstall-cancel')
    async extUninstallCancel(@Request() req): Promise<void> {
        await this.chromeService.extUninstallCancel(req.user.userId);
    }

    @ApiOperation({ summary: 'Inform parent that kid triggered AI  PRR level 3 category' })
    @ApiBearerAuth()
    @UseGuards(ChromeExtensionAuthGuard)
    @Post('inform-ai-crisis')
    async informAICrisis(@Request() req, @Body() informParentDTO: KidRequestDto): Promise<void> {
        await this.chromeService.informAICrisis(req.user.userId, req.user.accountId, informParentDTO);
    }
}
