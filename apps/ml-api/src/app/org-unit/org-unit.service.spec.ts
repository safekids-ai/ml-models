import { Test, TestingModule } from '@nestjs/testing';
import { Op } from 'sequelize';
import { LoggingService } from '../logger/logging.service';
import { OrgUnitService } from './org-unit.service';
import { GoogleApiService } from '../google-apis/google.apis.service';
import { FilteredUrlService } from '../filtered-url/filtered-url.service';
import { FilteredCategoryService } from '../filtered-category/filtered-category.service';
import { CategoryStatus } from '../category/category.status';
import { DefaultCategoryService } from '../category/default-category.service';
import { ValidationException } from '../error/common.exception';
import { HttpStatus } from '@nestjs/common';

import { FilteredCategoryErrors } from '../filtered-category/filtered-category.errors';
import { KidRequestService } from '../kid-request/kid-request.service';

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

    static ORG_UNIT_REPOSITORY = class {
        static findAll = Fixture.getMock();
    };

    static ACCOUNT_REPOSITORY = class {
        static findOne = Fixture.getMock();
    };

    static Sequelize = class {
        static transaction = Fixture.getMock().mockResolvedValue({
            commit: jest.fn(),
            rollback: jest.fn(),
        });
    };

    static getGoogleApiService = class {};
    static getFilteredUrlService = class {
        static findAllByOrgUnitId = Fixture.getMock();
        static deleteAll = Fixture.getMock();
        static delete = Fixture.getMock();
        static createBulk = Fixture.getMock();
    };
    static getFilteredCategoryService = class {
        static findAllByOrgUnitId = Fixture.getMock();
        static updateCategory = Fixture.getMock();
    };
    static getDefaultCategoryService = class {
        static findEditableCategories = Fixture.getMock();
    };

    static USER_REPOSITORY = class {
        static create = Fixture.getMock();
        static findOne = Fixture.getMock();
        static update = Fixture.getMock();
        static findAll = Fixture.getMock();
        static destroy = Fixture.getMock();
    };

    static PLAN_REPOSITORY = class {
        static findOne = Fixture.getMock();
    };
    static getKidRequestService = class {
        static findOne = Fixture.getMock();
        static updateAccessGranted = Fixture.getMock();
        static create = Fixture.getMock();
    };
}

