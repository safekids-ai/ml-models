import { Module } from '@nestjs/common';
import {WebCategoryController} from "./web-category-controller";
import {WebCategoryService} from "./web-category.services";

@Module({
  controllers: [WebCategoryController],
  providers: [WebCategoryService],
  exports: [WebCategoryService],
})
export class WebCategoryModule {}
