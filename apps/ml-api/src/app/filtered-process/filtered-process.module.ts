import { OrgUnitModule } from './../org-unit/org-unit.module';
import { FilteredProcessService } from './filtered-process.service';
import { Module } from '@nestjs/common';
import { FilteredProcessController } from './filtered-process.controller';
import { filteredProcessProviders } from './filtered-process.providers';
import { databaseProviders } from '../core/database/database.providers';
import { usersProviders } from '../user/users.providers';

@Module({
    imports: [OrgUnitModule],
    controllers: [FilteredProcessController],
    providers: [FilteredProcessService, ...filteredProcessProviders, ...databaseProviders, ...usersProviders],
    exports: [FilteredProcessService],
})
export class FilteredProcessModule {}
