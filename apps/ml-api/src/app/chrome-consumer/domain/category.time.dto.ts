import { CategoryDTO } from '../../filtered-category/dto/filtered-category.dto';

export class CategoryTimeDto {
    readonly offTime: string;
    readonly categories: CategoryDTO[];
}
