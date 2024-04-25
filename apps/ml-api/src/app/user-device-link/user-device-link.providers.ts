import { UserDeviceLink } from './entities/user-device-link.entity';
import { USER_DEVICE_LINK_REPOSITORY } from '../constants';

export const userDeviceLinkProviders = [
    {
        provide: USER_DEVICE_LINK_REPOSITORY,
        useValue: UserDeviceLink,
    },
];
