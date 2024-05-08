import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from '../logger/logging.service';
import { AuthTokenService } from './auth-token.service';
import { GoogleApiService } from '../google-apis/google.apis.service';
import { CreateAuthTokenDto } from './dto/create-auth-token.dto';
import { QueryTypes } from 'sequelize';
import { AuthToken } from './entities/auth-token.entity';

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

    static getGoogleApiService = class {
        static fetchOneUser = Fixture.getMock();
    };

    static USER_AUTH_TOKEN_REPOSITORY = class {
        static create = Fixture.getMock();
        static update = Fixture.getMock();
        static destroy = Fixture.getMock();
        static bulkCreate = Fixture.getMock();
        static findOne = Fixture.getMock();
        static sequelize = { query: jest.fn() };
    };
}

describe('Auth token service test', () => {
    let service: AuthTokenService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthTokenService,
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
                {
                    provide: GoogleApiService,
                    useValue: Fixture.getGoogleApiService,
                },
                {
                    provide: 'USER_AUTHTOKEN_REPOSITORY',
                    useValue: Fixture.USER_AUTH_TOKEN_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<AuthTokenService>(AuthTokenService);
    });

    describe('Create auth token', () => {
        it('Should create auth token', async () => {
            //given
            const authTokenDTO = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                expiresAt: new Date(),
                userId: 'userId',
            } as CreateAuthTokenDto;

            //when
            await service.create(authTokenDTO);

            //then
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.create).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.create).toHaveBeenCalledWith(expect.objectContaining(authTokenDTO));
        });
    });

    describe('Find auth token by user id', () => {
        it('Should find auth token by user id', async () => {
            //given
            const userId = 'userId';

            //when
            await service.findByUserId(userId);

            //then
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { userId: userId } });
        });
    });

    describe('Find auth token by user id decrypted', () => {
        it('Should find auth token by user id decrypted', async () => {
            //given
            const userId = 'userId';

            //when
            await service.findByUserId(userId);

            //then
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { userId: userId } });
        });
    });

    describe('Update auth token', () => {
        it('Should update auth token', async () => {
            //given
            const id = 'id';
            const authTokenDTO = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                userId: 'userId',
            } as CreateAuthTokenDto;

            //when
            await service.update(id, authTokenDTO);

            //then
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.update).toHaveBeenCalledWith(expect.objectContaining(authTokenDTO), { where: { id } });
        });
    });

    describe('Delete auth tokens by user ids', () => {
        it('Should delete auth tokens by user ids', async () => {
            //given
            const ids = ['1', '2', '3'];

            //when
            await service.deleteAll(ids);

            //then
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.destroy).toHaveBeenCalledWith({ where: { userId: ids } });
        });
    });

    describe('Upsert auth token by user id', () => {
        it('Should update auth token by id if already exists', async () => {
            //given
            const existingAuthId = 'id';
            const authTokenDTO = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                userId: 'userId',
            } as CreateAuthTokenDto;

            //mock dependencies
            Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne.mockResolvedValueOnce({ id: existingAuthId });

            //when
            await service.upsert(authTokenDTO);

            //then
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { userId: authTokenDTO.userId } });

            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.update).toHaveBeenCalledWith(expect.objectContaining(authTokenDTO), { where: { id: existingAuthId } });
        });

        it('Should add auth token by id if not already exists', async () => {
            //given
            const authTokenDTO = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                userId: 'userId',
            } as CreateAuthTokenDto;

            //mock dependencies
            Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne.mockResolvedValueOnce(null);

            //when
            await service.upsert(authTokenDTO);

            //then
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne).toHaveBeenCalledTimes(2);
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.findOne).toHaveBeenCalledWith({ where: { userId: authTokenDTO.userId } });

            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.create).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.create).toHaveBeenCalledWith(expect.objectContaining(authTokenDTO));
        });
    });

    describe('Find auth tokens by primary domain', () => {
        it('Should find auth token by primary domain if already exists', async () => {
            //given
            const existingAuthId = 'id';
            const primaryDomain = 'gmail.com';

            //mock dependencies
            const expectedToken = { id: existingAuthId };
            Fixture.USER_AUTH_TOKEN_REPOSITORY.sequelize.query.mockResolvedValueOnce([expectedToken]);
            Fixture.getGoogleApiService.fetchOneUser.mockResolvedValueOnce({});

            //when
            const token = await service.findTokenByPrimaryDomain(primaryDomain);

            //then
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.sequelize.query).toHaveBeenCalledTimes(1);
            const query =
                'select token.id, token.access_token, token.refresh_token, token.user_id ' +
                ' from auth_token token ' +
                ' inner join user u on ' +
                ' u.id = token.user_id ' +
                ' and u.is_admin = true ' +
                ' inner join account a on ' +
                ' u.account_id = a.id ' +
                ' where ' +
                ' ((a.primary_domain = :primaryDomain) OR ' +
                " (POSITION(CONCAT('.',a.primary_domain) IN :primaryDomain) > 0 and a.account_type_id = 'SCHOOL') ) ";
            const queryOptions = {
                replacements: { primaryDomain },
                type: QueryTypes.SELECT,
                mapToModel: true,
                model: AuthToken,
            };
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.sequelize.query).toHaveBeenCalledWith(query, queryOptions);

            expect(Fixture.getGoogleApiService.fetchOneUser).toHaveBeenCalledTimes(1);
            expect(Fixture.getGoogleApiService.fetchOneUser).toHaveBeenCalledWith(expectedToken);
            expect(token).toBe(expectedToken);
        });

        it('Should return null if no auth token by primary domain exists', async () => {
            //given
            const primaryDomain = 'gmail.com';

            //mock dependencies
            Fixture.USER_AUTH_TOKEN_REPOSITORY.sequelize.query.mockResolvedValueOnce([]);

            //when
            const res = await service.findTokenByPrimaryDomain(primaryDomain);

            //then
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.sequelize.query).toHaveBeenCalledTimes(1);
            const query =
                'select token.id, token.access_token, token.refresh_token, token.user_id ' +
                ' from auth_token token ' +
                ' inner join user u on ' +
                ' u.id = token.user_id ' +
                ' and u.is_admin = true ' +
                ' inner join account a on ' +
                ' u.account_id = a.id ' +
                ' where  ((a.primary_domain = :primaryDomain) OR ' +
                " (POSITION(CONCAT('.',a.primary_domain) IN :primaryDomain) > 0 and a.account_type_id = 'SCHOOL') ) ";
            const queryOptions = {
                replacements: { primaryDomain },
                type: QueryTypes.SELECT,
                mapToModel: true,
                model: AuthToken,
            };
            expect(Fixture.USER_AUTH_TOKEN_REPOSITORY.sequelize.query).toHaveBeenCalledWith(query, queryOptions);

            expect(Fixture.getGoogleApiService.fetchOneUser).toHaveBeenCalledTimes(0);
            expect(res).toBe(null);
        });
    });
});
