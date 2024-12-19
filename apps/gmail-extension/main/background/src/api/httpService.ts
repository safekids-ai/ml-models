import {ILogger} from "@shared/utils/Logger";
import {getJWTToken} from "./chromeUtil";

export enum HTTPMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export type ProfileUserInfo={
  email: string
  id: number
}

export type UserProfile = {
  email:string | undefined,
  deviceId : string,
  deviceType: string,
  os: string;// !platformInfo?.os ? "n/a" : platformInfo?.os,
  platformInfo: any, //?.arch,
  deviceName: string,
  accessCode?: string,
  directoryApiId?: string,
  authToken? : string
}
export enum BROWSERS {
  CHROME = "CHROME",
  EDGE = "EDGE",
}

export const httpError = (status:number, statusMessage: string) => {
  return {status,statusMessage}
}

export class HttpService {
  private readonly config: RequestInit;
  private readonly backendUrl = import.meta.env.API_URL;
  constructor(private logger: ILogger) {
    this.config = {
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      referrerPolicy: "no-referrer",
    };
  }

  /**
   * Get API Config
   */
  getConfig() {
    return this.config
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetch(url: string, method: HTTPMethod, body = {}): Promise<any> {
    const config = {
      ...this.config,
      method,
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : null,
    };
    const jwtToken = await getJWTToken()
    if (jwtToken) {
      this.logger.debug(`User Authenticated.`)
      this.updateHeader('Authorization', `Bearer ${jwtToken}`)
      try {
        const response = await fetch(`${this.backendUrl}/${url}`, config);
        if (response.ok) {
          const result = await response.text();
          return result === "" ? {} : JSON.parse(result);
        } else {
          return httpError(response.status,response.statusText);
        }
      } catch (error) {
        this.logger.debug(`API call not sent.`)
      }
    } else {
      return httpError(401,'user not authorized - failed to send request.')
    }
  }

  updateHeader(key: any, value: any) {
    if (this.config && this.config.headers) {
      this.config.headers[key] = value;
    }
  }
}

