import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt';
import { JwtTokenService } from './jwt.token.service';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConfig().jwtConfig.secretKey,
            signOptions: {
                expiresIn: jwtConfig().jwtConfig.secretKeyExpirationSeconds,
            },
        }),
    ],
    providers: [JwtTokenService],
    exports: [JwtTokenService],
})
export class JwtTokenModule {}
