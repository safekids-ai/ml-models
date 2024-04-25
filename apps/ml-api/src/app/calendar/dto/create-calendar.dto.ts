import { CalendarAttributes } from '../entities/calendar.entity';

export class CreateCalendarDto implements CalendarAttributes {
    accountId: string;
    endDate: string;
    startDate: string;
    statusId: string;
    title: string;
    year?: number;
}
