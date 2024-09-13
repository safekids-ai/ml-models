import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {jest} from '@jest/globals';
import {SettingsState} from 'apps/web-filter-extension/shared/redux/reducers/settings';
import {ContentFilterUtil} from '@shared/utils/content-filter/ContentFilterUtil';
import {PrrLevel} from '@shared/types/PrrLevel';

describe('Content filter Utils test', () => {
  const settings: SettingsState = {
    blockedPRRPage: {level: PrrLevel.ONE, category: '', host: ''},
    filterEffect: 'hide',
    prrCategoryThreshold: {category: '', mlMin: 3, nlpMin: 3},
    debug: false,
    enableBlocker: false,
    enableDemo: false,
    enablePRTrigger: false,
    environment: '',
    extensionEnabled: false,
    extensionUpdated: false,
    filterStrictness: 0,
    filteredCategories: [],
    imageAnalyzeLimit: 0,
    interceptionCategories: [],
    isHoliday: false,
    language: '',
    logging: false,
    mlEnabled: false,
    mlPRRThresholdMax: 0,
    mlPRRThresholdMin: 0,
    mlProcessLimit: 0,
    nlpAnalyzeLimit: 0,
    nlpEnabled: false,
    nlpPRRThresholdMax: 0,
    nlpPRRThresholdMin: 0,
    nlpProcessLimit: 0,
    nonPermissibleUrls: ['bbc.com', 'yahoo.com'],
    permissibleUrls: ['youtube.com', 'netflix.com'],
    prTriggered: false,
    prodEnvironment: false,
    prr1Limit: 0,
    prr2Threshold: 0,
    prrThresholds: {},
    showClean: false,
    trainedModel: 'YOLOV',
    informEventTimeoutLimit: 5,
    informEventVisitsLimit: 10,
  };
  const logger = new ConsoleLogger();
  const store = TestUtils.buildSettingsState();

  const educationWebsites = [
    'schoology.com',
    'acceleratelearning.com',
    'app.acceleratelearning.com',
    'kahoot.it',
    'nwea.org',
    'test.mapnwea.org',
    'drcdirect.com',
    'laslinks.com',
    'noredink.com',
    'newsela.com',
    'gimkit.com',
    'blooket.com',
    'yup.com',
  ];

  let contentFilterUtil: ContentFilterUtil;

  beforeEach(async () => {
    contentFilterUtil = new ContentFilterUtil(store, logger);
  });

  test('Should return true if url is permissible', () => {
    jest.spyOn(store, 'getState').mockReturnValueOnce({settings});
    const host = 'www.youtube.com';
    const result = contentFilterUtil.isHostAllowed(host);
    expect(result).toBeTruthy();
  });

  it.each(educationWebsites)('Should return true if url is educational website', (url) => {
    settings.permissibleUrls = [];
    jest.spyOn(store, 'getState').mockReturnValueOnce({settings});
    const result = contentFilterUtil.isHostAllowed(url);
    expect(result).toBeTruthy();
  });

  it('Should return false if url is neither permissible nor educational website', () => {
    settings.permissibleUrls = [];
    jest.spyOn(store, 'getState').mockReturnValueOnce({settings});
    const result = contentFilterUtil.isHostAllowed('bbc.com');
    expect(result).not.toBeTruthy();
  });
});
