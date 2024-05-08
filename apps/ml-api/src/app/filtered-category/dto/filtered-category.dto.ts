import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CategoryStatus } from '../../category/category.status';

export class CategoryDTO {
    orgUnitId?: string;
    readonly id: string;
    readonly name: string;
    readonly enabled?: boolean;
    @IsOptional()
    @IsEnum(CategoryStatus, { message: 'Only following statuses are allowed  [ALLOW,ASK,PREVENT,INFORM]' })
    readonly status?: CategoryStatus;
    readonly timeDuration?: number;
}

export class FilteredCategoryDto {
    readonly orgUnitIds: string[];
    readonly categories: CategoryDTO[];
}
