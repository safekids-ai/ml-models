import { DeviceType } from './entities/device-type.entity';
import { DEVICE_TYPE_REPOSITORY } from '../constants';

export const deviceTypeProviders = [
    {
        provide: DEVICE_TYPE_REPOSITORY,
        useValue: DeviceType,
    },
];
