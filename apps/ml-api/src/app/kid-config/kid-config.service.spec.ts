import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from '../logger/logging.service';
import { KidConfigService } from './kid-config.service';
import { QueryException, ValidationException } from '../error/common.exception';
import { UserErrors } from '../consumer/user/users.errors';
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

    static KID_CONFIG_REPOSITORY = class {
        static create = Fixture.getMock();
        static destroy = Fixture.getMock();
        static findOne = Fixture.getMock();
        static update = Fixture.getMock();
    };
}

describe('Kid configuration service test', () => {
    let service: KidConfigService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KidConfigService,
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
                {
                    provide: 'KID_CONFIG_REPOSITORY',
                    useValue: Fixture.KID_CONFIG_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<KidConfigService>(KidConfigService);
    });

    it('Should create kid configuration with default off time', async () => {
        //given
        const userId = 'userId';

        //when
        await service.create(userId);

        //then
        expect(Fixture.KID_CONFIG_REPOSITORY.create).toHaveBeenCalledTimes(1);
        expect(Fixture.KID_CONFIG_REPOSITORY.create).toHaveBeenCalledWith(
            expect.objectContaining({
                userId,
                offTime: '21:00',
            })
        );
    });

    it('Should throw exception when create kid configuration with default off time', async () => {
        //given
        const userId = 'userId';

        //mock dependencies
        jest.spyOn(Fixture.KID_CONFIG_REPOSITORY, 'create').mockImplementation(async () => {
            throw new QueryException(QueryException.save());
        });

        //when
        service.create(userId).catch((e) => {
            //then
            expect(Fixture.KID_CONFIG_REPOSITORY.create).toHaveBeenCalledTimes(1);
            expect(Fixture.KID_CONFIG_REPOSITORY.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId,
                    offTime: '21:00',
                })
            );
            expect(e).toBeInstanceOf(QueryException);
            expect(e.message).toBe(QueryException.save());
            expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });

    it('Should delete kid configurations by user ids', async () => {
        //given
        const userIds = ['1', '2'];

        //when
        await service.deleteByUserIds(userIds);

        //then
        expect(Fixture.KID_CONFIG_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
        expect(Fixture.KID_CONFIG_REPOSITORY.destroy).toHaveBeenCalledWith({ where: { userId: userIds } });
    });

    it('Should throw exception when delete kid configurations by user ids', async () => {
        //given
        const userIds = ['1', '2'];

        //mock dependencies
        jest.spyOn(Fixture.KID_CONFIG_REPOSITORY, 'destroy').mockImplementation(async () => {
            throw new QueryException(QueryException.delete());
        });

        //when
        service.deleteByUserIds(userIds).catch((e) => {
            //then
            expect(Fixture.KID_CONFIG_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
            expect(Fixture.KID_CONFIG_REPOSITORY.destroy).toHaveBeenCalledWith({ where: { userId: userIds } });
            expect(e).toBeInstanceOf(QueryException);
            expect(e.message).toBe(QueryException.delete());
            expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });

    it('Should update kid configuration by user id', async () => {
        //given
        const userId = '2';
        const objectToUpdate = { offTime: '8 pm' };

        //when
        await service.update(userId, objectToUpdate);

        //then
        expect(Fixture.KID_CONFIG_REPOSITORY.update).toHaveBeenCalledTimes(1);
        expect(Fixture.KID_CONFIG_REPOSITORY.update).toHaveBeenCalledWith(objectToUpdate, { where: { userId } });
    });

    it('Should throw exception when update kid configuration by user id', async () => {
        //given
        const userId = '2';
        const objectToUpdate = { offTime: '8 pm' };

        //mock dependencies
        jest.spyOn(Fixture.KID_CONFIG_REPOSITORY, 'update').mockImplementation(async () => {
            throw new QueryException(QueryException.update());
        });

        //when
        service.update(userId, objectToUpdate).catch((e) => {
            //then
            expect(Fixture.KID_CONFIG_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.KID_CONFIG_REPOSITORY.update).toHaveBeenCalledWith(objectToUpdate, { where: { userId } });
            expect(e).toBeInstanceOf(QueryException);
            expect(e.message).toBe(QueryException.update());
            expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });

    it('Should fetch kid configuration by user id', async () => {
        //given
        const userId = '2';

        //when
        await service.fetch(userId);

        //then
        expect(Fixture.KID_CONFIG_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
        expect(Fixture.KID_CONFIG_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { userId } });
    });
});
