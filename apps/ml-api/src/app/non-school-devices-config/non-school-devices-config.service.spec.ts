import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from '../logger/logging.service';
import { QueryTypes } from 'sequelize';
import { NonSchoolDevicesConfigService } from './non-school-devices-config.service';
import { ACCOUNT_REPOSITORY, NON_SCHOOL_DEVICES_CONFIG_REPOSITORY } from '../constants';
import { QueryException } from '../error/common.exception';
import { HttpStatus } from '@nestjs/common';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static getLoggingService() {
        return {
            className: Fixture.getMock(),
            debug: Fixture.getMock(),
            info: Fixture.getMock(),
            error: Fixture.getMock(),
        };
    }

    static NON_SCHOOL_DEVICES_CONFIG_REPOSITORY = class {
        static destroy = Fixture.getMock();
        static bulkCreate = Fixture.getMock();
        static findOne = Fixture.getMock();
    };

    static ACCOUNT_REPOSITORY = class {
        static findOne = Fixture.getMock();
        static update = Fixture.getMock();
    };

    static Sequelize = class {
        static transaction = Fixture.getMock().mockResolvedValue({
            commit: jest.fn(),
            rollback: jest.fn(),
        });
    };
}

describe('Non school devices config service test', () => {
    let service: NonSchoolDevicesConfigService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NonSchoolDevicesConfigService,
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
                {
                    provide: 'NON_SCHOOL_DEVICES_CONFIG_REPOSITORY',
                    useValue: Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY,
                },
                {
                    provide: 'ACCOUNT_REPOSITORY',
                    useValue: Fixture.ACCOUNT_REPOSITORY,
                },
                {
                    provide: 'SEQUELIZE',
                    useValue: Fixture.Sequelize,
                },
            ],
        }).compile();

        service = module.get<NonSchoolDevicesConfigService>(NonSchoolDevicesConfigService);
    });

    describe('Find extension status', () => {
        it('Should fetch extension status', async () => {
            //given
            const accountId = 'accountId';
            const findOptions = {
                attributes: ['enableExtension'],
                where: { id: accountId },
            };

            //when
            await service.findExtensionStatus(accountId);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith(findOptions);
        });
    });

    describe('Update extension status', () => {
        it('Should update extension status', async () => {
            //given
            const accountId = 'accountId';
            const enableExtension = true;

            //when
            await service.updateExtensionStatus(accountId, enableExtension);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.update).toHaveBeenCalledWith({ enableExtension }, { where: { id: accountId } });
        });
    });

    describe('Update exempted emails', () => {
        it('Should update exempted emails', async () => {
            //given
            const accountId = 'accountId';
            const dto = {
                emails: ['a.com', 'b.com'],
            };

            //when
            await service.updateExemptedEmails(accountId, dto);

            //then
            expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
            expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.destroy).toHaveBeenCalledWith({ where: { accountId } });
            expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.bulkCreate).toHaveBeenCalledTimes(1);
            const exemptedEmails = dto.emails.map((email) => {
                return { email, accountId };
            });
            expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.bulkCreate).toHaveBeenCalledWith(exemptedEmails);
        });

        it('Should throw exception when delete is not successful', async () => {
            //given
            const accountId = 'accountId';
            const dto = {
                emails: ['a.com', 'b.com'],
            };
            const error = 'Error';
            Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.destroy.mockRejectedValueOnce(error);

            try {
                //when
                await service.updateExemptedEmails(accountId, dto);
            } catch (e) {
                //then
                expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
                expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.destroy).toHaveBeenCalledWith({ where: { accountId } });
                expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.bulkCreate).toHaveBeenCalledTimes(0);

                expect(e).toBeInstanceOf(QueryException);
                expect(e.message).toBe(QueryException.bulkCreate());
                expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    });

    describe('Check status', () => {
        it('Should return status as true if extension is enabled', async () => {
            //given
            const accountId = 'accountId';
            const email = 'a.com';
            const findOptions = {
                attributes: ['enableExtension'],
                where: { id: accountId },
            };
            Fixture.ACCOUNT_REPOSITORY.findOne.mockResolvedValueOnce({ enableExtension: true });

            //when
            const response = await service.checkStatus(accountId, email);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith(findOptions);
            expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.findOne).toHaveBeenCalledTimes(0);
            expect(response).toBeTruthy();
            expect(response).toEqual({ status: true });
        });

        it('Should return status as false if extension is disabled and user is not exempted', async () => {
            //given
            const accountId = 'accountId';
            const email = 'a.com';
            const findOptions = {
                attributes: ['enableExtension'],
                where: { id: accountId },
            };
            Fixture.ACCOUNT_REPOSITORY.findOne.mockResolvedValueOnce({ enableExtension: false });
            Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.findOne.mockResolvedValueOnce(null);

            //when
            const response = await service.checkStatus(accountId, email);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith(findOptions);
            expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.findOne).toHaveBeenCalledWith({
                where: { accountId, email },
            });
            expect(response).toBeTruthy();
            expect(response).toEqual({ status: false });
        });

        it('Should return status as true if extension is disabled but user is exempted', async () => {
            //given
            const accountId = 'accountId';
            const email = 'a.com';
            const findOptions = {
                attributes: ['enableExtension'],
                where: { id: accountId },
            };
            Fixture.ACCOUNT_REPOSITORY.findOne.mockResolvedValueOnce({ enableExtension: false });
            Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.findOne.mockResolvedValueOnce({ email });

            //when
            const response = await service.checkStatus(accountId, email);

            //then
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith(findOptions);
            expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.NON_SCHOOL_DEVICES_CONFIG_REPOSITORY.findOne).toHaveBeenCalledWith({
                where: { accountId, email },
            });
            expect(response).toBeTruthy();
            expect(response).toEqual({ status: true });
        });
    });
});
