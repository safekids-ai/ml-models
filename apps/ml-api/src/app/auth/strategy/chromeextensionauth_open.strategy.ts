import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable} from '@nestjs/common';
import jwtConfig from '../../config/jwt';
import { ChromeExtensionToken } from '../dto/ChromeExtensionToken';

@Injectable()
export class ChromeExtensionOpenStrategy extends PassportStrategy(Strategy, 'chrome-extension-auth-open') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig().jwtConfig.secretKey,
            ignoreExpiration: true,
        });
    }

    async validate(payload: ChromeExtensionToken): Promise<any> {
      return true;
    }
}
