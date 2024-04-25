import { SchoolClass } from './entities/school-class.entity';
import { SCHOOLCLASS_REPOSITORY } from '../constants';

export const schoolClassProviders = [
    {
        provide: SCHOOLCLASS_REPOSITORY,
        useValue: SchoolClass,
    },
];
