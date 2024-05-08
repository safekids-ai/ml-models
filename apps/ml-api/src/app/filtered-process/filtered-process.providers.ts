import { FILTERED_PROCESS_REPOSITORY } from '../constants';
import { FilteredProcess } from './entities/filtered-process.entity';

export const filteredProcessProviders = [
    {
        provide: FILTERED_PROCESS_REPOSITORY,
        useValue: FilteredProcess,
    },
];
