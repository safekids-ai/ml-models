import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { DesktopAuthGuard } from './guard/desktop-auth.guard';
import { DeviceTypes } from '../device-type/device-type.enum';
import type { AuthDto, UserDeviceLoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthErrors } from './auth.errors';
import { LoggingService } from '../logger/logging.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly log: LoggingService) {}

    @ApiOperation({ summary: 'Logins kid from school extension.' })
    @Post('v2/chrome/auth/login')
    public async loginChrome(@Body() loginDTO: UserDeviceLoginDTO): Promise<AuthDto> {
        loginDTO.deviceType = DeviceTypes.CHROMEBOOK;
        return await this.authService.loginUser(loginDTO, DeviceTypes.CHROMEBOOK);
    }

    @ApiOperation({ summary: 'Logins from desktop.' })
    @Post('v2/desktop/auth/login')
    public async loginDesktop(@Body() loginDTO: UserDeviceLoginDTO): Promise<AuthDto> {
        const dto: AuthDto = await this.authService.loginUser(loginDTO, DeviceTypes.DESKTOP);
        return dto;
    }

    @ApiOperation({ summary: 'Logins kid from consumer extension.' })
    @Post('v2/chrome/consumer/auth/login')
    public async loginConsumerChrome(@Body() loginDTO: UserDeviceLoginDTO): Promise<AuthDto> {
        loginDTO.deviceType = DeviceTypes.CHROMEBOOK;
        let authDTO: AuthDto = null;
        try {
            authDTO = await this.authService.loginKidOnChrome(loginDTO, DeviceTypes.CHROMEBOOK);
        } catch (e) {
            this.log.error(AuthErrors.unAuthorized(e));
            throw new UnauthorizedException(AuthErrors.unAuthorized(e));
        }
        return authDTO;
    }

    @ApiOperation({ summary: 'Logins kid from consumer extension.' })
    @Post('v2/desktop/consumer/auth/login')
    public async loginConsumerDesktop(@Body() loginDTO: UserDeviceLoginDTO): Promise<AuthDto> {
        loginDTO.deviceType = DeviceTypes.DESKTOP;
        let authDTO: AuthDto = null;
        try {
            authDTO = await this.authService.loginKidOnChrome(loginDTO, DeviceTypes.DESKTOP);
        } catch (e) {
            this.log.error(AuthErrors.unAuthorized(e));
            throw new UnauthorizedException(AuthErrors.unAuthorized(e));
        }
        return authDTO;
    }
}
