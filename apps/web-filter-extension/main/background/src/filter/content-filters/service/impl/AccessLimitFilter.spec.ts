import {UserService} from '../../../../services/UserService';
import {ZveloUrlCategoriesService} from '@shared/zvelo/service/impl/ZveloUrlCategoriesService';
import {LocalZveloCategoriesService} from '@shared/zvelo/service/impl/LocalZveloCategoriesService';
import {UrlCategoryService} from '@shared/zvelo/service/UrlCategoryService';
import {AccessLimitFilter} from './AccessLimitFilter';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {ContentFilterChain} from '../../../ContentFilterChain';
import {PrrCategory} from '@shared/types/PrrCategory';
import {LRUCache} from '@shared/cache/LRUCache';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {RESTZveloCategoriesService} from '@shared/zvelo/service/impl/RESTZveloCategoriesService';
import {PrrLevel} from '@shared/types/PrrLevel';
import {UserServiceImpl} from '../../../../services/UserService';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {jest} from '@jest/globals';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {ContentFilterUtil} from '@shared/utils/content-filter/ContentFilterUtil';
import {UrlStatus} from '@shared/types/UrlStatus';
import * as dateFns from 'date-fns';
import {FetchApiService} from "apps/web-filter-extension-old/src/shared/rest/RestService";

jest.mock('date-fns');

