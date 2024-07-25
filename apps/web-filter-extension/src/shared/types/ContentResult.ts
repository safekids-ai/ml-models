import { UrlStatus } from '@src/shared/types/UrlStatus';
import { PrrCategory } from '@src/shared/types/PrrCategory';
import { PrrLevel } from '@src/shared/types/PrrLevel';

export type ContentResult = {
    status: string;
    category: PrrCategory;
    level: PrrLevel;
    host?: string;
    key?: PrrCategory.EDUCATIONAL | string;
    name?: PrrCategory.EDUCATIONAL | string;
};
