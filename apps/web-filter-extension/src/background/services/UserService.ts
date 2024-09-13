import {AccessLimitDto} from '@shared/types/AccessLimit.type';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {Logger} from '@shared/logging/ConsoleLogger';
import {RESTService} from '@shared/rest/RestService';
import {GET_PARENTS_LIST, LIMIT_ACCESS_URI, PRR_INFORM_EXT_DISABLE} from './endpoints';

export type UserService = {
  getUserAccess: () => Promise<boolean>;
  updateAccess: (limitAccess: boolean, category: string) => Promise<any | void>;
  getParentsList: () => Promise<any | void>;
  updateLimitAccessLocally: (accessLimited: boolean) => Promise<any | void>;
  resetPRRCounters: () => void;
  notifyParents: () => Promise<void>;
};

export class UserServiceImpl implements UserService {
  constructor(private readonly logger: Logger, private readonly restService: RESTService, private readonly localStorageManager: LocalStorageManager) {
  }

  async getUserAccess(): Promise<boolean> {
    let userAccess: AccessLimitDto = {accessLimited: true};
    try {
      userAccess = await this.restService.doGet(LIMIT_ACCESS_URI);
      this.updateLimitAccessLocally(userAccess.accessLimited);
    } catch (error) {
      throw new Error(`An error occurred while getting user access status: ${error}`);
    }
    return userAccess.accessLimited;
  }

  async updateAccess(accessLimited: boolean, category: string): Promise<void> {
    try {
      this.updateLimitAccessLocally(accessLimited);
      this.logger.debug(`Access is limited: ${accessLimited}`);
      return await this.restService.doPatch(`${LIMIT_ACCESS_URI}`, {accessLimited, category});
    } catch (error) {
      throw new Error(`An error occurred while updating limit access ${error}`);
    }
  }

  async getParentsList(): Promise<any> {
    try {
      return await this.restService.doGet(GET_PARENTS_LIST);
    } catch (error) {
      throw new Error(`An error occurred while getting user parent list ${error}`);
    }
  }

  notifyParents(): Promise<void> {
    try {
      return this.restService.doPost(PRR_INFORM_EXT_DISABLE);
    } catch (error) {
      throw new Error(`An error occurred while notifying parents ${error}`);
    }
  }

  async updateLimitAccessLocally(accessLimited: boolean = true): Promise<void> {
    this.localStorageManager.set({accessLimited});
    this.logger.info('updateLimitAccessLocally: ', accessLimited);
    if (accessLimited) {
      this.localStorageManager.set({accessLimitedAt: new Date().getTime()});
    } else {
      this.resetPRRCounters();
    }
  }

  resetPRRCounters(): void {
    this.localStorageManager.remove('firstPRR2TimeLimit');
    this.localStorageManager.remove('lastPRRTriggerTime');
    this.localStorageManager.remove('accessLimitedAt');
    this.localStorageManager.set({prr2LimitExceeded: false});
    this.localStorageManager.set({prr1Counter: 0});
    this.localStorageManager.set({prr2Counter: 0});
    this.logger.log(`Reset counters because new PRR session starts.`);
  }
}
