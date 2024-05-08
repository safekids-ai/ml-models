import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService} from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { GoogleOauthTokenDto } from '../../google-ouath/dto/google.oauth.token.dto';
import { LoginTokenResponseDto } from '../dto/login-token-response.dto';
import { UserDTO } from '../../user/dto/user.dto';
import {JwtConfig} from "apps/ml-api/src/app/config/jwt";

@Injectable()
export class JwtTokenService {
  private readonly jwtConfig: JwtConfig
    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {
      this.jwtConfig = configService.get<JwtConfig>("jwtConfig")
    }

    /** Generates JWT token from chrome extension payload
     * @param  payload chrome extension payload
     * @returns LoginTokenResponseDto containing jwt token
     */
    async generateChromeExtensionToken(payload: any): Promise<LoginTokenResponseDto> {
        return {
            jwt_token: this.jwtService.sign(payload),
        } as LoginTokenResponseDto;
    }

    /** Generates JWT token with expiry
     * @param  payload UserDTO | GoogleOauthTokenDto
     * @returns string jwt token
     */
    async generateRegistrationToken(payload: UserDTO | GoogleOauthTokenDto): Promise<string> {
        return jwt.sign(payload, this.jwtConfig.secretKey, { expiresIn: '1d' });
    }

    /** Verify jwt token
     * @param  token RegistrationTokenDTO
     */
    async verifyToken(token: string): Promise<any> {
        return this.jwtService.verify(token, { secret: this.jwtConfig.secretKey });
    }

    /** Verify Uninstall Extension token
     * @param  token RegistrationTokenDTO
     */
    async verifyUninstallExtensionToken(token: string): Promise<any> {
        return this.jwtService.verify(token, { secret: this.jwtConfig.secretKey, ignoreExpiration: true });
    }
}
