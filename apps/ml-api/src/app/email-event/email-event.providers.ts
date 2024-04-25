import { EmailEvent } from './entities/email-event.entity';
import { EMAILEVENT_REPOSITORY } from '../constants';

export const emailEventProviders = [
    {
        provide: EMAILEVENT_REPOSITORY,
        useValue: EmailEvent,
    },
];
