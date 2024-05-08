import { Module } from '@nestjs/common';
import { JwtTokenModule } from '../auth/jwtToken/jwt.token.module';
import { FilteredUrlModule } from '../filtered-url/filtered-url.module';
import { KidRequestService } from './kid-request.service';
import { KidRequestController } from './kid-request.controller';
import { KidRequestProvider } from './domain/kid-request.provider';
import { databaseProviders } from '../core/database/database.providers';
import { userProviders } from '../consumer/user/users.providers';

@Module({
    imports: [JwtTokenModule, FilteredUrlModule],
    providers: [KidRequestService, ...KidRequestProvider, ...databaseProviders, ...userProviders],
    exports: [KidRequestService],
    controllers: [KidRequestController],
})
export class KidRequestModule {}
