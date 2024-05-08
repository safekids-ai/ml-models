import { Test, TestingModule } from '@nestjs/testing';
import { KidsEmailsValidator } from './kids-emails-validator.service';
import { ConsumerUserService } from '../consumer-user.service';
import { ValidationException } from '../../../error/common.exception';
import { UserErrors } from '../users.errors';
import { HttpStatus } from '@nestjs/common';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static USER_REPOSITORY = class {
        static create = Fixture.getMock();
        static findOne = Fixture.getMock();
        static update = Fixture.getMock();
        static findAll = Fixture.getMock();
        static destroy = Fixture.getMock();
    };

    static buildKids(count: number, addIds: boolean) {
        const kids = [];
        for (let i = 1; i <= count; i++) {
            const kid = {
                firstName: 'kid' + i,
                lastName: 'kid' + i,
                yearOfBirth: '2000',
            };
            if (addIds) {
                kid['id'] = i;
            }
            kids.push(kid);
        }
        return kids;
    }
}

describe('Kids email validator unit tests', () => {
    let service: KidsEmailsValidator;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KidsEmailsValidator,
                {
                    provide: 'USER_REPOSITORY',
                    useValue: Fixture.USER_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<KidsEmailsValidator>(KidsEmailsValidator);
    });

    describe('Validate input kids', () => {
        it('Should throw exception when validating existing kids with no database id', async () => {
            //given
            const request = {
                body: Fixture.buildKids(2, false),
                user: {
                    userId: 'userId',
                },
            };
            const parentEmail = 'parent@gmail.com';
            request.body.forEach((kid) => {
                kid['email'] = ConsumerUserService.buildKidEmail(kid.firstName, kid.lastName, parentEmail);
            });

            //mock dependencies
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ email: parentEmail });
            Fixture.USER_REPOSITORY.findAll.mockResolvedValueOnce(request.body);

            //when
            service.validateRequest(request).catch((e) => {
                //then
                expectFindingParent(request);
                expect(Fixture.USER_REPOSITORY.findAll).toHaveBeenCalledTimes(1);

                expect(e).toBeInstanceOf(ValidationException);
                expect(e.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });

        it('Should not throw exception when validating input kids', async () => {
            //given
            const request = {
                body: Fixture.buildKids(2, false),
                user: {
                    userId: 'userId',
                },
            };
            const parentEmail = 'parent@gmail.com';

            //mock dependencies
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ email: parentEmail });
            Fixture.USER_REPOSITORY.findAll.mockResolvedValueOnce([]);

            //when
            await service.validateRequest(request);

            //then
            expectFindingParent(request);
            expectFindingKids(request, parentEmail);
        });

        it('Should throw exception when validating input kids with empty name', async () => {
            //given
            const request = {
                body: Fixture.buildKids(2, false),
                user: {
                    userId: 'userId',
                },
            };
            const parentEmail = 'parent@gmail.com';
            request.body.forEach((user) => {
                user.firstName = '';
                user.lastName = '';
            });

            //mock dependencies
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ email: parentEmail });
            Fixture.USER_REPOSITORY.findAll.mockResolvedValueOnce([]);

            //when
            service.validateRequest(request).catch((e) => {
                //then
                expectFindingParent(request);
                expect(Fixture.USER_REPOSITORY.findAll).toHaveBeenCalledTimes(0);

                expect(e).toBeInstanceOf(ValidationException);
                expect(e.message).toBe(UserErrors.nameMissing());
                expect(e.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });

        it('Should throw exception when validating input kids with duplicate name', async () => {
            //given
            const request = {
                body: Fixture.buildKids(2, false),
                user: {
                    userId: 'userId',
                },
            };
            const parentEmail = 'parent@gmail.com';
            request.body.forEach((user) => {
                user.firstName = 'fName';
                user.lastName = 'lName';
            });

            //mock dependencies
            Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ email: parentEmail });
            Fixture.USER_REPOSITORY.findAll.mockResolvedValueOnce([]);

            //when
            service.validateRequest(request).catch((e) => {
                //then
                expectFindingParent(request);
                expect(Fixture.USER_REPOSITORY.findAll).toHaveBeenCalledTimes(0);

                expect(e).toBeInstanceOf(ValidationException);
                expect(e.message).toBe(UserErrors.duplicatedKids());
                expect(e.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
    });
});

function expectFindingKids(request, parentEmail) {
    const inputUserEmails = request.body.map((kid) => {
        kid['email'] = ConsumerUserService.buildKidEmail(kid.firstName, kid.lastName, parentEmail);
        return kid.email;
    });

    expect(Fixture.USER_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
    expect(Fixture.USER_REPOSITORY.findAll).toHaveBeenCalledWith({
        attributes: ['email', 'id'],
        where: { email: inputUserEmails },
    });
}

function expectFindingParent(request) {
    expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
    expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledWith({
        attributes: ['email'],
        where: { id: request.user.userId },
    });
}
