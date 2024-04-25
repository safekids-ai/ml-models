import { Module } from '@nestjs/common';
import { FilteredCategoryService } from './filtered-category.service';
import { FilteredCategoryController } from './filtered-category.controller';
import { filteredCategoryProviders } from './filteredcategory.providers';
import { orgUnitProviders } from '../org-unit/org-unit.providers';
import { databaseProviders } from '../core/database/database.providers';
import { DatabaseModule } from '../core/database/database.module';
import { OnBoardingCategoryModule } from '../category/on-boarding-category-module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
    imports: [DatabaseModule, OnBoardingCategoryModule, AccountsModule],
    controllers: [FilteredCategoryController],
    providers: [FilteredCategoryService, ...filteredCategoryProviders, ...databaseProviders, ...orgUnitProviders],
    exports: [FilteredCategoryService],
})
export class FilteredCategoryModule {}
