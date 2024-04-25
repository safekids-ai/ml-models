import { Test, TestingModule } from '@nestjs/testing';
import { QueryTypes } from 'sequelize';
import { FilteredProcessService } from './filtered-process.service';
import { LoggingService } from '../logger/logging.service';
import { FilteredProcess } from './entities/filtered-process.entity';
import { CreateFilteredProcessDto } from './dto/create-filtered-process.dto';
import { QueryException } from '../error/common.exception';
import { HttpStatus } from '@nestjs/common';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static FILTERED_PROCESS_REPOSITORY = class {
        static findFilteredProcess = Fixture.getMock();
        static createFilteredProcess = Fixture.getMock();
        static findAllByOrgUnitId = Fixture.getMock();
        static create = Fixture.getMock();
        static bulkCreate = Fixture.getMock();
        static update = Fixture.getMock();
        static findAll = Fixture.getMock();
        static destroy = Fixture.getMock();
        static sequelize = { query: jest.fn() };
    };

    static ORG_UNIT_REPOSITORY = class {
        static findKidsOrgUnits = Fixture.getMock();
        static findOne = Fixture.getMock();
        static findAll = Fixture.getMock();
    };

    static Sequelize = class {
        static transaction = Fixture.getMock().mockResolvedValue({
            commit: jest.fn(),
            rollback: jest.fn(),
        });
    };

    static getLoggingService() {
        return {
            className: Fixture.getMock(),
            debug: Fixture.getMock(),
            info: Fixture.getMock(),
            error: Fixture.getMock(),
        };
    }
}

