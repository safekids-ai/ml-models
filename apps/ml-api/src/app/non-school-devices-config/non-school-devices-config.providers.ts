import { NonSchoolDevicesConfig } from './entities/non-school-devices-config.entity';
import { NON_SCHOOL_DEVICES_CONFIG_REPOSITORY } from '../constants';

export const nonSchoolDevicesConfigProviders = [
    {
        provide: NON_SCHOOL_DEVICES_CONFIG_REPOSITORY,
        useValue: NonSchoolDevicesConfig,
    },
];
