import { KidConfigDto } from '@shared/types/KidConfig.type';
import { FilteredCategory } from '@shared/types/FilteredCategory.type';

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
