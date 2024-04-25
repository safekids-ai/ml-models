import { FILTEREDURL_REPOSITORY } from '../constants';
import { FilteredUrl } from './entities/filtered-url.entity';

export const filteredUrlProviders = [
    {
        provide: FILTEREDURL_REPOSITORY,
        useValue: FilteredUrl,
    },
];
