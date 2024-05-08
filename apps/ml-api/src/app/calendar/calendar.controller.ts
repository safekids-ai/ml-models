import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Non school days')
@Controller('v2/accounts/nonschooldays')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {}

    @ApiOperation({ summary: 'Creates non school days configuration.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Post()
    create(@Request() req, @Body() createCalendarDto: CreateCalendarDto) {
        createCalendarDto.accountId = req.user.accountId;

        return this.calendarService.create(createCalendarDto);
    }

    @ApiOperation({ summary: 'Returns all non school days configuration by account id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    findAllByAccountId(@Request() req) {
        return this.calendarService.findAll(req.user.accountId);
    }

    @ApiOperation({ summary: 'Returns non school days configuration by id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.calendarService.findOne(id);
    }

    @ApiOperation({ summary: 'Updates non school days configuration by account id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Put()
    upsert(@Request() req, @Body() createCalendarDto: CreateCalendarDto) {
        createCalendarDto.accountId = req.user.accountId;
        return this.calendarService.upsert(createCalendarDto);
    }

    @ApiOperation({ summary: 'Creates non school days configuration in bulk.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Post('bulk')
    bulkUpsert(@Request() req, @Body() createCalendarDtos: CreateCalendarDto[]) {
        return this.calendarService.bulkUpsert(req.user.accountId, createCalendarDtos);
    }
}
