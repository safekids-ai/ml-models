import { Device } from './entities/device.entity';
import { DEVICE_REPOSITORY } from '../constants';

export const deviceProviders = [
    {
        provide: DEVICE_REPOSITORY,
        useValue: Device,
    },
];
