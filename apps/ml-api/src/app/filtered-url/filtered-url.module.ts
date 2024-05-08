import { Module } from '@nestjs/common';
import { FilteredUrlService } from './filtered-url.service';
import { FilteredUrlController } from './filtered-url.controller';
import { filteredUrlProviders } from './filteredurl.providers';
import { databaseProviders } from '../core/database/database.providers';
import { usersProviders } from '../user/users.providers';
import { orgUnitProviders } from '../org-unit/org-unit.providers';
import { LoggingModule } from '../logger/logging.module';

@Module({
    controllers: [FilteredUrlController],
    providers: [FilteredUrlService, ...filteredUrlProviders, ...databaseProviders, ...usersProviders, ...orgUnitProviders],
    exports: [FilteredUrlService],
})
export class FilteredUrlModule {}
