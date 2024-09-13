import {ReduxStorage} from '../../shared/types/ReduxedStorage.type';
import {interceptTimeType, settings} from 'apps/web-filter-extension/shared/redux/reducers/settings';
import {combineReducers, createStore} from 'redux';

export class TestUtils {
  static mockFetchResponse(data: any, status: boolean = true) {
    //  @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(data),
        ok: status,
      })
    ) as jest.Mock;
  }

  static mockFetchCallFailure(data: any) {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject('mock failed'),
        ok: () => true,
      })
    ) as jest.Mock;
  }

  // static mockFetchResponse(data: any) {
  //     global.fetch = jest.fn(() =>
  //         Promise.resolve({
  //             json: () => Promise.resolve(data),
  //             ok: () => true,
  //         }),
  //     ) as jest.Mock;
  // }
  //
  // static mockFetchCallFailure(data: any) {
  //     global.fetch = jest.fn(() =>
  //         Promise.resolve({
  //             json: () => Promise.reject('mock failed'),
  //             ok: () => true,
  //         }),
  //     ) as jest.Mock;
  // }
  //
  // static mockAbortControllerResponse() {
  //     global.AbortController = jest.fn(() =>
  //         Promise.resolve({
  //             abort: () => Promise.resolve(),
  //         }),
  //     ) as jest.Mock;
  // }
  static createTestStore() {
    const initialSettings = settings;

    const store = createStore(combineReducers({settings: initialSettings}));
    return store;
  }

  static getChromeStorage() {
    return {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      resetPRRCounters: jest.fn(),
    };
  }

  static buildStore(
    filteredCategories?: any[] | {},
    nonPermissibleUrls?: string[],
    category?: string,
    permissibleUrls?: string[],
    nlpEnabled: boolean = true,
    mlEnabled: boolean = true,
    informEventTimeoutLimit: number = 5,
    informEventVisitsLimit: number = 10
  ) {
    return {
      getState: jest.fn().mockReturnValue({
        settings: {
          filteredCategories,
          nonPermissibleUrls,
          permissibleUrls,
          prrThresholds: this.buildThresholdMap(category ? category : 'unknown'),
          prr1Limit: 1,
          prr2Threshold: 1,
          nlpEnabled,
          mlEnabled,
          informEventTimeoutLimit,
          informEventVisitsLimit,
        },
      }),
      dispatch: jest.fn(),
    } as ReduxStorage;
  }

  static buildSettingsState() {
    return {
      getState: jest.fn(),
      dispatch: jest.fn(),
    } as ReduxStorage;
  }

  private static buildThresholdMap(category: string) {
    const prrThresholdMap = {};
    // TODO: implicit any type here due to infinite possibilities of keys, should have set of allowed keys instead
    // @ts-ignore
    prrThresholdMap[category] = {
      category: category,
      mlMin: 1,
      nlpMin: 2,
      mlMax: 3,
      nlpMax: 4,
    };
    return prrThresholdMap;
  }

  static buildProcessLimitSetting() {
    return {
      getState: jest.fn().mockReturnValue({
        settings: {
          prr1Limit: 1,
          prr2Threshold: 1,
          mlProcessLimit: 10,
          nlpProcessLimit: 10,
        },
      }),
      dispatch: jest.fn(),
    } as ReduxStorage;
  }

  static buildInterceptTimeSetting(isHoliday: boolean, schoolTime: interceptTimeType, lightOffTime: interceptTimeType) {
    return {
      getState: jest.fn().mockReturnValue({
        settings: {
          isHoliday,
          schoolTime,
          lightOffTime,
        },
      }),
      dispatch: jest.fn(),
    } as ReduxStorage;
  }

  static buildChromeTab(id: number, url: string) {
    return {
      id,
      active: false,
      autoDiscardable: false,
      discarded: false,
      highlighted: false,
      incognito: false,
      pinned: false,
      selected: false,
      windowId: 0,
      url,
      index: 0,
    };
  }
}
