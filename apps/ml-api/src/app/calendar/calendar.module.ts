import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { calendarProviders } from './calendar.providers';
import { databaseProviders } from '../core/database/database.providers';
import { NonSchoolDaysConfigModule } from '../non-school-days-config/non-school-days-config.module';

@Module({
    controllers: [CalendarController],
    providers: [CalendarService, ...calendarProviders, ...databaseProviders],
    exports: [CalendarService],
})
export class CalendarModule {}