describe('Access limit filter service test', () => {
  let service: AccessLimitFilter;
  let urlCategoryService: UrlCategoryService;
  let contentFilterUtils: ContentFilterUtil;
  let userService: UserService;
  const logger = new ConsoleLogger();
  let store = TestUtils.buildSettingsState();

  beforeEach(async () => {
    const localStorageManager = new LocalStorageManager();
    const chromeUtils = new ChromeUtils(logger, localStorageManager);
    const restService = new FetchApiService(chromeUtils);
    const localService = new LocalZveloCategoriesService(logger);
    const restZvelloService = new RESTZveloCategoriesService(new LRUCache<string, number[]>(200), logger);
    urlCategoryService = new ZveloUrlCategoriesService(localService, restZvelloService);
    userService = new UserServiceImpl(logger, restService, localStorageManager);
    const store = TestUtils.buildStore(['gambling'], ['gambling.com'], '', ['school.com']);
    contentFilterUtils = new ContentFilterUtil(store, logger);
    service = new AccessLimitFilter(logger, store, contentFilterUtils, userService, urlCategoryService);
  });

  describe('Execute filter', () => {
    it('Should allow CAtegory if access is not limited', async () => {
      //given
      const url = 'some-gambling.com';

      //mock dependencies
      const getHostCategoryCodesSpy = jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce([]);
      const localStorageManagerReadSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(false);

      //when
      const result = await service.filter(url);

      //then
      expect(result).toBeTruthy();
      expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url));
      expect(localStorageManagerReadSpy).toBeCalledTimes(1);
      expect(getHostCategoryCodesSpy).toBeCalledTimes(0);
    });

    it('Should return blocked category if access limited and url is non permissible urls', async () => {
      //given
      const url = 'gambling.com';
      const codes = [10118];

      //mock dependencies
      const localStorageManagerReadSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(true);
      const getHostCategoryCodesSpy = jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);

      //when
      const result = await service.filter(url);

      //then
      expect(result).toBeTruthy();
      expect(result).toMatchObject(
        ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.ACCESS_LIMITED, PrrLevel.ZERO, url, PrrCategory.ACCESS_LIMITED)
      );
      expect(localStorageManagerReadSpy).toBeCalledTimes(1);
      expect(getHostCategoryCodesSpy).toBeCalledTimes(0);
    });

    it('Should allow Category if (access is limited) but url is educational host', async () => {
      //given
      const url = 'class.com';
      const codes = [10117];

      //mock dependencies
      const localStorageManagerReadSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(true);
      const getHostCategoryCodesSpy = jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
      const inEducationalCodesSpy = jest.spyOn(ChromeCommonUtils, 'inEducationalCodes').mockReturnValueOnce(true);
      const isHostAllowedSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValueOnce(false);

      //when
      const result = await service.filter(url);

      //then
      expect(result).toBeTruthy();
      expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url));
      expect(localStorageManagerReadSpy).toBeCalledTimes(1);
      expect(getHostCategoryCodesSpy).toBeCalledTimes(1);
      expect(inEducationalCodesSpy).toBeCalledTimes(1);
      expect(isHostAllowedSpy).toBeCalledTimes(1);
    });

    it('Should allow Category if (access is limited) but url is in allowed list', async () => {
      //given
      const url = 'class.com';
      const codes = [10117];

      //mock dependencies
      const localStorageManagerReadSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(true);
      const getHostCategoryCodesSpy = jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
      const inEducationalCodesSpy = jest.spyOn(ChromeCommonUtils, 'inEducationalCodes').mockReturnValueOnce(false);
      const isHostAllowedSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValueOnce(true);

      //when
      const result = await service.filter(url);

      //then
      expect(result).toBeTruthy();
      expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url));
      expect(localStorageManagerReadSpy).toBeCalledTimes(1);
      expect(getHostCategoryCodesSpy).toBeCalledTimes(1);
      expect(inEducationalCodesSpy).toBeCalledTimes(1);
      expect(isHostAllowedSpy).toBeCalledTimes(1);
    });

    it('Should allow Category if (access is limited) but url is -> eductional or in allowed list', async () => {
      //given
      const url = 'class.com';
      const codes = [10117];

      //mock dependencies
      const localStorageManagerReadSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(true);
      const getHostCategoryCodesSpy = jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
      const inEducationalCodesSpy = jest.spyOn(ChromeCommonUtils, 'inEducationalCodes').mockReturnValueOnce(true);
      const isHostAllowedSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValueOnce(true);

      //when
      const result = await service.filter(url);

      //then
      expect(result).toBeTruthy();
      expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url));
      expect(localStorageManagerReadSpy).toBeCalledTimes(1);
      expect(getHostCategoryCodesSpy).toBeCalledTimes(1);
      expect(inEducationalCodesSpy).toBeCalledTimes(1);
      expect(isHostAllowedSpy).toBeCalledTimes(1);
    });

    it('Should block Category if (access is limited) and url is -> not eductional nor in allowed list and access restored time is not passed', async () => {
      //given
      const url = 'class.com';
      const codes = [10117];

      //mock dependencies
      const localStorageManagerReadSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(true);
      const getHostCategoryCodesSpy = jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
      const inEducationalCodesSpy = jest.spyOn(ChromeCommonUtils, 'inEducationalCodes').mockReturnValueOnce(false);
      const isHostAllowedSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValueOnce(false);
      jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(false);
      const isAfterSpy = jest.spyOn(dateFns, 'isAfter').mockReturnValueOnce(false);
      //when
      const result = await service.filter(url);

      //then
      expect(result).toBeTruthy();
      expect(result).toMatchObject(
        ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.ACCESS_LIMITED, PrrLevel.ZERO, url, PrrCategory.ACCESS_LIMITED)
      );
      expect(localStorageManagerReadSpy).toBeCalledTimes(2);
      expect(getHostCategoryCodesSpy).toBeCalledTimes(1);
      expect(inEducationalCodesSpy).toBeCalledTimes(1);
      expect(isHostAllowedSpy).toBeCalledTimes(1);
      expect(isAfterSpy).toBeCalledTimes(1);
    });

    it('Should return block when access is limited -> and access restored time is not passed', async () => {
      //given
      const url = 'youtube.com';
      const codes = [15000];

      //mock dependencies
      const localStorageManagerReadSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(true);
      const getHostCategoryCodesSpy = jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
      const inEducationalCodesSpy = jest.spyOn(ChromeCommonUtils, 'inEducationalCodes').mockReturnValueOnce(false);
      const isHostAllowedSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValueOnce(false);
      jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(false);
      const isAfterSpy = jest.spyOn(dateFns, 'isAfter').mockReturnValueOnce(false);

      //when
      const result = await service.filter(url);

      //then
      expect(result).toBeTruthy();
      expect(result).toMatchObject(
        ContentFilterChain.buildContentResult(UrlStatus.BLOCK, PrrCategory.ACCESS_LIMITED, PrrLevel.ZERO, url, PrrCategory.ACCESS_LIMITED)
      );
      expect(localStorageManagerReadSpy).toBeCalledTimes(2);
      expect(getHostCategoryCodesSpy).toBeCalledTimes(1);
      expect(inEducationalCodesSpy).toBeCalledTimes(1);
      expect(isHostAllowedSpy).toBeCalledTimes(1);
      expect(isAfterSpy).toBeCalledTimes(1);
    });

    it('Should return allow when access is limited -> but access restored time has been passed -> also update user status to false', async () => {
      //given
      const url = 'youtube.com';
      const codes = [15000];

      //mock dependencies
      const localStorageManagerReadSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(true);
      const getHostCategoryCodesSpy = jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
      const inEducationalCodesSpy = jest.spyOn(ChromeCommonUtils, 'inEducationalCodes').mockReturnValueOnce(false);
      const isHostAllowedSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValueOnce(false);
      jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(new Date());
      const isAfterSpy = jest.spyOn(dateFns, 'isAfter').mockReturnValueOnce(true);
      const updateAccessSpy = jest.spyOn(userService, 'updateAccess').mockResolvedValueOnce(true);

      //when
      const result = await service.filter(url);

      //then
      expect(result).toBeTruthy();
      expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url));
      expect(localStorageManagerReadSpy).toBeCalledTimes(2);
      expect(getHostCategoryCodesSpy).toBeCalledTimes(1);
      expect(inEducationalCodesSpy).toBeCalledTimes(1);
      expect(isHostAllowedSpy).toBeCalledTimes(1);
      expect(updateAccessSpy).toBeCalledTimes(1);
      expect(isAfterSpy).toBeCalledTimes(1);
    });

    it('Should return allow if access limit service is failed', async () => {
      //given
      const url = 'youtube.com';
      const codes = [15000];

      //mock dependencies
      const localStorageManagerReadSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(true);
      const getHostCategoryCodesSpy = jest.spyOn(urlCategoryService, 'getHostCategoryCodes').mockResolvedValueOnce(codes);
      const inEducationalCodesSpy = jest.spyOn(ChromeCommonUtils, 'inEducationalCodes').mockReturnValueOnce(false);
      const isHostAllowedSpy = jest.spyOn(contentFilterUtils, 'isHostAllowed').mockReturnValueOnce(false);
      jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValueOnce(new Date());
      const isAfterSpy = jest.spyOn(dateFns, 'isAfter').mockReturnValueOnce(true);
      const updateAccessSpy = jest.spyOn(userService, 'updateAccess').mockResolvedValueOnce(true);
      jest.spyOn(userService, 'updateAccess').mockImplementation(async (): Promise<boolean> => {
        throw new Error('Error occurred.');
      });
      //when
      const result = await service.filter(url);

      //then
      expect(result).toBeTruthy();
      expect(result).toMatchObject(ContentFilterChain.buildContentResult(UrlStatus.ALLOW, PrrCategory.ALLOWED, PrrLevel.ZERO, url));
      expect(localStorageManagerReadSpy).toBeCalledTimes(2);
      expect(getHostCategoryCodesSpy).toBeCalledTimes(1);
      expect(inEducationalCodesSpy).toBeCalledTimes(1);
      expect(isHostAllowedSpy).toBeCalledTimes(1);
      expect(isAfterSpy).toBeCalledTimes(1);
      expect(updateAccessSpy).toBeCalledTimes(1);
    });
  });
});
