import { PRRNOTIFICATION_REPOSITORY } from '../constants';
import { PrrNotification } from './entities/prr-notification.entity';

export const prrNotificationProviders = [
    {
        provide: PRRNOTIFICATION_REPOSITORY,
        useValue: PrrNotification,
    },
];
