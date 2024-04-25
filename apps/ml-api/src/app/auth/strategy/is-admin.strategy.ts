import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { GoogleOauthTokenDto } from '../../google-ouath/dto/google.oauth.token.dto';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../../config/jwt';

@Injectable()
export class IsAdminStrategy extends PassportStrategy(Strategy, 'is-admin') {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig().jwtConfig.secretKey,
        });
    }

    async validate(dto: GoogleOauthTokenDto): Promise<GoogleOauthTokenDto> {
        const user = await this.userService.findOneById(dto.userId);
        if ((!user || user?.accountId !== dto.accountId) && !user?.isAdmin) {
            throw new ForbiddenException('You are not allowed to perform this operation');
        }
        return dto;
    }
}
