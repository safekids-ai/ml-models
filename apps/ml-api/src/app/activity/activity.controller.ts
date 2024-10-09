import {Body, Controller, Get, HttpStatus, Post, Query, Request, Res, UseGuards} from '@nestjs/common';
import {ActivityService} from './activity.service';
import type {ActivityCreationAttributes} from './entities/activity.entity';
import {GoogleOauthGuard} from '../auth/guard/google-oauth.guard';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Activity')
@Controller('v2/webusage/activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {
  }

  @ApiOperation({summary: 'Creates an activity.'})
  @Post()
  create(@Body() createActivityDto: ActivityCreationAttributes) {
    return this.activityService.create(createActivityDto);
  }

  @ApiOperation({summary: 'Returns messages for current logged in user.'})
  @ApiBearerAuth()
  @UseGuards(GoogleOauthGuard)
  @Get('messages')
  findAllByTeacherId(@Request() req, @Query() query) {
    return this.activityService.findAllByTeacherId(query.page, query.size, req.user.accountId, req.user.userId, query.start, query.end);
  }

  @ApiOperation({summary: 'Searches students by first name, last name or email.'})
  @ApiBearerAuth()
  @UseGuards(GoogleOauthGuard)
  @Get('search/students')
  searchStudents(@Request() req, @Query() query) {
    return this.activityService.searchStudents(query.page, query.size, query.keyword, query.timezone, req.user.accountId);
  }

  @ApiOperation({summary: 'Searches students by first name, last name or DISTINCT email.'})
  @ApiBearerAuth()
  @UseGuards(GoogleOauthGuard)
  @Get('search/autocomplete')
  autocompleteSearch(@Request() req, @Query() query) {
    return this.activityService.autocompleteSearch(query.page, query.size, query.keyword, req.user.accountId);
  }

  @ApiOperation({summary: 'Downloads students activity including first name, last name, email, url etc.'})
  @ApiBearerAuth()
  @UseGuards(GoogleOauthGuard)
  @Get('download/activity')
  async downloadActivity(@Request() req, @Query() query, @Res() res) {
    const result = await this.activityService.downloadActivity(query.keyword, query.timezone, req.user.accountId);
    if (result && result.length > 0) {
      return res.attachment('activity.csv').send(result);
    }
    return res.status(HttpStatus.NO_CONTENT).json({message: 'No activity found for this search criteria.'});
  }
}
