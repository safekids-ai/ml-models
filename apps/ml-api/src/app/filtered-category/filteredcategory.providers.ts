import { FILTEREDCATEGORY_REPOSITORY } from '../constants';
import { FilteredCategory } from './entities/filtered-category.entity';

export const filteredCategoryProviders = [
    {
        provide: FILTEREDCATEGORY_REPOSITORY,
        useValue: FilteredCategory,
    },
];
