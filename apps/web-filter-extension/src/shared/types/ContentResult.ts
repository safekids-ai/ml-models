import { UrlStatus } from '@shared/types/UrlStatus';
import { PrrCategory } from '@shared/types/PrrCategory';
import { PrrLevel } from '@shared/types/PrrLevel';

export type ContentResult = {
    status: string;
    category: PrrCategory;
    level: PrrLevel;
    host?: string;
    key?: PrrCategory.EDUCATIONAL | string;
    name?: PrrCategory.EDUCATIONAL | string;
};
