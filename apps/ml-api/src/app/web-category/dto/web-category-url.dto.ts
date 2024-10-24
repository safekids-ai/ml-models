import {IsNotEmpty, IsOptional, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {IsAtLeastOneFieldRequired} from "../../utils/validator.util";
import {ApiProperty} from "@nestjs/swagger";
import {WebCategoryUrl} from "apps/ml-api/src/app/web-category/entities/web-category-url-entity";
import {HTMLWebData, WebCategoryType} from "@safekids-ai/web-category-types";

export class WebMetaDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  keywords?: string;

  @IsOptional()
  ogType?: string;

  @IsOptional()
  ogDescription?: string;

  @IsOptional()
  ogUrl?: string;

  @IsOptional()
  rating?: string
}

export class GetWebCategoryDto {
  @IsNotEmpty()
  url: string;
  htmlMeta?: HTMLWebData;
}

export class WebCategoryUrlResponseDto {
  @ApiProperty()
  aiGenerated: boolean;

  @ApiProperty()
  verified: boolean;

  @ApiProperty()
  categories: number[];

  @ApiProperty()
  probability: number[];

  @ApiProperty()
  rawCategory?: string;
}
