import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from '../logger/logging.service';
import { StatusService } from '../status/status.service';
import { AccountService } from './account.service';
import { AccountTypes } from '../account-type/dto/account-types';
import { CreateAccountDto } from './dto/create-account.dto';
import { Statuses } from '../status/default-status';
import { QueryTypes } from 'sequelize';
import { Account } from './entities/account.entity';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static getLoggingService() {
        return {
            className: Fixture.getMock(),
            debug: Fixture.getMock(),
            error: Fixture.getMock(),
        };
    }

    static ACCOUNT_REPOSITORY = class {
        static create = Fixture.getMock();
        static findOne = Fixture.getMock();
        static update = Fixture.getMock();
        static findAll = Fixture.getMock();
        static sequelize = { query: jest.fn() };
    };

    static getStatusService = class {
        static findByStatus = Fixture.getMock();
    };
}

describe('Account service unit tests', () => {
    let service: AccountService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountService,
                {
                    provide: StatusService,
                    useValue: Fixture.getStatusService,
                },
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
                {
                    provide: 'ACCOUNT_REPOSITORY',
                    useValue: Fixture.ACCOUNT_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<AccountService>(AccountService);
    });
    describe('Create account', () => {
        it('Should create account successfully', async () => {
            //given
            const accountDTO = {
                name: 'account-name',
                primaryDomain: 'primaryDomain',
                accountTypeId: AccountTypes.CONSUMER,
                onBoardingStatusId: Statuses.IN_PROGRESS,
            } as CreateAccountDto;

            //when
            await service.create(accountDTO);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.create).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.create).toHaveBeenCalledWith(expect.objectContaining(accountDTO));
        });
    });

    describe('Find all accounts', () => {
        it('Should find all accounts successfully', async () => {
            //when
            await service.findAll();

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
        });
        it('Should find all accounts with find options successfully', async () => {
            //when
            const options = { where: { id: 12 } };

            await service.findAll(options);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findAll).toHaveBeenCalledWith(options);
        });
    });

    describe('Find one account by id', () => {
        it('Should fetch single account by id successfully', async () => {
            //given
            const id = 'accountId';

            //when
            await service.findOne(id);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { id } });
        });
    });

    describe('Find one account by primary domain', () => {
        it('Should fetch single account by primary domain successfully', async () => {
            //given
            const primaryDomain = 'primaryDomain';

            //when
            await service.findOneByDomain(primaryDomain);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { primaryDomain } });
        });
    });

    describe('Find admin account by primary domain', () => {
        it('Should fetch single admin account by primary domain successfully', async () => {
            //given
            const primaryDomain = 'primaryDomain';
            jest.spyOn(Fixture.ACCOUNT_REPOSITORY.sequelize, 'query').mockResolvedValueOnce([{ primaryDomain }]);

            //when
            await service.findAdminAccount(primaryDomain);

            //then
            const query =
                ' select ' +
                ' a.id,' +
                ' a.primary_domain ' +
                ' from ' +
                ' user u ' +
                ' inner join account a on ' +
                ' u.account_id = a.id ' +
                ' and u.is_admin = true ' +
                " and a.onboarding_status_id = 'COMPLETED' " +
                ' inner join auth_token token on ' +
                ' u.id = token.user_id ' +
                ' where ' +
                ' ((a.primary_domain = :primaryDomain) OR ' +
                " (POSITION(CONCAT('.',a.primary_domain) IN :primaryDomain) > 0 and a.account_type_id = 'SCHOOL') ) " +
                ' limit 1 ';
            const queryOptions = {
                replacements: { primaryDomain },
                type: QueryTypes.SELECT,
                mapToModel: true,
                model: Account,
            };
            expect(Fixture.ACCOUNT_REPOSITORY.sequelize.query.mock.calls[0][0]).toEqual(query);
            expect(Fixture.ACCOUNT_REPOSITORY.sequelize.query.mock.calls[0][1]).toEqual(queryOptions);
        });
    });

    describe('Upsert by domain', () => {
        it('Should create account when account by primary domain does not exists', async () => {
            //given
            const primaryDomain = 'primaryDomain';
            const accountDTO = {
                name: 'account-name',
                primaryDomain,
                accountTypeId: AccountTypes.CONSUMER,
                onBoardingStatusId: Statuses.IN_PROGRESS,
            } as CreateAccountDto;

            Fixture.ACCOUNT_REPOSITORY.findOne.mockResolvedValue(null);

            //when
            await service.upsertByDomain(accountDTO);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenNthCalledWith(1, { where: { primaryDomain } });
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenNthCalledWith(2, { where: { primaryDomain } });

            expect(Fixture.ACCOUNT_REPOSITORY.create).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.create).toHaveBeenCalledWith(expect.objectContaining(accountDTO));

            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledTimes(0);
        });

        it('Should update account when account by primary domain exists', async () => {
            //given
            const primaryDomain = 'primaryDomain';
            const accountDTO = {
                name: 'account-name',
                primaryDomain,
                accountTypeId: AccountTypes.CONSUMER,
                onBoardingStatusId: Statuses.IN_PROGRESS,
            } as CreateAccountDto;

            Fixture.ACCOUNT_REPOSITORY.findOne.mockResolvedValue({ primaryDomain });

            //when
            await service.upsertByDomain(accountDTO);

            //then
            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenNthCalledWith(1, { where: { primaryDomain } });
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenNthCalledWith(2, { where: { primaryDomain } });

            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledWith(expect.objectContaining(accountDTO), { where: { primaryDomain } });

            expect(Fixture.ACCOUNT_REPOSITORY.create).toHaveBeenCalledTimes(0);
        });
    });

    describe('Find account type by id', () => {
        it('Should fetch account type by id successfully', async () => {
            //given
            const id = 'accountId';

            //when
            await service.getAccountType(id);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith({
                attributes: ['accountTypeId'],
                where: { id },
            });
        });
    });

    describe('Find emergency contact by account id', () => {
        it('Should fetch emergency contact by id successfully', async () => {
            //given
            const id = 'accountId';

            //when
            await service.getEmergencyContact(id);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith({
                attributes: ['emergencyContactName', 'emergencyContactPhone'],
                where: { id },
            });
        });
    });

    describe('Save emergency contact by account id', () => {
        it('Should save emergency contact by id successfully', async () => {
            //given
            const id = 'accountId';
            const updateDTO = { emergencyContactName: 'ila', emergencyContactPhone: '0310' };

            //when
            await service.saveEmergencyContact(id, updateDTO);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledWith(
                {
                    emergencyContactName: updateDTO.emergencyContactName,
                    emergencyContactPhone: updateDTO.emergencyContactPhone,
                },
                { where: { id } }
            );
        });
    });

    describe('Save interception categories by account id', () => {
        it('Should save emergency contact by id successfully', async () => {
            //given
            const id = 'accountId';
            const updateDTO = { interceptionCategories: ['a1', 'b1'] };

            //when
            await service.saveInterceptionCategories(id, updateDTO);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledTimes(1);
            const expectedCategories = updateDTO.interceptionCategories.map((cat) => cat.toUpperCase());
            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledWith({ interceptionCategories: expectedCategories }, { where: { id: id } });
        });
    });

    describe('Find interception categories by account id', () => {
        it('Should fetch interception categories by id successfully', async () => {
            //given
            const id = 'accountId';

            //when
            await service.getInterceptionCategories(id);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith({
                attributes: ['interceptionCategories'],
                where: { id },
            });
        });
    });

    describe('Find on-boarding status by account id', () => {
        it('Should fetch on-boarding status by id successfully', async () => {
            //given
            const id = 'accountId';

            //when
            await service.getOnBoardingStatus(id);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { id: id } });
        });
    });

    describe('Update on-boarding status by account id', () => {
        it('Should update on-boarding status by id successfully', async () => {
            //given
            const id = 'accountId';
            const updateDTO = { onBoardingStatus: Statuses.COMPLETED };
            Fixture.getStatusService.findByStatus.mockResolvedValue({ id: Statuses.COMPLETED });

            //when
            await service.updateOnBoardingStatus(id, updateDTO);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledWith({ onBoardingStatusId: Statuses.COMPLETED }, { where: { id } });
        });
    });
});
