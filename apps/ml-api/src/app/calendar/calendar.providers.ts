import { AccountCalendar } from './entities/calendar.entity';
import { CALENDAR_REPOSITORY } from '../constants';

export const calendarProviders = [
    {
        provide: CALENDAR_REPOSITORY,
        useValue: AccountCalendar,
    },
];