describe.skip('Filtered process service test', () => {
    let service: FilteredProcessService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FilteredProcessService,
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
                {
                    provide: 'FILTERED_PROCESS_REPOSITORY',
                    useValue: Fixture.FILTERED_PROCESS_REPOSITORY,
                },
                {
                    provide: 'ORG_UNIT_REPOSITORY',
                    useValue: Fixture.ORG_UNIT_REPOSITORY,
                },
                {
                    provide: 'SEQUELIZE',
                    useValue: Fixture.Sequelize,
                },
            ],
        }).compile();

        service = module.get<FilteredProcessService>(FilteredProcessService);
    });

    it('Should find filtered processes for org units', async () => {
        //given
        const accountId = 'accountId';
        const orgUnits = [
            { id: 'id', name: 'name' },
            { id: 'id1', name: 'name1' },
        ];

        //mock dependencies
        Fixture.ORG_UNIT_REPOSITORY.findKidsOrgUnits.mockResolvedValueOnce(accountId);
        Fixture.FILTERED_PROCESS_REPOSITORY.findAllByOrgUnitId.mockResolvedValueOnce([]);

        //when
        await service.findFilteredProcess(accountId);

        //then
        expect(Fixture.ORG_UNIT_REPOSITORY.findKidsOrgUnits).toHaveBeenCalledTimes(1);
        expect(Fixture.FILTERED_PROCESS_REPOSITORY.findAllByOrgUnitId).toHaveBeenCalledTimes(1);
    });

    it('Should create filtered processes for org units', async () => {
        //given
        const accountId = 'accId';
        const orgUnitId1 = 'f60ccea1-3594-42b1-ac0f-ce2bf471ae1b';
        const orgUnitProcesses = {
            id: orgUnitId1,
            name: 'kid 1',
            processes: [
                {
                    name: 'www.facebook.com',
                    isAllowed: true,
                },
            ],
        };

        //mocks

        //when
        await service.createFilteredProcess(accountId, orgUnitProcesses);

        //then
        expect(Fixture.FILTERED_PROCESS_REPOSITORY.bulkCreate).toHaveBeenCalledTimes(1);
        expect(Fixture.FILTERED_PROCESS_REPOSITORY.bulkCreate).toHaveBeenCalledWith(orgUnitProcesses);
    });

    it('Should create filtered process', async () => {
        //given
        const obj = { id: 'id', name: 'name', orgUnitId: '1', accountId: '2', isAllowed: true } as CreateFilteredProcessDto;

        //when
        await service.create(obj);

        //then
        expect(Fixture.FILTERED_PROCESS_REPOSITORY.create).toHaveBeenCalledTimes(1);
        expect(Fixture.FILTERED_PROCESS_REPOSITORY.create).toHaveBeenCalledWith(obj);
    });

    it('Should create filtered process in bulk', async () => {
        //given
        const obj = [{ id: 'id', name: 'name', orgUnitId: '1', accountId: '2', isAllowed: true }] as CreateFilteredProcessDto[];

        //when
        await service.createBulk(obj);

        //then
        expect(Fixture.FILTERED_PROCESS_REPOSITORY.bulkCreate).toHaveBeenCalledTimes(1);
        expect(Fixture.FILTERED_PROCESS_REPOSITORY.bulkCreate).toHaveBeenCalledWith(obj);
    });

    it('Should throw exception if error occurs when create filtered process in bulk', async () => {
        //given
        const obj = [{ id: 'id', name: 'name', orgUnitId: '1', accountId: '2', isAllowed: true }] as CreateFilteredProcessDto[];

        //mock dependencies
        Fixture.FILTERED_PROCESS_REPOSITORY.bulkCreate.mockImplementationOnce(async () => {
            throw new QueryException(QueryException.bulkCreate());
        });

        //when
        service.createBulk(obj).catch((e) => {
            //then
            expect(Fixture.FILTERED_PROCESS_REPOSITORY.bulkCreate).toHaveBeenCalledTimes(1);
            expect(e).toBeInstanceOf(QueryException);
            expect(e.message).toBe(QueryException.bulkCreate());
            expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });

    it('Should update filtered process', async () => {
        //given
        const id = '1';
        const obj = { isAllowed: true };

        //when
        await service.update(id, obj);

        //then
        expect(Fixture.FILTERED_PROCESS_REPOSITORY.update).toHaveBeenCalledTimes(1);
        expect(Fixture.FILTERED_PROCESS_REPOSITORY.update).toHaveBeenCalledWith(obj, { where: { id: id } });
    });

    describe('Find all processes', () => {
        it('Should find all processes by orgUnitId and accountId', async () => {
            //when
            const orgUnitId = 'orgUnitId';
            const accountId = 'accountId';
            await service.findAllByOrgUnitId(orgUnitId, accountId);

            //then
            expect(Fixture.FILTERED_PROCESS_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
            expect(Fixture.FILTERED_PROCESS_REPOSITORY.findAll).toHaveBeenCalledWith({ where: { orgUnitId, accountId } });
        });
    });

    describe('Delete processes by org unit ids', () => {
        it('Should delete processes by org unit ids', async () => {
            //given
            const orgUnitId = ['1', '2', '3'];

            //when
            await service.deleteAll(orgUnitId);

            //then
            expect(Fixture.FILTERED_PROCESS_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
            expect(Fixture.FILTERED_PROCESS_REPOSITORY.destroy).toHaveBeenCalledWith({ where: { orgUnitId } });
        });
        it('Should throw exception if error occurs when deleting filtered process by org units', async () => {
            //given
            const orgUnitIds = ['1', '2', '3'];

            //mock dependencies
            Fixture.FILTERED_PROCESS_REPOSITORY.destroy.mockImplementationOnce(async () => {
                throw new QueryException(QueryException.delete());
            });

            //when
            service.deleteAll(orgUnitIds).catch((e) => {
                //then
                expect(Fixture.FILTERED_PROCESS_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
                expect(e).toBeInstanceOf(QueryException);
                expect(e.message).toBe(QueryException.delete());
                expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    });

    describe('Delete process by id', () => {
        it('Should delete process by id', async () => {
            //given
            const id = '3';

            //when
            await service.delete(id);

            //then
            expect(Fixture.FILTERED_PROCESS_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
            expect(Fixture.FILTERED_PROCESS_REPOSITORY.destroy).toHaveBeenCalledWith({ where: { id } });
        });
        it('Should throw exception if error occurs when deleting filtered process', async () => {
            //given
            const id = '1';

            //mock dependencies
            Fixture.FILTERED_PROCESS_REPOSITORY.destroy.mockImplementationOnce(async () => {
                throw new QueryException(QueryException.delete());
            });

            //when
            service.delete(id).catch((e) => {
                //then
                expect(Fixture.FILTERED_PROCESS_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
                expect(e).toBeInstanceOf(QueryException);
                expect(e.message).toBe(QueryException.delete());
                expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    });
});
