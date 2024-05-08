import { ENROLLMENT_REPOSITORY } from '../constants';
import { Enrollment } from './entities/enrollment.entity';

export const enrollmentProviders = [
    {
        provide: ENROLLMENT_REPOSITORY,
        useValue: Enrollment,
    },
];
