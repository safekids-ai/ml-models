import { Controller, Get, Query, Res } from '@nestjs/common';
import pkg from 'express';
import { GoogleOauthService } from './googleOauth.service';
import { LoginTokenResponseDto } from '../auth/dto/login-token-response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

const {Response} = pkg;
@ApiTags('Google oauth')
@Controller('auth/google')
export class GoogleOauthController {
    constructor(private googleOauthservice: GoogleOauthService) {}

    @ApiOperation({ summary: 'Authorizes admin and redirects to authorized url.' })
    @Get()
    async googleAuth(@Res() res: Response) {
        const isTeacher = false;
        await this.googleOauthservice.authorize(res, isTeacher);
    }

    @ApiOperation({ summary: 'Authorizes user against teacher scopes.' })
    @Get('teacher')
    async googleAuths(@Res() res: Response) {
        const isTeacher = true;
        await this.googleOauthservice.authorize(res, isTeacher);
    }

    @ApiOperation({ summary: 'Authenticates admin.' })
    @Get('redirect')
    async googleAuthRedirect(@Query() query): Promise<LoginTokenResponseDto> {
        return await this.googleOauthservice.authenticateAdmin(query.code);
    }

    @ApiOperation({ summary: 'Authenticates teacher.' })
    @Get('redirect/teacher')
    async googleAuthRedirectTeacher(@Query() query): Promise<LoginTokenResponseDto> {
        return await this.googleOauthservice.authenticateTeacher(query.code);
    }
}
