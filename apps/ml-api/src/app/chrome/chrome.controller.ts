import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  Query,
  Request,
  Response,
  UseGuards
} from '@nestjs/common';
import {UserDeviceLinkService} from '../user-device-link/user-device-link.service';
import {ChromeExtensionAuthGuard} from '../auth/guard/chrome-extension-auth.guard';
import {ActivityService} from '../activity/activity.service';
import {PrrActivityDto, PrrInformVisitDto} from './dto/prr.activity.dto';
import {ChromeService} from './chrome.service';
import {CreateFeedbackDto} from '../feedback/dto/create-feedback.dto';
import {CreateWebTimeDto} from '../web-time/dto/create-web-time.dto';
import {NonSchoolDevicesConfigService} from '../non-school-devices-config/non-school-devices-config.service';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {InformPrrVisitsService} from '../inform-prr-visits/inform-prr-visits.service';
import {InformPrrVisitsMessages} from '../inform-prr-visits/inform-prr-visits.messages';
import {UserTokenDTO} from '../auth/auth.dto';
import {PrrActivityRequest} from './dto/prr.activity.request';

@ApiTags('School extension')
@Controller('v2/chrome')
export class ChromeController {
  constructor(
    private readonly userDeviceService: UserDeviceLinkService,
    private readonly activityService: ActivityService,
    private readonly informPrrVisitsService: InformPrrVisitsService,
    private readonly chromeService: ChromeService,
    private readonly nonSchoolDevicesConfigService: NonSchoolDevicesConfigService
  ) {
  }

  @ApiOperation({summary: 'Save kid activity and send sms if kid triggers PRR level 3.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Post('api/webusage/activities')
  async savePrr(@Request() req, @Response() res, @Body() prrDto: PrrActivityDto) {
    const activities = [prrDto];

    return this.savePrrBulk(req, res, activities);
  }

  @ApiOperation({summary: 'Save kid activities in bulk.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Post('api/webusage/activities/bulk')
  async savePrrBulk(@Request() req, @Response() res, @Body() activities: PrrActivityDto[]) {
    const tokenData: UserTokenDTO = {accountId: '', deviceId: '', deviceLinkId: '', email: '', userId: ''};
    tokenData.accountId = req.user.accountId;
    tokenData.userId = req.user.userId;
    tokenData.userDeviceLinkId = req.user.deviceLinkId;
    tokenData.deviceId = req.user.accountId;

    const prrActivityRequest: PrrActivityRequest = {type: 'ACTIVITY', activities, token: tokenData};
    this.activityService.sendMessage(prrActivityRequest);

    return res.sendStatus(HttpStatus.CREATED);
  }

  @ApiOperation({summary: 'Save kid web visits.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Post(['api/webusage/visits', 'api/webusage/prr-events/inform/visits'])
  saveInformPrrVisits(@Request() req, @Body() prrDto: PrrInformVisitDto) {
    prrDto.userId = req.user.userId;
    prrDto.accountId = req.user.accountId;

    this.informPrrVisitsService.sendMessage(prrDto);

    return {status: InformPrrVisitsMessages.visitsSaved()};
  }

  @ApiOperation({summary: 'Returns kid configurations including urls, categories and interception categories.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Get('api/webfilter/configuration')
  getWebFilterConfiguration(@Request() req) {
    const result = this.chromeService.getWebFilterConfiguration(req.user.accountId, req.user.userId, req.user.orgUnitId);
    return result;
  }

  @ApiOperation({summary: 'Returns kid non school days configurations.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Get('api/settings/calendars/checkholiday')
  checkHoliday(@Request() req, @Query() query) {
    return this.chromeService.checkHoliday(req.user.accountId, query.date);
  }

  @ApiOperation({summary: 'Returns kid interception times configurations.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Get('api/settings/interceptiontimes')
  getInterceptTimes(@Request() req, @Query() query) {
    return this.chromeService.getInterceptTimes(req.user.accountId);
  }

  @ApiOperation({summary: 'Updates kid access for extension use.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Patch('api/users/accesslimited')
  updateAccessLimit(@Request() req, @Query() query) {
    return this.chromeService.updateAccessLimit(req.user.userId, query.limitaccess);
  }

  @ApiOperation({summary: 'Returns kid access for extension use.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Get('api/users/accesslimited')
  getAccessLimit(@Request() req) {
    return this.chromeService.isAccessLimited(req.user.accountId, req.user.userId);
  }

  @ApiOperation({summary: 'Creates feedback for kid.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Post('api/webusage/activities/feedback')
  saveFeedback(@Request() req, @Body() feedback: CreateFeedbackDto) {
    return this.chromeService.saveFeedback(req.user.accountId, req.user.deviceLinkId, feedback);
  }

  @ApiOperation({summary: 'Creates web times for kid like when kids are online/offline.'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Post('api/webusage/webtime')
  saveWebTime(@Request() req, @Body() webTime: CreateWebTimeDto) {
    webTime.accountId = req.user.accountId;
    webTime.userId = req.user.userId;
    webTime.userDeviceLinkId = req.user.deviceLinkId;
    return this.chromeService.saveWebTime(webTime);
  }

  @ApiOperation({summary: 'Returns teachers for kid'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Get('api/roster/teachers')
  getTeachers(@Request() req) {
    return this.chromeService.findTeachers(req.user.accountId);
  }

  @ApiOperation({summary: 'Returns extension use status for kid'})
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

  @ApiOperation({summary: 'Returns all parents for kid'})
  @ApiBearerAuth()
  @UseGuards(ChromeExtensionAuthGuard)
  @Get('api/consumer/home/parent')
  getParents(@Request() req) {
    return this.chromeService.findParents(req.user.accountId);
  }
}
