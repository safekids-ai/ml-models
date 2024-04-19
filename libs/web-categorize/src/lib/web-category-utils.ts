import validurl from 'valid-url'

export class UriUtils {
  static parseURL(url: string): [boolean, boolean, string, string] {
    const index = url.indexOf("://")
    if (index <= 0) {
      return [false, true, url, url]
    }
    const urlWithoutProtocol = url.substring(index + 3, url.length)
    const isRoot = (urlWithoutProtocol.indexOf("/") < 0)
    const hostName = (isRoot) ? urlWithoutProtocol : urlWithoutProtocol.substring(0, urlWithoutProtocol.indexOf("/"))
    return [true, isRoot, hostName, url.substring(index + 3, url.length)]
  }

  static isValidUri(uri: string) : boolean {
    return validurl.isUri(uri);
  }
}
