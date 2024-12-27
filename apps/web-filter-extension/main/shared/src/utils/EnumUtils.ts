import { PrrCategory } from '@shared/types/PrrCategory';

export class EnumUtils {
    static getCategoryByValue(value: string): PrrCategory {
        const indexOfS = Object.values(PrrCategory).indexOf(value as unknown as PrrCategory);
        const key = Object.keys(PrrCategory)[indexOfS];
        return key as PrrCategory;
    }
}
