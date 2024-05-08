import { LICENSE_REPOSITORY } from '../constants';
import { License } from './entities/license.entity';

export const licenseProviders = [
    {
        provide: LICENSE_REPOSITORY,
        useValue: License,
    },
];
