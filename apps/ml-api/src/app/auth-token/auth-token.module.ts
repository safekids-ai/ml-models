import { Module } from '@nestjs/common';
import { AuthTokenService } from './auth-token.service';
import { usersAuthTokenProviders } from './auth-token.providers';
import { GoogleApisModule } from '../google-apis/google-apis.module';

@Module({
    imports: [GoogleApisModule],
    providers: [AuthTokenService, ...usersAuthTokenProviders],
    exports: [AuthTokenService],
})
export class AuthTokenModule {}
