import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Sequelize } from 'sequelize-typescript';
import { createMemDB } from '../test/utils/createMemDb';
import { User } from './entities/user.entity';
import { usersProviders } from './users.providers';
import { GoogleApisModule } from '../google-apis/google-apis.module';
import { StatusModule } from '../status/status.module';
import { OrgUnitModule } from '../org-unit/org-unit.module';
import { AccountTypeModule } from '../account-type/account-type.module';
import { StatusService } from '../status/status.service';
import { AccountService } from '../accounts/account.service';
import { OrgUnitService } from '../org-unit/org-unit.service';
import { AccountTypeService } from '../account-type/account-type.service';
import { OrgUnit } from '../org-unit/entities/org-unit.entity';
import { AccountType } from '../account-type/entities/account-type.entity';
import { Status } from '../status/entities/status.entity';
import { Account } from '../accounts/entities/account.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { statusProviders } from '../status/status.providers';
import { accountTypeProviders } from '../account-type/account-type.providers';
import { accountProviders } from '../accounts/account.providers';
import { orgUnitProviders } from '../org-unit/org-unit.providers';
import { ValidationException } from '../error/common.exception';
import { UserErrors } from '../error/users.errors';

describe('UserService', () => {
    it('test', async () => {});
    // let accountService: AccountService;
    // let accountTypeService : AccountTypeService;
    // let orgUnitService: OrgUnitService;
    // let statusService: StatusService;
    // let userService: UserService;
    //
    // let memDb: Sequelize;
    //
    // beforeAll(async () => {
    //   // Initiate Sequelize with SQLite and our models
    //   memDb = await createMemDB([Account,OrgUnit,Status,AccountType,User]);
    //
    //   const module: TestingModule = await Test.createTestingModule({
    //     imports: [GoogleApisModule,StatusModule, AccountsModule, OrgUnitModule,AccountTypeModule],
    //     providers: [UserService, StatusService, AccountService,OrgUnitService,AccountTypeService
    //     ,...usersProviders,...statusProviders,...accountTypeProviders,...accountProviders,...orgUnitProviders]
    //   }).compile();
    //
    //   accountService = module.get<AccountService>(AccountService);
    //   accountTypeService = module.get<AccountTypeService>(AccountTypeService);
    //   orgUnitService = module.get<OrgUnitService>(OrgUnitService);
    //   statusService = module.get<StatusService>(StatusService);
    //   userService = module.get<UserService>(UserService);
    //
    //   await statusService.create({"id": 1, "status" : "ACTIVE"})
    //   const status = await statusService.findOne(1)
    //
    //   await accountTypeService.create({"id": 1, "type" : "SCHOOL"})
    //   const accountType = await accountTypeService.findOne(1)
    //
    //   await accountService.create({"id" : 1, "name" : "Test School",primaryDomain: "school.org",statusId: status.id,contact: "Test",accountTypeId: accountType.id})
    //   const account = await accountService.findOne(1)
    //
    //   await orgUnitService.create({"id" : 1, "name" : "/School","statusId" : status.id,"accountId": account.id })
    //   const orgUnit = await orgUnitService.findOne(1)
    //
    //   const user1 = {
    //     "id": 1,
    //     "firstName": "Test",
    //     "lastName": "User",
    //     "email": "test@user.com",
    //     statusId: status.id,
    //     accountId: account.id,
    //     orgUnitId : orgUnit.id
    //   }
    //   await userService.create(user1);
    //
    //   const user2 = {
    //     "id": 2,
    //     "firstName": "Test",
    //     "lastName": "User1",
    //     "email": "test1@user.com",
    //     statusId: status.id,
    //     accountId: account.id,
    //     orgUnitId : orgUnit.id
    //   }
    //   await userService.create(user2);
    // });
    //
    // afterAll(() => memDb.close());
    //
    // describe.skip('UserModule', () => {
    //
    //   beforeEach(async () => {
    //
    //
    //   });
    //
    //   afterEach(async () => {
    //     // clean out the database after every test
    //      //await memDb.truncate();
    //   });
    //
    //   it('should return users with organization id', async () => {
    //
    //     const userWithEmail : User[] = await userService.findAllByOrgUnitId(1)
    //
    //     expect(userWithEmail != null).toBeTruthy()
    //     expect(userWithEmail.length === 2).toBeTruthy()
    //   });
    //
    //   it('should update user status', async () => {
    //
    //     const userWithEmail : User = await userService.findOneByEmail("test@user.com")
    //
    //     await userService.updateStatus(userWithEmail.id,{"status" : 1})
    //
    //     const userAfterStatusUpdate : User = await userService.findOneByEmail("test@user.com")
    //
    //     expect(userAfterStatusUpdate.statusId === 1).toBeTruthy()
    //   });
    //
    //   it('should make user an admin', async () => {
    //
    //     const userWithEmail : User = await userService.findOneByEmail("test@user.com")
    //
    //     expect(userWithEmail.isAdmin === 0).toBeTruthy()
    //     await userService.makeAdmin(userWithEmail.id, {"isAdmin" : 1})
    //
    //     const userAfterAdminStatus : User = await userService.findOneByEmail("test@user.com")
    //     expect(userAfterAdminStatus.isAdmin === 1).toBeTruthy()
    //   });
    //
    //
    //
    // });
});
