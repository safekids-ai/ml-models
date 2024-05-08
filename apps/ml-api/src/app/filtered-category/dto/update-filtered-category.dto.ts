import { PartialType } from '@nestjs/mapped-types';
import { CreateFilteredCategoryDto } from './create-filtered-category.dto';

export class UpdateFilteredCategoryDto extends PartialType(CreateFilteredCategoryDto) {}
