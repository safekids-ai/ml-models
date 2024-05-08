import { Test, TestingModule } from '@nestjs/testing';
import { CodeType } from './code_type';
import { UserCodeService } from './user-code.service';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static USER_CODE_REPOSITORY = class {
        static create = Fixture.getMock();
        static findOne = Fixture.getMock();
        static update = Fixture.getMock();
        static destroy = Fixture.getMock();
    };
}

describe('User code service unit tests', () => {
    let service: UserCodeService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserCodeService,
                {
                    provide: 'USER_CODE_REPOSITORY',
                    useValue: Fixture.USER_CODE_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<UserCodeService>(UserCodeService);
    });

    describe('Create user code', () => {
        it('Should create user code successfully', async () => {
            //given
            const userCodeDTO = {
                userId: 'userId',
                codeType: 'codeType',
                code: 'code',
            };

            //when
            await service.create(userCodeDTO);

            //then
            expect(Fixture.USER_CODE_REPOSITORY.create).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_CODE_REPOSITORY.create).toHaveBeenCalledWith(userCodeDTO);
        });
    });

    describe('Find one user code', () => {
        it('Should fetch single user code successfully', async () => {
            //given
            const userId = 'userId';
            const codeType = CodeType.EMAIL;

            //when
            await service.findOne(userId, codeType);

            //then
            expect(Fixture.USER_CODE_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_CODE_REPOSITORY.findOne).toHaveBeenCalledWith({
                where: { userId, codeType },
            });
        });
    });

    describe('Update user code', () => {
        it('Should update user code successfully', async () => {
            //given
            const userId = 'userId';
            const codeType = CodeType.EMAIL;
            const code = 'code';

            //when
            await service.update(userId, codeType, code);

            //then
            expect(Fixture.USER_CODE_REPOSITORY.update).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_CODE_REPOSITORY.update).toHaveBeenCalledWith({ code }, { where: { userId, codeType } });
        });
    });

    describe('Delete one user code', () => {
        it('Should delete single user code successfully', async () => {
            //given
            const userId = 'userId';
            const codeType = CodeType.EMAIL;

            //when
            await service.deleteOne(userId, codeType);

            //then
            expect(Fixture.USER_CODE_REPOSITORY.destroy).toHaveBeenCalledTimes(1);
            expect(Fixture.USER_CODE_REPOSITORY.destroy).toHaveBeenCalledWith({
                where: { userId, codeType },
            });
        });
    });
});
