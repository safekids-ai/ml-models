import {WEBCATEGORY_URL_REPOSITORY, WEBCATEGORY_HOST_REPOSITORY, WEBTIME_REPOSITORY} from '../constants';
import {WebCategoryUrl} from './entities/web-category-url-entity';
import {WebCategoryHost} from './entities/web-category-host-entity';

export const webCategoryProviders = [
  {
    provide: WEBCATEGORY_URL_REPOSITORY,
    useValue: WebCategoryUrl,
  },
  {
    provide: WEBCATEGORY_HOST_REPOSITORY,
    useValue: WebCategoryHost,
  },
];
