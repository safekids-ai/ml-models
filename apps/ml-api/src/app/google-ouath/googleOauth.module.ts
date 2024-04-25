import { Module } from '@nestjs/common';
import { JwtTokenModule } from '../auth/jwtToken/jwt.token.module';
import { GoogleOauthService } from './googleOauth.service';
import { AccountsModule } from '../accounts/accounts.module';
import { OrgUnitModule } from '../org-unit/org-unit.module';
import { UserModule } from '../user/user.module';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { DirectoryModule } from '../directory-service/directory.module';
import { databaseProviders } from '../core/database/database.providers';
import { GoogleOauthController } from './googleOauth.controller';

@Module({
    imports: [JwtTokenModule, AccountsModule, OrgUnitModule, UserModule, AuthTokenModule, DirectoryModule],
    controllers: [GoogleOauthController],
    providers: [GoogleOauthService, ...databaseProviders],
})
export class GoogleOauthModule {}
