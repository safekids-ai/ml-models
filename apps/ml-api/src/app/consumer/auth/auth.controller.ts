import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../user/dto/user.dto';
import { AuthCodeDto } from '../user/dto/auth-code.dto';
import { GoogleOauthGuard } from '../../auth/guard/google-oauth.guard';
import { UserStatusValidator } from './validation/user-status-validator';
import { UserCredentialsValidator } from './validation/user-credentials-validator';
import { PasswordCodeDto } from '../user/dto/password-code.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { LoginDto } from '../user/dto/login.dto';
import { ForgotPasswordDto } from '../user/dto/forgot-password.dto';
import { LoginTokenResponseDto } from '../../auth/dto/login-token-response.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Consumer -> Authentication')
@Controller('v2/consumer/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Creates parent account, organization unit and its filtered categories and send email for signup.' })
  @UseGuards(UserStatusValidator)
  @Post('foo')
  public async foo(): Promise<string> {
      return "Hello"
  }

  @ApiOperation({ summary: 'Creates parent account, organization unit and its filtered categories and send email for signup.' })
    @UseGuards(UserStatusValidator)
    @Post('sign-up')
    public async signUp(@Body() dto: UserDto): Promise<LoginTokenResponseDto> {
      console.log("Abbas1")
        return await this.authService.signUp(dto);
    }

    @ApiOperation({ summary: 'Verify email code and set status as active.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Post('verify-email')
    public async verifyEmail(@Request() req, @Body() authCodeDto: AuthCodeDto): Promise<void> {
        await this.authService.verifyEmail(req.user.userId, req.user.accountId, authCodeDto.code);
    }

    @ApiOperation({ summary: 'Returns verification code email.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Post('resend-email-code')
    public async resendEmailCode(@Request() req): Promise<void> {
        await this.authService.resendEmailCode(req.user.userId);
    }

    @ApiOperation({ summary: 'Login user by email.' })
    @ApiBearerAuth()
    @UseGuards(UserCredentialsValidator)
    @Post('login')
    public async login(@Body() dto: LoginDto): Promise<LoginTokenResponseDto> {
        return await this.authService.login(dto);
    }

    @ApiOperation({ summary: 'Send verification code for forgot password.' })
    @Post('forgot-password')
    public async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
        await this.authService.forgotPassword(dto.email);
    }

    @ApiOperation({ summary: 'Verify password code.' })
    @Post('verify-code')
    public async verifyPasswordCode(@Body() dto: PasswordCodeDto): Promise<void> {
        await this.authService.verifyPasswordCode(dto);
    }

    @ApiOperation({ summary: 'Update user password.' })
    @Post('reset-password')
    public async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
        await this.authService.resetPassword(dto);
    }

    @ApiOperation({ summary: 'Temporary -- Migrate consumers.' })
    @UseGuards(GoogleOauthGuard)
    @Post('migrate-consumers')
    public async migrateConsumers(): Promise<void> {
        await this.authService.migrateConsumers();
    }
}
