import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { InterceptionTimeService } from './interception-time.service';
import type { InterceptionTimeCreationAttributes } from './entities/interception-time.entity';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Interception times')
@Controller('v2/accounts/interception-times')
export class InterceptionTimeController {
    constructor(private readonly interceptionTimeService: InterceptionTimeService) {}

    @ApiOperation({ summary: 'Creates interception times for given account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Post()
    create(@Request() req, @Body() createInterceptionTimeDto: InterceptionTimeCreationAttributes) {
        req.user.accountId;
        createInterceptionTimeDto.accountId = req.user.accountId;
        return this.interceptionTimeService.upsert(createInterceptionTimeDto);
    }

    @ApiOperation({ summary: 'Returns all interception times for given account.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get()
    findAll(@Request() req) {
        return this.interceptionTimeService.findOneByAccountId(req.user.accountId);
    }

    @ApiOperation({ summary: 'Returns interception times for given id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.interceptionTimeService.findOne(id);
    }

    @ApiOperation({ summary: 'Updates interception times for given id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Put(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateInterceptionTimeDto: Partial<InterceptionTimeCreationAttributes>) {
        return this.interceptionTimeService.update(id, updateInterceptionTimeDto);
    }

    @ApiOperation({ summary: 'Deletes interception times for given id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.interceptionTimeService.remove(id);
    }
}
