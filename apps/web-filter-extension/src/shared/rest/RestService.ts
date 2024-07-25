import {ChromeUtils} from '@src/shared/chrome/utils/ChromeUtils';

export type RESTService = {
  doGet: (path: string) => Promise<any>;
  doPost: (path: string, payload?: any) => Promise<any>;
  doPut: (path: string, payload?: any) => Promise<any>;
  doPatch: (path: string, payload?: any) => Promise<any>;
  doDelete: (path: string, payload?: any) => Promise<any>;
};


export class FetchApiService implements RESTService {
  baseURL = process.env.BACKEND_URL;
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
      if (!response.ok && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return this.fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      if (!response.ok) throw new Error(response.statusText);
      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return this.fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw error;
    }
  }

  async makeRequest(path, method, payload = null) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.jwtToken}`,
    };

    const options = {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : null,
    };

    if (method === 'GET' || method === 'HEAD') {
      delete options.body; // GET or HEAD requests cannot have a body
    }

    const response = await this.fetchWithRetry(`${this.baseURL}${path}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json(); // Assuming the server always returns JSON.
  }

  doGet(path): Promise<any> {
    return this.makeRequest(path, 'GET');
  }

  doPost(path, payload): Promise<any> {
    return this.makeRequest(path, 'POST', payload);
  }

  doPut(path, payload): Promise<any> {
    return this.makeRequest(path, 'PUT', payload);
  }

  doPatch(path, payload): Promise<any> {
    return this.makeRequest(path, 'PATCH', payload);
  }

  doDelete(path, payload): Promise<any> {
    return this.makeRequest(path, 'DELETE', payload);
  }
}
