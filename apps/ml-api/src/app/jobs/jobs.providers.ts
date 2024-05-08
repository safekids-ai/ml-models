import { JOB_REPOSITORY } from '../constants';
import { Job } from './entities/jobs.entity';

export const jobsProviders = [
    {
        provide: JOB_REPOSITORY,
        useValue: Job,
    },
];
