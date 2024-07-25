import { KidConfigDto } from '@src/shared/types/KidConfig.type';
import { FilteredCategory } from '@src/shared/types/FilteredCategory.type';

export type Configuration = {
    permissible: string[];
    nonPermissible: string[];
    filteredCategories: FilteredCategory[];
    interceptionCategories: string[];
    accessLimited: boolean;
    subscription: boolean;
    isExtensionEnabled: boolean;
    kidConfig: KidConfigDto;
};
