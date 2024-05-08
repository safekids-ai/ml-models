import { Controller, Get, Query } from '@nestjs/common';
import { PrrNotificationService } from './prr-notification.service';
import { UserDTO } from '../user/dto/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Crisis management')
@Controller('v2/crisis-management')
export class PrrNotificationResponseController {
    constructor(private readonly prrNotificationService: PrrNotificationService) {}

    @ApiOperation({ summary: 'Verifies given token and update notification status.' })
    @Get('verify-token')
    async verifyToken(@Query('token') token: string): Promise<UserDTO> {
        return await this.prrNotificationService.verifyToken(token);
    }
}
