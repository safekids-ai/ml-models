import { NonSchoolDaysConfig } from './entities/non-school-days-config.entity';
import { NONSCHOOLDAYSCONFIG_REPOSITORY } from '../constants';

export const nonSchoolDaysConfigProviders = [
    {
        provide: NONSCHOOLDAYSCONFIG_REPOSITORY,
        useValue: NonSchoolDaysConfig,
    },
];
