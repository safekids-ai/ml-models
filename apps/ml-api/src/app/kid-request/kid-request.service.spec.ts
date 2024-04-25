import { Test, TestingModule } from '@nestjs/testing';
import { QueryTypes } from 'sequelize';
import { LoggingService } from '../logger/logging.service';
import { KidRequestService } from './kid-request.service';
import { CategoryStatus } from '../category/category.status';
import { QueryException, ValidationException } from '../error/common.exception';
import { HttpStatus } from '@nestjs/common';
import { KidRequest } from './domain/kid-request.entity';
import { JwtTokenService } from '../auth/jwtToken/jwt.token.service';
import { FilteredUrlService } from '../filtered-url/filtered-url.service';
import { FilteredUrlErrors } from '../filtered-url/filtered-url.errors';
import { KidRequestDto, KidRequestTypes } from './domain/kid-request-dto';
import { UserErrors } from '../consumer/user/users.errors';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static KID_REQUEST_REPOSITORY = class {
        static create = Fixture.getMock();
        static update = Fixture.getMock();
        static findAll = Fixture.getMock();
        static destroy = Fixture.getMock();

        static bulkCreate = Fixture.getMock();
        static sequelize = { query: jest.fn() };
    };
    static USER_REPOSITORY = class {
        static update = Fixture.getMock();
        static findOne = Fixture.getMock();
    };

    static ORG_UNIT_REPOSITORY = class {
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

    static getJwtTokenService = class {
        static generateRegistrationToken = Fixture.getMock();
        static verifyToken = Fixture.getMock();
    };
    static getFilteredUrlService = class {
        static findOne = Fixture.getMock();
        static update = Fixture.getMock();
        static create = Fixture.getMock();
    };

    static getAccessRequest() {
        return {
            kidId: '0a4704ea-0e22-4386-b7ba-c7b902159ca1',
            requests: ['https://www.facebook.com/', 'https://www.chess.com/'],
        };
    }
}

