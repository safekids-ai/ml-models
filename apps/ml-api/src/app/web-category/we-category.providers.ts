import {WEBCATEGORY_REPOSITORY, WEBTIME_REPOSITORY} from '../constants';
import {WebCategory} from './entities/web-category-entity';

export const webCategoryProviders = [
  {
    provide: WEBCATEGORY_REPOSITORY,
    useValue: WebCategory,
  },
];
