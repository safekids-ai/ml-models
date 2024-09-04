import {IsNotEmpty, IsOptional, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {IsAtLeastOneFieldRequired} from "../../utils/validator.util";

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
}

export class CreateWebCategoryDto {
  @IsNotEmpty()
  url: string;

  // @ValidateNested()
  // @Type(() => WebMetaDto)
  // @IsAtLeastOneFieldRequired({
  //   message: 'At least one of the fields (title, description, keywords, ogType, ogDescription, ogUrl) must be provided.',
  // })
  meta: WebMetaDto;
}
