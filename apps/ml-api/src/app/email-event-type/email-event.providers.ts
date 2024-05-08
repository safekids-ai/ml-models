import { EMAILEVENT_TYPE_REPOSITORY } from '../constants';
import { EmailEventType } from './entities/email-event-type.entity';

export const emailEventTypeProviders = [
    {
        provide: EMAILEVENT_TYPE_REPOSITORY,
        useValue: EmailEventType,
    },
];
