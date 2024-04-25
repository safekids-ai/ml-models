import { Module } from '@nestjs/common';
import { DefaultCategoryService } from './default-category.service';
import { CategoryController } from './category.controller';
import { categoryProviders } from './category.providers';
import { accountProviders } from '../accounts/account.providers';

@Module({
    controllers: [CategoryController],
    providers: [DefaultCategoryService, ...categoryProviders, ...accountProviders],
    exports: [DefaultCategoryService],
})
export class OnBoardingCategoryModule {}
