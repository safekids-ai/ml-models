import { Test, TestingModule } from '@nestjs/testing';
import { DefaultCategoryService } from './default-category.service';
import { defaultCategories } from './default-categories';
import { AccountTypes } from '../account-type/dto/account-types';
import { CategoryStatus } from './category.status';
import { QueryException } from '../error/common.exception';
import { HttpStatus } from '@nestjs/common';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static CATEGORY_REPOSITORY = class {
        static findAll = Fixture.getMock();
        static upsert = Fixture.getMock();
    };

    static ACCOUNT_REPOSITORY = class {
        static findOne = Fixture.getMock();
    };
}

describe('Default category service test', () => {
    let service: DefaultCategoryService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DefaultCategoryService,
                {
                    provide: 'CATEGORY_REPOSITORY',
                    useValue: Fixture.CATEGORY_REPOSITORY,
                },
                {
                    provide: 'ACCOUNT_REPOSITORY',
                    useValue: Fixture.ACCOUNT_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<DefaultCategoryService>(DefaultCategoryService);
    });

    describe('Find all default categories by account id', () => {
        it('Should fetch all default categories', async () => {
            //given
            const categories = defaultCategories.filter((category) => category.enabled);
            Fixture.CATEGORY_REPOSITORY.findAll.mockResolvedValueOnce(categories);
            Fixture.ACCOUNT_REPOSITORY.findOne.mockResolvedValueOnce({ accountTypeId: AccountTypes.CONSUMER });

            //when
            const result = await service.findAll();

            //then
            expect(result.length).toStrictEqual(categories.length);
            expect(Fixture.CATEGORY_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
            expect(Fixture.CATEGORY_REPOSITORY.findAll).toHaveBeenCalledWith({
                where: { enabled: true },
                order: [['name', 'ASC']],
            });
        });
    });

    describe('Seed all default categories', () => {
        it('Should seed all default categories', async () => {
            //when
            await service.seedDefaultCategories();

            //then
            expect(Fixture.CATEGORY_REPOSITORY.upsert).toHaveBeenCalledTimes(32);
            expect(Fixture.CATEGORY_REPOSITORY.upsert).toHaveBeenNthCalledWith(1, {
                id: 'ALCOHOL',
                name: 'Alcohol',
                enabled: false,
                schoolDefault: false,
                editable: false,
                status: CategoryStatus.ASK,
                timeDuration: 30,
            });
            expect(Fixture.CATEGORY_REPOSITORY.upsert).toHaveBeenNthCalledWith(32, {
                id: 'WEAPONS',
                name: 'Weapons',
                enabled: true,
                schoolDefault: false,
                editable: true,
                status: CategoryStatus.ALLOW,
            });
        });

        it('Should throw exception when seed all default categories', async () => {
            //mock dependencies
            jest.spyOn(Fixture.CATEGORY_REPOSITORY, 'upsert').mockImplementationOnce(async () => {
                throw new QueryException(QueryException.upsert());
            });

            //when
            service.seedDefaultCategories().catch((e) => {
                //then
                expect(Fixture.CATEGORY_REPOSITORY.upsert).toHaveBeenCalledTimes(1);
                expect(Fixture.CATEGORY_REPOSITORY.upsert).toHaveBeenNthCalledWith(1, {
                    id: 'ALCOHOL',
                    name: 'Alcohol',
                    enabled: false,
                    schoolDefault: false,
                    editable: false,
                    status: CategoryStatus.ASK,
                    timeDuration: 30,
                });

                expect(e).toBeInstanceOf(QueryException);
                expect(e.message).toBe(QueryException.upsert());
                expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });

        it('Should throw exception when seed all default categories', async () => {
            //mock dependencies
            jest.spyOn(Fixture.CATEGORY_REPOSITORY, 'upsert').mockImplementationOnce(async () => {
                throw new QueryException(QueryException.upsert());
            });

            //when
            service.seedDefaultCategories().catch((e) => {
                //then
                expect(Fixture.CATEGORY_REPOSITORY.upsert).toHaveBeenCalledTimes(1);
                expect(Fixture.CATEGORY_REPOSITORY.upsert).toHaveBeenNthCalledWith(1, {
                    id: 'ALCOHOL',
                    name: 'Alcohol',
                    enabled: false,
                    schoolDefault: false,
                    editable: false,
                    status: CategoryStatus.ASK,
                    timeDuration: 30,
                });

                expect(e).toBeInstanceOf(QueryException);
                expect(e.message).toBe(QueryException.upsert());
                expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    });

    describe('Find all enabled categories', () => {
        it('Should find all enabled categories', async () => {
            //when
            const enabled = true;
            await service.findAllByStatus(enabled);

            //then
            expect(Fixture.CATEGORY_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
            expect(Fixture.CATEGORY_REPOSITORY.findAll).toHaveBeenCalledWith({ where: { enabled } });
        });
    });

    it('Should find all editable categories', async () => {
        //given
        Fixture.CATEGORY_REPOSITORY.findAll.mockResolvedValueOnce(defaultCategories);

        //when
        await service.findEditableCategories();

        //then
        expect(Fixture.CATEGORY_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
        expect(Fixture.CATEGORY_REPOSITORY.findAll).toHaveBeenCalledWith({
            attributes: ['id'],
            where: { enabled: true, editable: true },
            order: [['name', 'ASC']],
        });
    });
});
