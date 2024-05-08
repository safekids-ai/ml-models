import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { PrrNotificationService } from './prr-notification.service';
import { CreatePrrNotificationDto } from './dto/create-prr-notification.dto';
import { UpdatePrrNotificationDto } from './dto/update-prr-notification.dto';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('PRR Notification')
@Controller('v2/activities')
export class PrrNotificationController {
    constructor(private readonly notificationsManagementService: PrrNotificationService) {}

    @ApiOperation({ summary: 'Creates prr notification.' })
    @ApiBearerAuth()
    @Post('notifications')
    create(@Body() createNotificationsManagementDto: CreatePrrNotificationDto) {
        return this.notificationsManagementService.create(createNotificationsManagementDto);
    }

    @ApiOperation({ summary: 'Returns all not read prr notification by account id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('accounts/notifications')
    findAllByAccount(@Request() req, @Query() query) {
        return this.notificationsManagementService.findAllNotReadByAccountId(query.page, query.size, req.user.accountId);
    }

    @ApiOperation({ summary: 'Returns all not read prr notification.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('notifications/notread')
    findAll(@Request() req, @Query() query) {
        return this.notificationsManagementService.findAllNotRead(query.page, query.size);
    }

    @ApiOperation({ summary: 'Returns single notification by code.' })
    @ApiBearerAuth()
    @Get('notifications')
    findOne(@Query('code') code: string) {
        return this.notificationsManagementService.findOneByCode(code);
    }

    @ApiOperation({ summary: 'Updates single notification by id.' })
    @ApiBearerAuth()
    @Put('notifications/:id')
    update(@Param('id') id: string, @Body() updateNotificationsManagementDto: UpdatePrrNotificationDto) {
        return this.notificationsManagementService.update(id, updateNotificationsManagementDto);
    }

    @ApiOperation({ summary: 'Updates single notification by id.' })
    @ApiBearerAuth()
    @Patch('notifications/:id/read')
    read(@Param('id') id: string, @Body() updateNotificationsManagementDto: { read: boolean; readAt?: Date }) {
        updateNotificationsManagementDto.readAt = new Date();
        return this.notificationsManagementService.update(id, updateNotificationsManagementDto);
    }

    @ApiOperation({ summary: 'Updates single notification by id to expired.' })
    @ApiBearerAuth()
    @Patch('notifications/:id/expire')
    expire(@Param('id') id: string, @Body() updateNotificationsManagementDto: { expired: boolean; expiredAt?: Date }) {
        updateNotificationsManagementDto.expiredAt = new Date();
        return this.notificationsManagementService.update(id, updateNotificationsManagementDto);
    }

    @ApiOperation({ summary: 'Deletes single notification by id.' })
    @ApiBearerAuth()
    @Delete('notifications/:id')
    remove(@Param('id') id: string) {
        return this.notificationsManagementService.remove(id);
    }
}