describe('Kid request service test', () => {
    let service: KidRequestService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KidRequestService,
                {
                    provide: 'KID_REQUEST_REPOSITORY',
                    useValue: Fixture.KID_REQUEST_REPOSITORY,
                },
                {
                    provide: 'USER_REPOSITORY',
                    useValue: Fixture.USER_REPOSITORY,
                },
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
                {
                    provide: 'SEQUELIZE',
                    useValue: Fixture.Sequelize,
                },
                {
                    provide: JwtTokenService,
                    useValue: Fixture.getJwtTokenService,
                },
                {
                    provide: FilteredUrlService,
                    useValue: Fixture.getFilteredUrlService,
                },
            ],
        }).compile();

        service = module.get<KidRequestService>(KidRequestService);
    });

    it('Should create request', async () => {
        //given
        const obj: KidRequestDto = {
            id: 'id',
            url: 'url',
            categoryId: '1',
            kidId: '2',
            userId: 'userId',
            status: CategoryStatus.ASK,
            ai: false,
            type: KidRequestTypes.INFORM,
        };

        //when
        await service.create(obj);

        //then
        expect(Fixture.KID_REQUEST_REPOSITORY.create).toHaveBeenCalledTimes(1);
        expect(Fixture.KID_REQUEST_REPOSITORY.create).toHaveBeenCalledWith(obj);
    });

    it('Should throw exception when create request', async () => {
        //given
        const obj: KidRequestDto = {
            id: 'id',
            url: 'url',
            categoryId: '1',
            kidId: '2',
            userId: 'userId',
            status: CategoryStatus.ASK,
            ai: false,
            type: KidRequestTypes.INFORM,
        };

        //mock dependencies
        jest.spyOn(Fixture.KID_REQUEST_REPOSITORY, 'create').mockImplementationOnce(async () => {
            throw new QueryException(QueryException.save());
        });

        //when
        service.create(obj).catch((e) => {
            //then
            expect(Fixture.KID_REQUEST_REPOSITORY.create).toHaveBeenCalledTimes(1);
            expect(Fixture.KID_REQUEST_REPOSITORY.create).toHaveBeenCalledWith(obj);

            expect(e).toBeInstanceOf(QueryException);
            expect(e.message).toBe(QueryException.save());
            expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });

    describe('Update request', () => {
        it('Should enable url if its disabled', async () => {
            //given
            const accountId = '1';
            const token = JSON.stringify({ orgUnitId: 'id' });
            const accessGranted = true;

            //mock dependencies
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: false, id: 'id' }]);
            Fixture.getJwtTokenService.verifyToken.mockResolvedValueOnce({ kidId: 'kidId', url: 'url', orgUnitId: 'id', id: 'requestId' });

            //when
            const response = await service.update(accountId, token);
            //then
            expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledTimes(1);
            expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledWith(token);

            expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledWith('id', 'url');

            expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledWith({ accessGranted }, { where: { kidId: 'kidId', url: 'url' } });

            expect(Fixture.getFilteredUrlService.update).toHaveBeenCalledTimes(1);
            expect(Fixture.getFilteredUrlService.update).toHaveBeenCalledWith('id', { enabled: true });

            expect(response).toEqual({ message: `Website added to allowed websites list <url>`, orgUnitId: JSON.parse(token).orgUnitId });
        });
        it('Should throw exception if error occurs when updating request', async () => {
            //given
            const accountId = '1';
            const token = '1';

            //mock dependencies
            Fixture.getJwtTokenService.verifyToken.mockImplementationOnce(async () => {
                throw new QueryException(QueryException.update());
            });

            //when
            service.update(accountId, token).catch((e) => {
                //then
                expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledTimes(1);
                expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledWith(token);

                expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledTimes(0);

                expect(e).toBeInstanceOf(QueryException);
                expect(e.message).toBe(QueryException.update());
                expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
        it('Should throw exception if error occurs when updating request', async () => {
            //given
            const accountId = '1';
            const token = '1';

            //mock dependencies
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: true, id: 'id' }]);
            Fixture.getJwtTokenService.verifyToken.mockResolvedValueOnce({ url: 'url', orgUnitId: 'id', id: 'requestId' });

            //when
            service.update(accountId, token).catch((e) => {
                //then
                expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledTimes(1);
                expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledWith(token);

                expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledTimes(1);

                expect(e).toBeInstanceOf(ValidationException);
                expect(e.message).toBe(FilteredUrlErrors.alreadyExists('url'));
                expect(e.status).toBe(HttpStatus.CONFLICT);
            });
        });
    });

    it('Should find one request', async () => {
        //given
        let url = '1';
        const kidId = 'kidId';

        //when
        await service.findOne(url, kidId);

        //then
        const query = `select fu.id, fu.access_granted from kid_request fu where fu.kid_id = :kidId and fu.url LIKE :url and fu.access_granted = false`;
        url = `%${url}%`;
        const queryOptions = {
            replacements: { url, kidId },
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: KidRequest,
        };
        expect(Fixture.KID_REQUEST_REPOSITORY.sequelize.query).toHaveBeenCalledTimes(1);
        expect(Fixture.KID_REQUEST_REPOSITORY.sequelize.query).toHaveBeenCalledWith(query, queryOptions);
    });

    it('Should update access granted', async () => {
        //given
        const kidId = 'kidId';
        const url = 'url';
        const accessGranted = true;

        //when
        await service.updateAccessGranted(kidId, url, accessGranted);

        //then
        expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(1);
        expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledWith({ accessGranted }, { where: { kidId, url } });
    });

    describe('Clear access limit', () => {
        it('Should clear access limit', async () => {
            //given
            const token = 'token';
            const userId = 'userId';

            //mock dependencies
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ firstName: 'firstName', lastName: 'lastName', accessLimited: true });
            Fixture.getJwtTokenService.verifyToken.mockResolvedValueOnce({ userId });

            //when
            const response = await service.clearAccessLimit(token);
            //then
            expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledTimes(1);
            expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledWith(token);

            expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { id: userId } });

            expect(Fixture.USER_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_REPOSITORY.update).toHaveBeenCalledWith({ accessLimited: false }, { where: { id: userId } });

            expect(response).toEqual({ message: `The access limit for firstName lastName has been cleared` });
        });
        it('Should throw exception if kid does not exists', async () => {
            const token = 'token';
            const userId = 'userId';

            //mock dependencies
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce(null);
            Fixture.getJwtTokenService.verifyToken.mockResolvedValueOnce({ userId });

            //when
            service.clearAccessLimit(token).catch((e) => {
                //then
                expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledTimes(1);
                expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledWith(token);

                expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
                expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { id: userId } });

                expect(Fixture.USER_REPOSITORY.update).toHaveBeenCalledTimes(0);

                expect(e).toBeInstanceOf(ValidationException);
                expect(e.message).toBe(UserErrors.notFound(userId));
                expect(e.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        it.skip('Should throw exception if access already cleared', async () => {
            const token = 'token';
            const userId = 'userId';

            //mock dependencies
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ firstName: 'firstName', lastName: 'lastName', accessLimited: false });
            Fixture.getJwtTokenService.verifyToken.mockResolvedValueOnce({ userId });

            //when
            service.clearAccessLimit(token).catch((e) => {
                //then
                expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledTimes(1);
                expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledWith(token);

                expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
                expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { id: userId } });

                expect(Fixture.USER_REPOSITORY.update).toHaveBeenCalledTimes(0);

                expect(e).toBeInstanceOf(ValidationException);
                expect(e.message).toBe(UserErrors.accessLimitAlreadyCleared('firstName lastName'));
                expect(e.status).toBe(HttpStatus.CONFLICT);
            });
        });
        it('Should throw exception if error occurs when updating access limit', async () => {
            const token = 'token';

            //mock dependencies
            Fixture.getJwtTokenService.verifyToken.mockImplementationOnce(async () => {
                throw new QueryException(QueryException.update());
            });

            //when
            service.clearAccessLimit(token).catch((e) => {
                //then
                expect(Fixture.getJwtTokenService.verifyToken).toHaveBeenCalledTimes(1);
                expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledTimes(0);

                expect(e).toBeInstanceOf(QueryException);
                expect(e.message).toBe(QueryException.update());
                expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    });

    it('Should delete kids by ids', async () => {
        //given
        const kidIds = ['1'];

        //when
        await service.deleteByKidIds(kidIds);

        //then
        expect(Fixture.KID_REQUEST_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
        expect(Fixture.KID_REQUEST_REPOSITORY.destroy).toHaveBeenCalledWith({ where: { kidId: kidIds } });
    });

    it('Should throw exception when delete kids', async () => {
        //given
        const kidIds = ['1'];

        //mock dependencies
        jest.spyOn(Fixture.KID_REQUEST_REPOSITORY, 'destroy').mockImplementationOnce(async () => {
            throw new QueryException(QueryException.delete());
        });

        //when
        service.deleteByKidIds(kidIds).catch((e) => {
            //then
            expect(Fixture.KID_REQUEST_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
            expect(Fixture.KID_REQUEST_REPOSITORY.destroy).toHaveBeenCalledWith({ where: { kidId: kidIds } });

            expect(e).toBeInstanceOf(QueryException);
            expect(e.message).toBe(QueryException.delete());
            expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });

    it('Should find all kids with access granted as false', async () => {
        //given
        const kidId = '1';

        //when
        await service.findAskRequests(kidId);

        //then
        expect(Fixture.KID_REQUEST_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
    });

    it('Should update date only', async () => {
        //given
        const id = '1';

        //when
        await service.updateDate(id, new Date());

        //then
        expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(1);
    });

    describe('Update all or some access requests', () => {
        it('Should update access only if url is enabled', async () => {
            //given
            const accountId = '1';
            const accessRequest = Fixture.getAccessRequest();
            const orgUnitId = 'id';

            //mock dependencies
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: true, id: 'id' }]);
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: true, id: 'id' }]);
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ orgUnitId });

            //when
            await service.updateAccessRequests(accountId, accessRequest);

            //then
            expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(2);
        });
        it('Should update access and url to enabled if url is disabled', async () => {
            //given
            const accountId = '1';
            const accessRequest = Fixture.getAccessRequest();
            const orgUnitId = 'id';

            //mock dependencies
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: false, id: 'id' }]);
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: false, id: 'id' }]);
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ orgUnitId });

            //when
            await service.updateAccessRequests(accountId, accessRequest);

            //then
            expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(2);
            expect(Fixture.getFilteredUrlService.update).toHaveBeenCalledTimes(2);
        });
        it('Should update access and create url if url does not exists', async () => {
            //given
            const accountId = '1';
            const accessRequest = Fixture.getAccessRequest();
            const orgUnitId = 'id';

            //mock dependencies
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([]);
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([]);
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ orgUnitId });

            //when
            await service.updateAccessRequests(accountId, accessRequest);

            //then
            expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(2);
            expect(Fixture.getFilteredUrlService.update).toHaveBeenCalledTimes(0);
            expect(Fixture.getFilteredUrlService.create).toHaveBeenCalledTimes(2);
        });
        it('Should throw exception if error occurs when updating request', async () => {
            //given
            const accountId = '1';
            const accessRequest = Fixture.getAccessRequest();

            //mock dependencies
            jest.spyOn(Fixture.USER_REPOSITORY, 'findOne').mockImplementationOnce(async () => {
                throw new QueryException(QueryException.update());
            });

            //when
            service.updateAccessRequests(accountId, accessRequest).catch((e) => {
                //then
                expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledTimes(1);

                expect(e).toBeInstanceOf(QueryException);
                expect(e.message).toBe(QueryException.update());
                expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    });

    it('Should find all kids with access granted as false', async () => {
        //given
        const kidId = '1';

        //when
        await service.findAskRequests(kidId);

        //then
        expect(Fixture.KID_REQUEST_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
    });

    it('Should update date only', async () => {
        //given
        const id = '1';

        //when
        await service.updateDate(id, new Date());

        //then
        expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(1);
    });

    describe('Update all or some access requests', () => {
        it('Should update access only if url is enabled', async () => {
            //given
            const accountId = '1';
            const accessRequest = Fixture.getAccessRequest();
            const orgUnitId = 'id';

            //mock dependencies
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: true, id: 'id' }]);
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: true, id: 'id' }]);
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ orgUnitId });

            //when
            await service.updateAccessRequests(accountId, accessRequest);

            //then
            expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(2);
        });
        it('Should update access and url to enabled if url is disabled', async () => {
            //given
            const accountId = '1';
            const accessRequest = Fixture.getAccessRequest();
            const orgUnitId = 'id';

            //mock dependencies
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: false, id: 'id' }]);
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([{ enabled: false, id: 'id' }]);
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ orgUnitId });

            //when
            await service.updateAccessRequests(accountId, accessRequest);

            //then
            expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(2);
            expect(Fixture.getFilteredUrlService.update).toHaveBeenCalledTimes(2);
        });
        it('Should update access and create url if url does not exists', async () => {
            //given
            const accountId = '1';
            const accessRequest = Fixture.getAccessRequest();
            const orgUnitId = 'id';

            //mock dependencies
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([]);
            Fixture.getFilteredUrlService.findOne.mockResolvedValueOnce([]);
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ orgUnitId });

            //when
            await service.updateAccessRequests(accountId, accessRequest);

            //then
            expect(Fixture.getFilteredUrlService.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.KID_REQUEST_REPOSITORY.update).toHaveBeenCalledTimes(2);
            expect(Fixture.getFilteredUrlService.update).toHaveBeenCalledTimes(0);
            expect(Fixture.getFilteredUrlService.create).toHaveBeenCalledTimes(2);
        });
        it('Should throw exception if error occurs when updating request', async () => {
            //given
            const accountId = '1';
            const accessRequest = Fixture.getAccessRequest();

            //mock dependencies
            jest.spyOn(Fixture.USER_REPOSITORY, 'findOne').mockImplementationOnce(async () => {
                throw new QueryException(QueryException.update());
            });

            //when
            service.updateAccessRequests(accountId, accessRequest).catch((e) => {
                //then
                expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledTimes(1);

                expect(e).toBeInstanceOf(QueryException);
                expect(e.message).toBe(QueryException.update());
                expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    });
});
