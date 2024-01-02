/* eslint-disable @typescript-eslint/no-explicit-any */

import {BROWSERS, HTTPMethod, HttpService, ProfileUserInfo, UserProfile} from "./httpService";
import {getBrowserInfo} from "../../../common/utils/Utils";
import {Logger} from "../../../common/utils/Logger";
import {CHROME_EXTENSION_LOGIN} from "./endpoint";
import {OptIn, promiseChrome, readLocalStorage} from "./chromeUtil";

export type Credentials = {
  email: string;
  code: string;
  optIn: OptIn;
  jwtToken: string;
}

export class AuthService {
  private readonly backendUrl = process.env.BACKEND_URL;
  private httpService;

  constructor(private logger: Logger) {
    this.httpService = new HttpService(logger)
  }


  checkLogin = async () => {
    const profile: UserProfile = await this.getUserProfile();
    return await this.onUserLogin(profile).catch((e) => {
      throw e;
    });
  }

  getCredentials = async (): Promise<Credentials> => {
    const credentials = await readLocalStorage('credentials')
    return credentials
  }

  /**
   * Check if extension is enabled
   * @param apiObj
   */
  async isExtensionEnabled(): Promise<any> {
    //hardcoding - enabling extension true
    return true
  }

  onUserLogin = async (payload: UserProfile): Promise<any> => {
    const result = null;
    try {
      const config = {
        ...this.httpService.getConfig(),
        method: HTTPMethod.POST,
        body: JSON.stringify(payload),
      };
      let response: any | undefined = undefined;
      try {
        response = await fetch(
          `${this.backendUrl}/${CHROME_EXTENSION_LOGIN}`,
          config
        );
      } catch (e) {
        console.log("Unable to login due to ", e);
        throw e;
      }
      if (response && response?.ok) {
        const data: any = await response.json();
        this.httpService.updateHeader("Authorization", `Bearer ${data.jwt_token}`);
        chrome.storage.local.set(
          {
            jwtToken: data.jwt_token,
            userDeviceLinkId: data.link,
          }
        );
        return data
      }
    } catch (error) {
      this.logger.debug(`User Details Not Found`)
    }
    return result;
  }

  getUserProfile = async (email?: string): Promise<UserProfile> => {
    const profile: UserProfile = {
      deviceId: "",
      deviceName: "",
      deviceType: "",
      email: email,
      os: "",
      platformInfo: undefined,
      directoryApiId: ''
    }
    /*const token = await promiseChrome(chrome.identity.getAuthToken);*/
    const browser = getBrowserInfo()
    const browserName = browser.split(' ')[0]
    if (browserName.toUpperCase() === BROWSERS.CHROME) {
      const profileUserInfo: ProfileUserInfo = await promiseChrome(
        chrome.identity.getProfileUserInfo
      );
      if (profileUserInfo && profileUserInfo.email) {
        profile.email = profileUserInfo.email
      }
      if (profile.email) {
        profile.directoryApiId = `${(profile.email.toString())}`;
        profile.deviceType = "Normal";
      }


      if (chrome.enterprise) {
        const cpuInfo = await promiseChrome(chrome.system.cpu.getInfo);
        const platformInfo = await promiseChrome(chrome.runtime.getPlatformInfo);
        profile.platformInfo = platformInfo

        const directoryDeviceId = await promiseChrome(
          chrome.enterprise.deviceAttributes.getDirectoryDeviceId
        );
        profile.directoryApiId = `${(directoryDeviceId)}`;
        profile.deviceType = "Enterprise";

        profile.deviceName = cpuInfo?.modelName
          ? `${profile.directoryApiId}-${profile.deviceType}`
          : `${cpuInfo?.modelName}-${profile.deviceType}`;
      }

    }

    return profile
  }


}


