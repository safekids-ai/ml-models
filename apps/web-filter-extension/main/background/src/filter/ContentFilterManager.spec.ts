import {ContentFilterManager} from './ContentFilterManager';
import {mock} from 'ts-mockito';
import {ContentFilter} from './content-filters/service/ContentFilter';
import {ContentFilterChain} from './ContentFilterChain';
import {ContentResult} from '@shared/types/ContentResult';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrLevel} from '@shared/types/PrrLevel';
import {UrlStatus} from '@shared/types/UrlStatus';

describe('Content filter Manager test', () => {
  const contentFilter = mock<ContentFilter>();
  const filters = [];
  filters.push(contentFilter);
  const contentFilterChain = new ContentFilterChain(filters);
  let contentFilterManager: ContentFilterManager;
  const expected = {category: PrrCategory.SELF_HARM, level: PrrLevel.ONE, status: UrlStatus.BLOCK};
  beforeEach(async () => {
    contentFilterManager = new ContentFilterManager(contentFilterChain);
  });

  it('Should execute filter chain', async () => {
    const contentFilterChainSpy = jest.spyOn(contentFilterChain, 'execute').mockImplementation((url: string): Promise<ContentResult> => {
      let result: ContentResult = expected;
      return Promise.resolve(result);
    });

    const result = await contentFilterManager.filterUrl('url');

    expect(result).toMatchObject(expected);
    expect(contentFilterChainSpy).toBeCalled();
  });
});
