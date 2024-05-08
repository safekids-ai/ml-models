import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { calendarProviders } from './calendar.providers';
import { Sequelize } from 'sequelize-typescript';
import { createMemDB } from '../test/utils/createMemDb';
import { Account } from '../accounts/entities/account.entity';
import { OrgUnit } from '../org-unit/entities/org-unit.entity';
import { Status } from '../status/entities/status.entity';
import { AccountType } from '../account-type/entities/account-type.entity';
import { User } from '../user/entities/user.entity';
import { GoogleApisModule } from '../google-apis/google-apis.module';
import { StatusModule } from '../status/status.module';
import { AccountsModule } from '../accounts/accounts.module';
import { AccountTypeModule } from '../account-type/account-type.module';
import { StatusService } from '../status/status.service';
import { AccountService } from '../accounts/account.service';
import { AccountTypeService } from '../account-type/account-type.service';
import { statusProviders } from '../status/status.providers';
import { accountTypeProviders } from '../account-type/account-type.providers';
import { accountProviders } from '../accounts/account.providers';
import { CalendarModule } from './calendar.module';
import { AccountCalendar } from './entities/calendar.entity';

describe.skip('CalendarService', () => {
    it('test', async () => {
        console.log('test');
    });
    // let calendarService: CalendarService;
    // let accountService: AccountService;
    // let accountTypeService : AccountTypeService;
    // let statusService: StatusService;
    //
    // let memDb: Sequelize;
    // let account ;
    // let status ;
    //
    // beforeAll(async () => {
    //   // Initiate Sequelize with SQLite and our models
    //   memDb = await createMemDB([Account,OrgUnit,Status,AccountType,User,AccountCalendar]);
    //
    // })
    // beforeEach(async () => {
    //   const module: TestingModule = await Test.createTestingModule({
    //     imports: [GoogleApisModule,StatusModule, AccountsModule, AccountTypeModule,CalendarModule],
    //     providers: [CalendarService, StatusService, AccountService,AccountTypeService
    //       ,...calendarProviders,...statusProviders,...accountTypeProviders,...accountProviders]
    //   }).compile();
    //
    //   accountService = module.get<AccountService>(AccountService);
    //   accountTypeService = module.get<AccountTypeService>(AccountTypeService);
    //   statusService = module.get<StatusService>(StatusService);
    //   calendarService = module.get<CalendarService>(CalendarService);
    //
    //   await statusService.create({"id": 1, "status" : "ACTIVE"})
    //   status = await statusService.findOne(1)
    //
    //   await accountTypeService.create({"id": 1, "type" : "SCHOOL"})
    //   const accountType = await accountTypeService.findOne(1)
    //
    //   await accountService.create({"id" : 1, "name" : "Test School",primaryDomain: "school.org",statusId: status.id,contact: "Test",accountTypeId: accountType.id})
    //   account = await accountService.findOne(1)
    // });
    //
    // afterEach(async () => {
    //   // clean out the database after every test
    //   await memDb.truncate();
    // });
    //
    // it('should create calendar', () => {
    //   const calendar = {
    //     accountId: account.id,
    //     endDate: '01-01-2022',
    //     startDate: '01-01-2022',
    //     statusId: status.id,
    //     title: 'Title'
    //   }
    //   calendarService.create(calendar)
    //
    //   calendarService.findOne(1).then(function (){
    //     expect(calendarService).toBeDefined();
    //   })
    //
    // });
});
