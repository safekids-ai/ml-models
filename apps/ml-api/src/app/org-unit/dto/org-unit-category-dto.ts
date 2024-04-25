import { CategoryDTO } from '../../filtered-category/dto/filtered-category.dto';

export class OrgUnitCategoryDto {
    readonly id: string;
    readonly name: string;
    readonly categories: CategoryDTO[];
}
