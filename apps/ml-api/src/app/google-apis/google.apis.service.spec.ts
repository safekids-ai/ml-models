import { Test, TestingModule } from '@nestjs/testing';
import { GoogleApiService } from './google.apis.service';
import { LoggingService } from '../logger/logging.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { GoogleApisErrors } from './google-apis.errors';
import { ConfigService } from '@nestjs/config';

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

    static getConfigService = {
        get: Fixture.getMock().mockReturnValue({}),
    };
}

describe('Google Apis service test', () => {
    let service: GoogleApiService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoogleApiService,
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
                {
                    provide: ConfigService,
                    useValue: Fixture.getConfigService,
                },
            ],
        }).compile();
        service = module.get<GoogleApiService>(GoogleApiService);
    });

    describe('Get user', () => {
        it('test', async () => {});

        // it("Should throw exception if no user found", async () => {
        //
        //   //given
        //   // @ts-ignore
        //   jest.spyOn(service, "getOAuth2Client").mockResolvedValue({});
        //   jest.spyOn(service, "fetchUsers").mockResolvedValue([]);
        //
        //   try {
        //     //when
        //     await service.getUser("email");
        //   } catch (e) {
        //
        //     //then
        //     expect(e).toBeInstanceOf(NotFoundException);
        //     expect(e.message).toBe(GoogleApisErrors.noUsers());
        //     expect(e.status).toBe(HttpStatus.NOT_FOUND);
        //
        //   }
        // });
        //
        // it("Should throw exception if no matching user found", async () => {
        //
        //   //given
        //   const email = "@email.com";
        //   // @ts-ignore
        //   jest.spyOn(service, "getOAuth2Client").mockResolvedValue({});
        //   jest.spyOn(service, "fetchUsers").mockResolvedValue([{ primaryEmail: "email1" }]);
        //
        //   try {
        //     //when
        //     await service.getUser(email);
        //   } catch (e) {
        //
        //     //then
        //     expect(e).toBeInstanceOf(NotFoundException);
        //     expect(e.message).toBe(GoogleApisErrors.emailNotExists(email));
        //     expect(e.status).toBe(HttpStatus.NOT_FOUND);
        //
        //   }
        // });
        //
        // it("Should fetch user if found", async () => {
        //
        //   //given
        //   const email = "@email.com";
        //   const account = { primaryEmail: email, name: { givenName: "test", fullName: "test admin" } };
        //   // @ts-ignore
        //   jest.spyOn(service, "getOAuth2Client").mockResolvedValue({});
        //   jest.spyOn(service, "fetchUsers").mockResolvedValue([account]);
        //
        //   //when
        //   const user = await service.getUser(email);
        //   //then
        //   expect(user).toMatchObject(account)
        // });
    });
});
