import { FilteredProcessModule } from './../filtered-process/filtered-process.module';
import { Module } from '@nestjs/common';
import { OrgUnitService } from './org-unit.service';
import { OrgUnitController } from './org-unit.controller';
import { GoogleApisModule } from '../google-apis/google-apis.module';
import { orgUnitProviders } from './org-unit.providers';
import { FilteredUrlModule } from '../filtered-url/filtered-url.module';
import { FilteredCategoryModule } from '../filtered-category/filtered-category.module';
import { OnBoardingCategoryModule } from '../category/on-boarding-category-module';
import { databaseProviders } from '../core/database/database.providers';
import { userProviders } from '../consumer/user/users.providers';
import { KidRequestModule } from '../kid-request/kid-request.module';
import { planProviders } from '../billing/plan/plan.providers';

@Module({
    imports: [GoogleApisModule, FilteredUrlModule, FilteredCategoryModule, OnBoardingCategoryModule, KidRequestModule],
    controllers: [OrgUnitController],
    providers: [OrgUnitService, ...orgUnitProviders, ...databaseProviders, ...userProviders, ...planProviders],
    exports: [OrgUnitService],
})
export class OrgUnitModule {}
