import { ContentFilterChain } from '../../../../src/pages/background/filter/ContentFilterChain';
import { ContentFilter } from '../../../../src/pages/background/filter/content-filters/service/ContentFilter';
import { DefaultURLFilter } from '../../../../src/pages/background/filter/content-filters/service/impl/DefaultURLFilter';
import { PrrCategory } from '../../../../src/shared/types/PrrCategory';
import { PrrLevel } from '../../../../src/shared/types/PrrLevel';
import { UrlStatus } from '../../../../src/shared/types/UrlStatus';

describe('Content filter chain service test', () => {
    let service: ContentFilterChain;
    let filters: ContentFilter[] = [];
    const defaultURLFilter = new DefaultURLFilter();
    filters.push(defaultURLFilter);

    beforeEach(async () => {
        service = new ContentFilterChain(filters);
    });

    describe('Execute filters', () => {
        it('Should return allowed category if url is of chrome extension', async () => {
            //given
            const url = 'chrome-extension:facebook.com';

            //when
            const result = await service.execute(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url));
        });

        // TODO: create mock ReduxStorage and re-add test case
        it('Should return block category if url is blocked by some filter', async () => {
            //given
            const url = 'bing.com';

            //mock dependencies
            const blockUrlResponse = ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.INAPPROPRIATE_FOR_MINORS, PrrLevel.ONE);
            jest.spyOn(defaultURLFilter, 'filter').mockResolvedValueOnce(blockUrlResponse);

            //when
            const result = await service.execute(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject(blockUrlResponse);
        });

        it('should return allowed category unknown if no filter is provided to chain', async () => {
            filters = [];
            service = new ContentFilterChain(filters);
            //given
            const url = 'facebook.com';

            //when
            const result = await service.execute(url);
            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject({ status: 'allowed', category: 'UN_KNOWN', level: '0' });
        });
    });

    describe('Refine host', () => {
        it('Should refine host', () => {
            //given
            const url = 'www.facebook.com';

            //when
            const result = ContentFilterChain.refineHost(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toBe('facebook.com');
        });
    });
});
