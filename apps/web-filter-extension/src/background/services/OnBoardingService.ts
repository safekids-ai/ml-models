import {onBoardingStatus} from '@shared/types/onBoardingStatus.type';
import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
import {Logger} from '@shared/logging/ConsoleLogger';
import {RESTService} from '@shared/rest/RestService';
import {GET_ONBOARDING_STATUS, SAVE_ONBOARDING_STATUS} from './endpoints';
import {ChromeTabHelper} from '@shared/chrome/tabs/ChromeTabHelper';
import {Credentials} from '@shared/types/message_types';

export type OnBoardingService = {
  onBoard: () => Promise<void>;
  getOnboardingStatus: () => Promise<onBoardingStatus>;
  saveOnboardingStatus: (payload: onBoardingStatus) => Promise<void>;
};

export class OnBoardingServiceImpl implements OnBoardingService {
  constructor(
    private readonly logger: Logger,
    private readonly chromeTabHelper: ChromeTabHelper,
    private readonly chromeUtils: ChromeUtils,
    private readonly restService: RESTService
  ) {
  }

  async onBoard(): Promise<void> {
    // if onboarding already opened, activate that, otherwise open a new tab and activate
    const credentials: Credentials = await this.chromeUtils.getUserCredentials();
    // When user opened new tab

    if (credentials.accessCode === '') {
      // setting extension status
      await this.chromeUtils.setExtensionStatus(false);
      this.chromeTabHelper.createIfNotOpened(this.getOnBoardingPageLink());
    }
  }

  getOnBoardingPageLink(): string {
    return 'chrome-extension://' + chrome.runtime.id + '/src/pages/ui-onboarding/index.html';
  }

  async getOnboardingStatus(): Promise<onBoardingStatus> {
    try {
      return await this.restService.doGet(GET_ONBOARDING_STATUS);
    } catch (error) {
      throw new Error(`Error occured in getOnbardingFeedbackStatus: ${error}`);
    }
  }

  async saveOnboardingStatus(payload: onBoardingStatus): Promise<void> {
    try {
      return await this.restService.doPut(SAVE_ONBOARDING_STATUS, payload);
    } catch (error) {
      throw new Error(`Error occured in saveOnboardingStatus: ${error}`);
    }
  }
}
