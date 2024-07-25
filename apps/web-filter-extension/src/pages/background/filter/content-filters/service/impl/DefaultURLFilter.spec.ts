import { DefaultURLFilter } from '../../../../../../../src/pages/background/filter/content-filters/service/impl/DefaultURLFilter';
import { ContentFilterChain } from '../../../../../../../src/pages/background/filter/ContentFilterChain';
import { PrrCategory } from '../../../../../../../src/shared/types/PrrCategory';
import { PrrLevel } from '../../../../../../../src/shared/types/PrrLevel';
import { UrlStatus } from '../../../../../../../src/shared/types/UrlStatus';

describe('Default url filter service test', () => {
    let service: DefaultURLFilter;
    beforeEach(async () => {
        service = new DefaultURLFilter();
    });

    describe('Execute filter', () => {
        it('Should return blocked category if url is of type search engine', async () => {
            //given
            const url = 'bing.com';

            //when
            const result = await service.filter(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.INAPPROPRIATE_FOR_MINORS, PrrLevel.ONE, url));
        });

        it('Should return blocked category if url is of type explicit', async () => {
            //given
            const url = 'poodle.com';

            //when
            const result = await service.filter(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.ADULT_SEXUAL_CONTENT, PrrLevel.ONE, url));
        });

        it('Should return allowed if url is neither explicit nor search engine', async () => {
            //given
            const url = 'cnn.com';

            //when
            const result = await service.filter(url);

            //then
            expect(result).toBeTruthy();
            expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url));
        });
    });
});
