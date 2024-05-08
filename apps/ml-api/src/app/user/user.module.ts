import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { usersProviders } from './users.providers';
import { UserController } from './user.controller';
import { GoogleApisModule } from '../google-apis/google-apis.module';
import { databaseProviders } from '../core/database/database.providers';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { OrgUnitModule } from '../org-unit/org-unit.module';

@Module({
    imports: [GoogleApisModule, AuthTokenModule, OrgUnitModule],
    providers: [UserService, ...usersProviders, ...databaseProviders],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
