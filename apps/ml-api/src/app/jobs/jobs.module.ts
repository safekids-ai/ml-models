import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { jobsProviders } from './jobs.providers';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { databaseProviders } from '../core/database/database.providers';
import { ApiKeyModule } from '../api-key/api-key.module';
import { OneRosterModule } from '../roster/roster.module';
import { DirectoryModule } from '../directory-service/directory.module';

@Module({
    imports: [DirectoryModule, AuthTokenModule, ApiKeyModule, OneRosterModule],
    controllers: [JobsController],
    providers: [JobsService, ...jobsProviders, ...databaseProviders],
    exports: [JobsService],
})
export class JobsModule {}
