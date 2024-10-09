export class DefaultUrls {
  private static readonly SEARCH_ENGINES_URL = {
    'yandex.com': 0,
    'bing.com': 0,
    'scroller.com': 0,
    'duckduckgo.com': 0,
    'metager.org': 0,
    'qwant.com': 0,
    'mojeek.com': 0,
    'searx.me': 0,
    'startpage.com': 0,
    'searchencrypt.com': 0,
    'swisscows.com': 0,
  };

  private static readonly EXPLICIT_URL = {
    'poodle.com': 0,
  };

  static getSearchEngineUrls() {
    return this.SEARCH_ENGINES_URL;
  }

  static getExplicitUrls() {
    return this.EXPLICIT_URL;
  }
}
