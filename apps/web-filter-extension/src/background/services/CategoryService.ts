import {FilteredCategory} from '@shared/types/FilteredCategory.type';
import {Logger} from '@shared/logging/ConsoleLogger';
import {RESTService} from '@shared/rest/RestService';
import {UPDATE_CATEGORIES, UPDATE_CATEGORIES_TIME} from './endpoints';

export type CategoryService = {
  updateCategories: (category: FilteredCategory) => Promise<void>;
  updateCategoriesTime: (categories: FilteredCategory[], offTime: string) => Promise<void>;
};

/**
 * Category Service
 */
export class CategoryServiceImpl implements CategoryService {
  constructor(private readonly logger: Logger, private readonly restService: RESTService) {
  }

  async updateCategories(category: FilteredCategory): Promise<void> {
    try {
      return await this.restService.doPut(UPDATE_CATEGORIES, category);
    } catch (error) {
      throw new Error(`An error occurred while saving category status: ${error}`);
    }
  }

  async updateCategoriesTime(categories: FilteredCategory[], offTime: string): Promise<void> {
    try {
      const payload = {
        categories,
        offTime,
      };
      return await this.restService.doPut(UPDATE_CATEGORIES_TIME, payload);
    } catch (error) {
      throw new Error(`An error occurred while saving category time and offtime: ${error}`);
    }
  }
}
