import { Test, TestingModule } from '@nestjs/testing';
import { AccountTypes } from '../account-type/dto/account-types';
import { UrlService } from './url.service';
import { alwaysAccessibleDomains } from '../constants/always.accessible.domains';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static URL_REPOSITORY = class {
        static findAll = Fixture.getMock();
        static upsert = Fixture.getMock();
    };

    static ACCOUNT_REPOSITORY = class {
        static findOne = Fixture.getMock();
    };
}

describe('Url service unit tests', () => {
    let service: UrlService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UrlService,
                {
                    provide: 'URL_REPOSITORY',
                    useValue: Fixture.URL_REPOSITORY,
                },
                {
                    provide: 'ACCOUNT_REPOSITORY',
                    useValue: Fixture.ACCOUNT_REPOSITORY,
                },
            ],
        }).compile();

        service = module.get<UrlService>(UrlService);
    });

    describe('Find all default urls by account id', () => {
        it('Should fetch default urls by account id if account type is school', async () => {
            //given
            const accountId = 'accountId';
            Fixture.URL_REPOSITORY.findAll.mockResolvedValueOnce(alwaysAccessibleDomains);
            Fixture.ACCOUNT_REPOSITORY.findOne.mockResolvedValueOnce({ accountTypeId: AccountTypes.SCHOOL });

            //when
            const result = await service.findAll(accountId);

            //then
            expect(result.length).toStrictEqual(alwaysAccessibleDomains.length);
            expect(Fixture.URL_REPOSITORY.findAll).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith({
                attributes: ['accountTypeId'],
                where: { id: accountId },
            });
        });

        it('Should return empty array of urls if account type is consumer', async () => {
            //given
            const accountId = 'accountId';
            Fixture.ACCOUNT_REPOSITORY.findOne.mockResolvedValueOnce({ accountTypeId: AccountTypes.CONSUMER });

            //when
            const result = await service.findAll(accountId);

            //then
            expect(result.length).toStrictEqual(0);
            expect(Fixture.URL_REPOSITORY.findAll).toHaveBeenCalledTimes(0);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledTimes(1);
            expect(Fixture.ACCOUNT_REPOSITORY.findOne).toHaveBeenCalledWith({
                attributes: ['accountTypeId'],
                where: { id: accountId },
            });
        });
    });

    describe('Seed all default urls', () => {
        it('Should seed all default urls', async () => {
            //when
            await service.seedDefaultUrls();

            //then
            expect(Fixture.URL_REPOSITORY.upsert).toHaveBeenCalledTimes(21);
        });
    });
});
