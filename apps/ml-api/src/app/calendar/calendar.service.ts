import { Inject, Injectable } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { CALENDAR_REPOSITORY, SEQUELIZE } from '../constants';
import { AccountCalendar } from './entities/calendar.entity';
import { Op, QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { FilteredUrl } from '../filtered-url/entities/filtered-url.entity';
import { QueryException } from '../error/common.exception';
import { Sequelize } from 'sequelize-typescript';
import { LoggingService } from '../logger/logging.service';

@Injectable()
export class CalendarService {
    private readonly sequelize: Sequelize;
    constructor(
        @Inject(CALENDAR_REPOSITORY) private readonly calendarRepository: typeof AccountCalendar,
        private readonly log: LoggingService,
        @Inject(SEQUELIZE) sequelize: Sequelize
    ) {
        this.sequelize = sequelize;
    }
    async create(createCalendarDto: CreateCalendarDto) {
        return await this.calendarRepository.create(createCalendarDto);
    }

    async findAll(accountId: string): Promise<AccountCalendar[]> {
        return await this.calendarRepository.findAll({ where: { accountId } });
    }

    async findOne(id: string): Promise<AccountCalendar> {
        return await this.calendarRepository.findOne({ where: { id } });
    }

    async update(id: string, updateCalendarDto: UpdateCalendarDto) {
        return await this.calendarRepository.update(updateCalendarDto, { where: { id } });
    }

    async remove(id: string) {
        return await this.calendarRepository.destroy({ where: { id } });
    }

    async upsert(createCalendarDto: CreateCalendarDto) {
        return await this.calendarRepository.upsert(createCalendarDto);
    }

    async bulkUpsert(accountId: string, createCalendarDtos: CreateCalendarDto[]) {
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            await this.calendarRepository.destroy({ where: { accountId } });
            createCalendarDtos.forEach((dto) => {
                dto.accountId = accountId;
                this.calendarRepository.create(dto);
            });
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
    }

    async bulkCreate(createCalendarDtos: CreateCalendarDto[]) {
        await this.calendarRepository.bulkCreate(createCalendarDtos);
    }

    async checkHoliday(accountId, date: Date) {
        const query =
            'SELECT DISTINCT 1 FROM nonschool_day,account,nonschool_days_config ' +
            '        WHERE (DATE(:date) BETWEEN start_date AND end_date\n' +
            '        AND nonschool_day.account_id=:accountId) OR ( ' +
            '        nonschool_days_config.account_id = account.id AND \n' +
            '        nonschool_days_config.public_holidays_enabled=1 AND DATE(:date) BETWEEN start_date AND end_date AND nonschool_day.account_id IS NULL\n' +
            "        ) AND nonschool_day.status_id='ACTIVE'";
        const result: any = await this.calendarRepository.sequelize.query(query, {
            replacements: { accountId, date },
            type: QueryTypes.SELECT,
            mapToModel: true,
        });

        return result[0] === undefined ? false : result[0].result === 1;
    }
    async saveHolidaysForYear(year: string) {
        const holidays = [
            '01-02',
            '01-03',
            '01-17',
            '04-17',
            '05-08',
            '05-30',
            '06-19',
            '06-20',
            '07-04',
            '09-05',
            '10-10',
            '10-11',
            '11-24',
            '11-25',
            '12-25',
            '12-26',
        ];
        const calendars = [];
        for (let i = 0; i < holidays.length; i++) {
            const calendar = { startDate: year + '-' + holidays[i], endDate: year + '-' + holidays[i], type: 'US-HOLIDAY' };
            calendars.push(calendar);
        }
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            await this.calendarRepository.destroy({
                where: {
                    accountId: {
                        [Op.is]: null,
                    },
                },
                force: true,
            });
            await this.calendarRepository.bulkCreate(calendars);
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            console.log(`Rollingback transcation... `);
            throw new QueryException(QueryException.save());
        }
    }
    async insertSeedData() {
        const date = new Date();
        await this.saveHolidaysForYear('' + date.getFullYear());
    }
}
