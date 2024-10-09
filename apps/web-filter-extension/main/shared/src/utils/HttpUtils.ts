import {Logger} from '@shared/logging/ConsoleLogger';

export class HttpUtils {
  static getBaseUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
      console.error("Invalid URL provided:", error);
      return "";
    }
  }

  static getDomain = (url: string) => {
    let hostName = url;
    try {
      // to make it URL
      hostName = hostName.indexOf('://') > 0 ? hostName : 'http://' + hostName;
      const urlObj: URL = new URL(hostName);
      hostName = urlObj.host;
    } catch (e) {
    }
    return hostName;
  };

  static getHostname(url: string) {
    let hostname;
    if (url.includes('//')) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
  }

  static getRootDomain(url: string) {
    let domain = HttpUtils.getHostname(url);
    const splitArr = domain.split('.');
    const arrLen = splitArr.length;
    if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
        domain = splitArr[arrLen - 3] + '.' + domain;
      }
    }
    return domain;
  }

  static refineHost(lowerHost: string) {
    const host = HttpUtils.getRootDomain(lowerHost);
    return host.startsWith('www.') ? host.replace('www.', '') : host;
  }

  static getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  };

  static shortenURL = (url: string, start: number, end: number): string => {
    if (!url) return url;
    if (url.length < start + end) return url;
    return url.substring(0, start) + '....' + url.substring(url.length - end);
  };

  static getParameterValue = (parameterName: string, queryString: string = window.location.search): any => {
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName) ?? '';
  };

  static loadJson = async (url: string): Promise<any> => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (e) {
      throw e;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static formatResultHTML = (output: any): string => {
    const outputText = output.toUpperCase();
    const style = outputText === 'CLEAN' ? 'color:green;font-size: small' : 'color:red;font-weight: bold;font-size: medium';
    return "<span style='" + style + "'>[" + outputText + ']</span>';
  };

  static identifyHost = (host: string): { isSearch: boolean; isGoogle: boolean; host?: string } => {
    const searchEngines = ['google.com', 'bing.com', 'duckduckgo.com', 'ask.com', 'yahoo.com'];
    let isSearchEngine = false;
    if (searchEngines.some((v) => host.includes(v))) {
      isSearchEngine = true;
    }
    let isGoogle = false;
    if (host.includes('google.com')) {
      isGoogle = true;
    }
    return {isSearch: isSearchEngine, isGoogle: isGoogle, host};
  };

  static isErrorExist = (request: any, logger: Logger): boolean => {
    if (chrome.runtime.lastError !== null && chrome.runtime.lastError !== undefined) {
      logger?.log(`Content=>Failed on getting response on ${request} with error -> ${chrome.runtime.lastError.message}`);
      return true;
    }
    return false;
  };

  static generateInformUrlId(url: string | undefined, tabId: number | undefined) {
    const host = url?.replaceAll('.', '');
    const time = new Date().getTime();
    const id = tabId + '-' + host + '-' + time;
    return id;
  }

  static isLocalHostOrLocalIP(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      // Check for localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return true;
      }

      // Check for private IP ranges (192.168.x.x, 10.x.x.x, 172.16.x.x to 172.31.x.x)
      const privateIPRegex = /^(192\.168|10|127\.|172\.(1[6-9]|2[0-9]|3[0-1]))\.\d{1,3}\.\d{1,3}$/;

      return privateIPRegex.test(hostname);
    } catch (error) {
      return false;
    }
  }
}
