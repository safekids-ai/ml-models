import {ChromeUtils} from '@shared/chrome/utils/ChromeUtils';
// import fetchAdapter from '@vespaiach/axios-fetch-adapter';
// import axios, { AxiosInstance } from 'axios';
// import axiosRetry from 'axios-retry';

export type RESTService = {
  doGet: (path: string) => Promise<any>;
  doPost: (path: string, payload?: any, options?: any) => Promise<any>;
  doPut: (path: string, payload?: any) => Promise<any>;
  doPatch: (path: string, payload?: any) => Promise<any>;
  doDelete: (path: string, payload?: any) => Promise<any>;
};

export class HttpException extends Error {
  public httpCode: number;
  public httpDescription: string;
  protected retryableHttpCodes = [500, 502, 503, 504, 408, 429];

  //protected noRetryableHttpCodes = [400, 401, 403, 404, 409];

  constructor(httpCode: number, httpDescription: string) {
    super(httpDescription);
    this.httpCode = httpCode;
    this.httpDescription = httpDescription;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public isRetryable(): boolean {
    return this.retryableHttpCodes.includes(this.httpCode);
  }
}

export class HttpNotFoundException extends HttpException {
  constructor(description: string = 'Not Found') {
    super(404, description);
  }
}

export class FetchApiService implements RESTService {
  baseURL = import.meta.env.API_URL;
  jwtToken = ''; // JWT token

  constructor(private readonly chromeUtils: ChromeUtils) {
    // Initialize JWT Token
    this.initJWTToken();
  }

  async initJWTToken() {
    this.jwtToken = await this.chromeUtils.getJWTToken();
  }

  async fetchWithRetry(url, options, retries = 3, backoff = 300) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new HttpNotFoundException(response.statusText);
          default: {
            throw new HttpException(response.status, response.statusText);
          }
        }
      }
      return response;
    } catch (error) {
      const isHttpException = error instanceof HttpException;
      const isRetryable = (isHttpException) ? error.isRetryable() : true;

      if (retries > 0 && isRetryable) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return this.fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw error;
    }
  }

  async makeRequest(path, method, payload = null, _options?: any) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.jwtToken}`,
    };

    const options = {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : null,
      ..._options
    };

    if (method === 'GET' || method === 'HEAD') {
      delete options.body; // GET or HEAD requests cannot have a body
    }

    console.log("ABBAS-HTTP REQUEST:", `${this.baseURL}/${path}` + "-" + JSON.stringify(options))

    const response = await this.fetchWithRetry(`${this.baseURL}/${path}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get('Content-Type');
    const contentLength = response.headers.get('Content-Length');
    const isJson = (contentType) ? contentType.includes('application/json') : false;
    console.log("ABBAS-HTTP RESPONSE1:",
      `${this.baseURL}/${path}->\nstatus: ${response.status}\ncontent-type: ${response.headers.get("Content-Type")}\n`);

    if (isJson) {
      const result = await response.json()
      console.log("ABBAS-HTTP RESPONSE2:", result)
      return result;
    }

    if (response.status == 201 && !response.data) {
      return {}
    }

    if (contentLength && contentLength > 0) {
      const result = await response.text()
      console.log("ABBAS-HTTP RESPONSE2:", result)
      return result;
    }
    return null; // Assuming the server always returns JSON.
  }

  async doGet(path): Promise<any> {
    if (!this.jwtToken) {
      await this.initJWTToken();
    }
    return this.makeRequest(path, 'GET');
  }

  async doPost(path, payload, options?: any): Promise<any> {
    if (!this.jwtToken) {
      await this.initJWTToken();
    }

    return this.makeRequest(path, 'POST', payload, options);
  }

  async doPut(path, payload): Promise<any> {
    if (!this.jwtToken) {
      await this.initJWTToken();
    }
    return this.makeRequest(path, 'PUT', payload);
  }

  async doPatch(path, payload): Promise<any> {
    if (!this.jwtToken) {
      await this.initJWTToken();
    }
    return this.makeRequest(path, 'PATCH', payload);
  }

  async doDelete(path, payload): Promise<any> {
    if (!this.jwtToken) {
      await this.initJWTToken();
    }
    return this.makeRequest(path, 'DELETE', payload);
  }
}

// export class AxiosApiService implements RESTService {
//   private readonly client: AxiosInstance;
//   baseURL = import.meta.env.API_URL;
//   jwtToken = ''; // JWT token
//
//   constructor(private readonly chromeUtils: ChromeUtils) {
//     this.initJWTToken();
//
//     // axios client with configuration
//     this.client = axios.create({
//       adapter: fetchAdapter,
//     });
//     this.client.defaults.baseURL = this.baseURL;
//     this.client.defaults.headers.post['Content-Type'] = 'application/json';
//
//     this.client.interceptors.request.use(this.beforeRequest);
//     this.client.interceptors.response.use(this.onRequestSuccess, this.onRequestFailure);
//
//     // retry on request failuer
//     axiosRetry(this.client, { retries: 3 });
//     axiosRetry(this.client, { retryDelay: axiosRetry.exponentialDelay });
//     axiosRetry(this.client, {
//       retryCondition: (error: any) => {
//         return axiosRetry.isNetworkOrIdempotentRequestError(error) || axiosRetry.isRetryableError(error);
//       },
//     });
//   }
//
//   async initJWTToken() {
//     this.jwtToken = await this.chromeUtils.getJWTToken();
//     if (this.jwtToken) {
//       this.client.defaults.headers.common.Authorization = `Bearer ${this.jwtToken}`;
//     }
//   }
//
//   getClient = (): AxiosInstance => {
//     return this.client;
//   };
//
//   beforeRequest(request: any) {
//     return request;
//   }
//
//   onRequestSuccess(response: any): any {
//     return response.data;
//   }
//
//   async onRequestFailure(err: any): Promise<any> {
//     const { response } = err;
//     if (response?.status === 401) {
//       return await Promise.resolve(err);
//     }
//     throw response;
//   }
//
//   async doGet<T>(path: string, config?: any): Promise<T> {
//     if (!this.jwtToken) {
//       await this.initJWTToken();
//     }
//     return await this.client.get(path, config);
//   }
//
//   async doPost<T>(path: string, payload?: any): Promise<T> {
//     if (!this.jwtToken) {
//       await this.initJWTToken();
//     }
//     return await this.client.post(path, payload);
//   }
//
//   async doPut<T>(path: string, payload?: any): Promise<T> {
//     if (!this.jwtToken) {
//       await this.initJWTToken();
//     }
//     return await this.client.put(path, payload);
//   }
//
//   async doPatch<T>(path: string, payload?: any): Promise<T> {
//     if (!this.jwtToken) {
//       await this.initJWTToken();
//     }
//     return await this.client.patch(path, payload);
//   }
//
//   async doDelete<T>(path: string, payload?: any): Promise<T> {
//     if (!this.jwtToken) {
//       await this.initJWTToken();
//     }
//     return await this.client.delete(path, payload);
//   }
// }