describe('Organization unit service test', () => {
    let service: OrgUnitService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrgUnitService,
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
                {
                    provide: 'USER_REPOSITORY',
                    useValue: Fixture.USER_REPOSITORY,
                },
                {
                    provide: 'PLAN_REPOSITORY',
                    useValue: Fixture.PLAN_REPOSITORY,
                },
                {
                    provide: 'ORG_UNIT_REPOSITORY',
                    useValue: Fixture.ORG_UNIT_REPOSITORY,
                },
                {
                    provide: 'SEQUELIZE',
                    useValue: Fixture.Sequelize,
                },
                {
                    provide: GoogleApiService,
                    useValue: Fixture.getGoogleApiService,
                },
                {
                    provide: FilteredUrlService,
                    useValue: Fixture.getFilteredUrlService,
                },
                {
                    provide: FilteredCategoryService,
                    useValue: Fixture.getFilteredCategoryService,
                },
                {
                    provide: DefaultCategoryService,
                    useValue: Fixture.getDefaultCategoryService,
                },
                {
                    provide: KidRequestService,
                    useValue: Fixture.getKidRequestService,
                },
            ],
        }).compile();

        service = module.get<OrgUnitService>(OrgUnitService);
    });

    describe('Find kid org units with filtered categories', () => {
        it('Should find no kid org units', async () => {
            //given
            const accountId = 'accountId';

            const categories = ['ONLINE_GAMING', 'SOCIAL_MEDIA_CHAT', 'BODY_IMAGE', 'GAMBLING', 'HATE_SPEECH'];
            Fixture.getDefaultCategoryService.findEditableCategories.mockResolvedValueOnce(categories);

            //mock dependencies
            Fixture.ORG_UNIT_REPOSITORY.findAll.mockResolvedValueOnce([{ id: 'ONLINE_GAMING' }]);
            Fixture.getFilteredCategoryService.findAllByOrgUnitId.mockResolvedValueOnce([{ categoryId: 'ONLINE_GAMING' }]);

            //when
            await service.findFilteredCategories(accountId);

            //then
            expect(Fixture.ORG_UNIT_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
            expect(Fixture.ORG_UNIT_REPOSITORY.findAll).toHaveBeenCalledWith({
                where: {
                    accountId,
                    parent: {
                        [Op.ne]: null,
                    },
                    parentOuId: {
                        [Op.ne]: null,
                    },
                },
            });

            expect(Fixture.getFilteredCategoryService.findAllByOrgUnitId).toHaveBeenCalledTimes(1);
        });
        it('Should find kid org units with filtered categories', async () => {
            //given
            const accountId = 'accountId';
            const orgUnits = [
                { id: 'id', name: 'name' },
                { id: 'id1', name: 'name1' },
            ];

            //mock dependencies
            Fixture.ORG_UNIT_REPOSITORY.findAll.mockResolvedValueOnce(orgUnits);
            Fixture.getFilteredCategoryService.findAllByOrgUnitId.mockResolvedValueOnce([]);
            Fixture.getFilteredCategoryService.findAllByOrgUnitId.mockResolvedValueOnce([]);

            //when
            await service.findFilteredCategories(accountId);

            //then
            expect(Fixture.ORG_UNIT_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
            expect(Fixture.ORG_UNIT_REPOSITORY.findAll).toHaveBeenCalledWith({
                where: {
                    accountId,
                    parent: {
                        [Op.ne]: null,
                    },
                    parentOuId: {
                        [Op.ne]: null,
                    },
                },
            });

            expect(Fixture.getFilteredCategoryService.findAllByOrgUnitId).toHaveBeenCalledTimes(orgUnits.length);
            expect(Fixture.getFilteredCategoryService.findAllByOrgUnitId).toHaveBeenNthCalledWith(1, orgUnits[0].id, accountId);
            expect(Fixture.getFilteredCategoryService.findAllByOrgUnitId).toHaveBeenNthCalledWith(2, orgUnits[1].id, accountId);
        });
    });

    it('Should update filtered categories for org units', async () => {
        //given
        const accountId = 'accountId';
        const orgUnitCategories = [
            {
                id: '3b8dc31c-d4af-4e95-bf65-3bb4e7c79b07',
                name: 'fff fff',
                categories: [
                    {
                        id: 'BODY_IMAGE',
                        name: 'Body Image/Related to Disordered Eating',
                        enabled: true,
                        status: CategoryStatus.PREVENT,
                    },
                    {
                        id: 'GAMBLING',
                        name: 'Gambling',
                        enabled: true,
                        status: CategoryStatus.PREVENT,
                    },
                ],
            },
            {
                id: '736a7904-cb2b-4c2f-94f5-96bd22d32944',
                name: 'ff ff',
                categories: [
                    {
                        id: 'HATE_SPEECH',
                        name: 'Hate Speech',
                        enabled: true,
                        status: CategoryStatus.ASK,
                    },
                    {
                        id: 'SOCIAL_MEDIA_CHAT',
                        name: 'Social Media and Chat',
                        enabled: true,
                        status: CategoryStatus.ASK,
                    },
                ],
            },
        ];
        const length = orgUnitCategories.reduce((count, o2) => count + o2.categories.length, 0);

        //mock dependencies
        const categories = ['ONLINE_GAMING', 'SOCIAL_MEDIA_CHAT', 'BODY_IMAGE', 'GAMBLING', 'HATE_SPEECH'];
        Fixture.getDefaultCategoryService.findEditableCategories.mockResolvedValueOnce(categories);

        //when
        await service.updateFilteredCategories(accountId, orgUnitCategories);

        //then
        expect(Fixture.getFilteredCategoryService.updateCategory).toHaveBeenCalledTimes(length);
    });

    it('Should throw exception when update invalid filtered categories for org units ', async () => {
        //given
        const accountId = 'accountId';
        const orgUnitCategories = [
            {
                id: '3b8dc31c-d4af-4e95-bf65-3bb4e7c79b07',
                name: 'fff fff',
                categories: [
                    {
                        id: 'BODY_IMAGE',
                        name: 'Body Image/Related to Disordered Eating',
                        enabled: true,
                        status: CategoryStatus.PREVENT,
                    },
                    {
                        id: 'GAMBLING',
                        name: 'Gambling',
                        enabled: true,
                        status: CategoryStatus.PREVENT,
                    },
                ],
            },
            {
                id: '736a7904-cb2b-4c2f-94f5-96bd22d32944',
                name: 'ff ff',
                categories: [
                    {
                        id: 'HATE_SPEECH',
                        name: 'Hate Speech',
                        enabled: true,
                        status: CategoryStatus.ASK,
                    },
                    {
                        id: 'SOCIAL_MEDIA_CHAT',
                        name: 'Social Media and Chat',
                        enabled: true,
                        status: CategoryStatus.ASK,
                    },
                ],
            },
        ];

        //mock dependencies
        const categories = ['ONLINE_GAMING', 'SOCIAL_MEDIA_CHAT'];
        Fixture.getDefaultCategoryService.findEditableCategories.mockResolvedValueOnce(categories);

        //when
        service.updateFilteredCategories(accountId, orgUnitCategories).catch((e) => {
            expect(e).toBeInstanceOf(ValidationException);
            expect(e.message).toBe(FilteredCategoryErrors.notFound('BODY_IMAGE'));
            expect(e.status).toBe(HttpStatus.BAD_REQUEST);
        });

        //then
        expect(Fixture.getFilteredCategoryService.updateCategory).toHaveBeenCalledTimes(0);
    });

    it('Should find filtered urls for org units', async () => {
        //given
        const accountId = 'accId';
        const orgUnits = [
            { id: 'id', name: 'name' },
            { id: 'id1', name: 'name1' },
        ];

        //mock dependencies
        Fixture.ORG_UNIT_REPOSITORY.findAll.mockResolvedValueOnce(orgUnits);
        Fixture.getFilteredUrlService.findAllByOrgUnitId.mockResolvedValueOnce([]);
        Fixture.getFilteredUrlService.findAllByOrgUnitId.mockResolvedValueOnce([{ url: 'url', enabled: true }]);

        //when
        await service.findFilteredUrls(accountId);

        //then
        expect(Fixture.ORG_UNIT_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
        expect(Fixture.ORG_UNIT_REPOSITORY.findAll).toHaveBeenCalledWith({
            where: {
                accountId,
                parent: {
                    [Op.ne]: null,
                },
                parentOuId: {
                    [Op.ne]: null,
                },
            },
        });
        expect(Fixture.getFilteredUrlService.findAllByOrgUnitId).toHaveBeenCalledTimes(orgUnits.length);
        expect(Fixture.getFilteredUrlService.findAllByOrgUnitId).toHaveBeenNthCalledWith(1, orgUnits[0].id, accountId);
        expect(Fixture.getFilteredUrlService.findAllByOrgUnitId).toHaveBeenNthCalledWith(2, orgUnits[1].id, accountId);
    });

    it('Should create filtered urls for org units', async () => {
        //given
        const accountId = 'accId';
        const orgUnitId1 = 'f60ccea1-3594-42b1-ac0f-ce2bf471ae1b';
        const userId = 'userId';
        const orgUnitUrl = {
            id: orgUnitId1,
            name: 'kid 1',
            urls: [
                {
                    name: 'www.facebook.com',
                    enabled: true,
                },
            ],
        };

        //mocks
        Fixture.USER_REPOSITORY.findOne.mockResolvedValueOnce({ id: userId });
        Fixture.getKidRequestService.findOne.mockResolvedValueOnce([{ accessGranted: false }]);

        //when
        await service.createFilteredUrls(accountId, orgUnitUrl);

        //then
        expect(Fixture.getFilteredUrlService.createBulk).toHaveBeenCalledTimes(1);
        expect(Fixture.USER_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
        expect(Fixture.getKidRequestService.findOne).toHaveBeenCalledTimes(1);
        expect(Fixture.getKidRequestService.updateAccessGranted).toHaveBeenCalledTimes(1);
    });

    it('Should delete filtered urls for org units', async () => {
        //given
        const id = 'id';

        //when
        await service.deleteFilteredUrl(id);

        //then
        expect(Fixture.getFilteredUrlService.delete).toHaveBeenCalledTimes(1);
        expect(Fixture.getFilteredUrlService.delete).toHaveBeenCalledWith(id);
    });
});
