import { EMAILEVENTCONFIG_REPOSITORY } from '../constants';
import { EmailEventConfig } from './entities/email-event-config.entity';

export const emailEventConfigProviders = [
    {
        provide: EMAILEVENTCONFIG_REPOSITORY,
        useValue: EmailEventConfig,
    },
];
