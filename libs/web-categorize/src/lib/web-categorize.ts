import axios from "axios";
import * as Logger from 'abstract-logging';
import {logger} from "nx/src/utils/logger";
import Downloader from "nodejs-file-downloader"
import * as path from "path";
import * as fs from "fs";
import {promises as promiseFs} from 'fs';
import {createHash} from 'crypto';
import gunzip from "gunzip-file"
import * as process from "process";
import {List} from "postcss/lib/list";

enum FileType {
  HOSTNAME,
  URL,
  IP_HOSTNAME
}

export enum WebCategory {
  ADULT_MIXED,
  ADULT_ANIME,
  PORN,
  PROXY_VPN_DDNS,
  GAMBLING,
  PIRACY,
  TRACKERS_ADWARE_MALWARE,
  STALKERWARE,
  CRYPTO_JACKING,
  PHISHING,
  HACKING,
  DDOS,
  DOH_DNS,
  UNSAFE_SEARCH,
  URL_SHORTNER,
  FAKE_NEWS,
  DRUGS,
  DANGEROUS_FORUMS,
  MISC_DANGEROUS_MATERIAL,
  INAPPROPRIATE_MATERIAL,
  SOCIAL_MEDIA,
  CHAT,
  DATING,
  SHOPPING,
  ENTERTAINMENT_CELEBRITY,
  SEX_EDUCATION,
  SPORTS,
  RACY_LINGERIE,
}

export interface WebCategoryResult {
  category: WebCategory
  categoryStr: string
}
interface FileDownload {
  url: string
  type: FileType
  suffix?: boolean
  compressed?: boolean
}

const ADULT_MIXED: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/mixed_adult/domains",
    type: FileType.HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/mixed_adult/urls",
    type: FileType.URL
  },
]

const ADULT_ANIME: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/manga/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/manga/urls", type: FileType.URL},
]

const PORN: FileDownload[] = [
  {url: "https://raw.github.com/olbat/ut1-blacklists/master/blacklists/adult/domains.24733", type: FileType.HOSTNAME},
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/adult/domains.gz",
    compressed: true,
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/adult/urls", type: FileType.URL},
  {
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts",
    type: FileType.IP_HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/4skinSkywalker/Anti-Porn-HOSTS-File/master/HOSTS.txt",
    type: FileType.IP_HOSTNAME
  },
]

const PROXY_VPN_DDNS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/redirector/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/redirector/urls", type: FileType.URL},
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/strict_redirector/domains",
    type: FileType.HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/strict_redirector/urls",
    type: FileType.URL
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/strong_redirector/domains",
    type: FileType.HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/strong_redirector/urls",
    type: FileType.URL
  },
  {
    url: "https://raw.githubusercontent.com/nextdns/dns-bypass-methods/main/apple-private-relay",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/nextdns/dns-bypass-methods/main/browsers", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/dns-bypass-methods/main/encrypted-dns", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/dns-bypass-methods/main/linux", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/dns-bypass-methods/main/proxies", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/dns-bypass-methods/main/tor", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/dns-bypass-methods/main/vpn", type: FileType.HOSTNAME},
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/vpn/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/nextdns/ddns-domains/main/suffixes", type: FileType.HOSTNAME, suffix: true},
]

const GAMBLING: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/arjel/domains",
    type: FileType.HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/gambling/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/gambling/urls", type: FileType.URL},
  {
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling-only/hosts",
    type: FileType.IP_HOSTNAME
  },
]

const PIRACY: FileDownload[] = [
  {url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/file-hosting", type: FileType.HOSTNAME},
  {
    url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/dht-bootstrap-nodes",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/proxies", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/streaming-audio", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/streaming-video", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/torrent-clients", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/torrent-trackers", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/torrent-websites", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/usenet", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/piracy-blocklists/master/warez", type: FileType.HOSTNAME},
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/warez/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/warez/urls", type: FileType.URL},
]

const TRACKERS_ADWARE_MALWARE: FileDownload[] = [
  {url: "https://raw.githubusercontent.com/nextdns/click-tracking-domains/main/domains", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/nextdns/cname-cloaking-blocklist/master/domains", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts", type: FileType.IP_HOSTNAME},
  {url: "https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt", type: FileType.HOSTNAME},
  {url: "https://raw.githubusercontent.com/anudeepND/blacklist/master/facebook.txt", type: FileType.HOSTNAME},
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/malware/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/malware/urls", type: FileType.URL},
]

const STALKERWARE: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/stalkerware/domains",
    type: FileType.HOSTNAME
  },
]

const CRYPTO_JACKING: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/cryptojacking/domains",
    type: FileType.HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/cryptojacking/urls",
    type: FileType.URL
  },
]

const PHISHING: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/phishing/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/phishing/urls", type: FileType.URL},
]

const HACKING: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/hacking/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/hacking/urls", type: FileType.URL},
]

const DDOS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/ddos/domains",
    type: FileType.HOSTNAME
  },
]

const DOH_DNS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/doh/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/doh/urls", type: FileType.URL},
]

const UNSAFE_SEARCH: FileDownload[] = [
  {url: "https://raw.githubusercontent.com/nextdns/no-safesearch/main/domains", type: FileType.HOSTNAME},
]

const URL_SHORTNER: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/shortener/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/shortener/urls", type: FileType.URL},
]

const FAKE_NEWS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-only/hosts",
    type: FileType.IP_HOSTNAME
  },
]

const DRUGS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/drogue/domains",
    type: FileType.IP_HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/drogue/urls", type: FileType.URL},
]

const DANGEROUS_FORUMS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/forums/domains",
    type: FileType.IP_HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/forums/urls", type: FileType.URL},
]

const MISC_DANGEROUS_MATERIAL: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/dangerous_material/domains",
    type: FileType.IP_HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/dangerous_material/urls",
    type: FileType.URL
  },
]

const INAPPROPRIATE_MATERIAL: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/agressif/domains",
    type: FileType.IP_HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/agressif/urls", type: FileType.URL},

]

const SOCIAL_MEDIA: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social-only/hosts",
    type: FileType.IP_HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/social_networks/domains",
    type: FileType.IP_HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/social_networks/urls",
    type: FileType.URL
  },
]

const CHAT: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/chat/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/chat/urls", type: FileType.URL},
]

const DATING: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/dating/domains",
    type: FileType.IP_HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/dating/urls", type: FileType.URL},
]

const SHOPPING: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/shopping/domains",
    type: FileType.IP_HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/shopping/domains",
    type: FileType.URL
  },
]

const ENTERTAINMENT_CELEBRITY: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/celebrity/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/celebrity/urls", type: FileType.URL},
]

const SEX_EDUCATION: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/sexual_education/domains",
    type: FileType.HOSTNAME
  },
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/sexual_education/urls",
    type: FileType.URL
  },
]

const SPORTS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/sports/domains",
    type: FileType.IP_HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/sports/urls", type: FileType.URL},
]

const RACY_LINGERIE: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/lingerie/domains",
    type: FileType.HOSTNAME
  },
  {url: "https://raw.githubusercontent.com/olbat/ut1-blacklists/master/blacklists/lingerie/urls", type: FileType.URL},
]

const SQUID_BLACKWEB = {
  main: "https://raw.githubusercontent.com/maravento/blackweb/master/blackweb.tar.gz",
  allowed_domains: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/allowdomains.txt",
  allowed_urls: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/allowurls.txt",
  allow_tlds: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/allowtlds.txt",
  block_tlds: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/blocktlds.txt",
  block_urls: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/blockurls.txt"
}

const DOWNLOADS = new Map<WebCategory, FileDownload[]>([
  [WebCategory.ADULT_MIXED, ADULT_MIXED],
  [WebCategory.ADULT_ANIME, ADULT_ANIME],
  [WebCategory.PORN, PORN],
  [WebCategory.PROXY_VPN_DDNS, PROXY_VPN_DDNS],
  [WebCategory.GAMBLING, GAMBLING],
  [WebCategory.PIRACY, PIRACY],
  [WebCategory.TRACKERS_ADWARE_MALWARE, TRACKERS_ADWARE_MALWARE],
  [WebCategory.STALKERWARE, STALKERWARE],
  [WebCategory.CRYPTO_JACKING, CRYPTO_JACKING],
  [WebCategory.PHISHING, PHISHING],
  [WebCategory.HACKING, HACKING],
  [WebCategory.DDOS, DDOS],
  [WebCategory.DOH_DNS, DOH_DNS],
  [WebCategory.UNSAFE_SEARCH, UNSAFE_SEARCH],
  [WebCategory.URL_SHORTNER, URL_SHORTNER],
  [WebCategory.FAKE_NEWS, FAKE_NEWS],
  [WebCategory.DRUGS, DRUGS],
  [WebCategory.DANGEROUS_FORUMS, DANGEROUS_FORUMS],
  [WebCategory.MISC_DANGEROUS_MATERIAL, MISC_DANGEROUS_MATERIAL],
  [WebCategory.INAPPROPRIATE_MATERIAL, INAPPROPRIATE_MATERIAL],
  [WebCategory.SOCIAL_MEDIA, SOCIAL_MEDIA],
  [WebCategory.CHAT, CHAT],
  [WebCategory.DATING, DATING],
  [WebCategory.SHOPPING, SHOPPING],
  [WebCategory.ENTERTAINMENT_CELEBRITY, ENTERTAINMENT_CELEBRITY],
  [WebCategory.SEX_EDUCATION, SEX_EDUCATION],
  [WebCategory.SPORTS, SPORTS],
  [WebCategory.RACY_LINGERIE, RACY_LINGERIE],
])

export class HostURLCategorizer {
  hostCache = new Map<string, Set<WebCategory>>();
  urlCache = new Map<string, Set<WebCategory>>();

  constructor(private readonly downloadFolder: string, private readonly logger?: Logger,) {
  }

  parseURL(url: string): [boolean, boolean, string, string] {
    const index = url.indexOf("://")
    if (index <= 0) {
      return [false, true, url, url]
    }
    const urlWithoutProtocol = url.substring(index + 3, url.length)
    const isRoot = (urlWithoutProtocol.indexOf("/") < 0)
    const hostName = (isRoot) ? urlWithoutProtocol : urlWithoutProtocol.substring(0, urlWithoutProtocol.indexOf("/"))
    return [true, isRoot, hostName, url.substring(index + 3, url.length)]
  }

  categoriesToList(categories: Set<WebCategory>) {
    const res: WebCategoryResult[] = []
    if (!categories) {
      return res;
    }
    for (const category of categories) {
      const categoryStr : string = WebCategory[category]
      res.push({category, categoryStr})
    }
    return res
  }
  getCategory(urlOrHost: string): WebCategoryResult[] {
    const [isUrl, isRoot, hostName, parsedUrl] = this.parseURL(urlOrHost)

    if (isUrl) {
      const categories = this.urlCache.get(parsedUrl)
      if (categories && categories.size > 0) {
        return this.categoriesToList(categories)
      }
    }

    const categories = this.hostCache.get(hostName)
    return this.categoriesToList(categories)
  }

  getFilename(url, stripExtension?: boolean) : string {
    let lastIndex = url.lastIndexOf("/", url.length)
    if (lastIndex < 0) {
      lastIndex = -1
    }
    const fileNameWithExtension = url.substring(lastIndex + 1, url.length)

    const lastExtensionIndex = fileNameWithExtension.indexOf(".")
    if (stripExtension && lastExtensionIndex > 0) {
      return fileNameWithExtension.substring(0, lastExtensionIndex)
    }

    return url.substring(lastIndex + 1, url.length)
  }

  async checkDir() {
    try {
      await promiseFs.access(this.downloadFolder, promiseFs.constants.F_OK)
    } catch (err) {
      throw new Error(`${this.downloadFolder} directory does not exist`)
    }
  }

  getDownloadPath() {
    const downloadPath = path.join(this.downloadFolder, "url-classifier")
    return downloadPath
  }

  async createDir() {
    const downloadPath = this.getDownloadPath()
    await promiseFs.mkdir(downloadPath, {recursive: true})
    return downloadPath
  }

  hashUrl(url: string): string {
    const hash = createHash('sha1');
    hash.update(url);
    return hash.digest('hex');
  }

  cacheLine(category: WebCategory, line: string) {
    if (line.startsWith("#")) {
      return
    }
    if (line.trim().startsWith("0.0.0.0")) {
      line = line.substring(line.indexOf("0.0.0.0") + 7, line.length).trim()
    }

    if (line.indexOf("/") <= 0) {
      if (!this.hostCache.has(line)) {
        //console.log(line)
        this.hostCache.set(line, new Set<WebCategory>())
      }
      this.hostCache.get(line).add(category)
    } else {
      const [, , , parsedUrl] = this.parseURL(line)
      if (!this.urlCache.has(parsedUrl)) {
        //console.log(parsedUrl)
        this.urlCache.set(parsedUrl, new Set<WebCategory>())
      }
      this.urlCache.get(parsedUrl).add(category)
    }
  }

  async processFile(category: WebCategory, file): Promise<void> {
    const exists = fs.existsSync(file)

    if (exists) {
      logger.info(`Reading file ${file}`)
      const data = fs.readFileSync(file, {encoding: 'utf8', flag: 'r'});
      const lines = data.split('\n');
      lines.forEach((line, index) => {
        this.cacheLine(category, line)
      });
      logger.info(`Done processing file ${file}`)
    }
  }

  async load(): Promise<void> {
    for (const [category, files] of DOWNLOADS) {
      const categoryName = WebCategory[category]
      const categoryDir = path.join(this.getDownloadPath(), categoryName)

      for (const file of files) {
        const fileName = this.hashUrl(file.url) + "-" + this.getFilename(file.url)
        const filePath = path.join(categoryDir, fileName)
        if (file.compressed) {
          const decompressedFileName = this.getFilename(fileName, true)
          const decompressedFilePath = path.join(categoryDir, decompressedFileName)
          logger.info(`Decompressing file ${filePath} to ${decompressedFilePath}`)
          const gz = await gunzip(filePath, decompressedFilePath)
          await this.processFile(category as WebCategory, decompressedFilePath)
        } else {
          await this.processFile(category as WebCategory, filePath)
        }
      }

      const hostNameCount = this.hostCache.size
      const urlCount = this.urlCache.size
      logger.info(`Process all URLs/Hostname in cache hosts:${hostNameCount} urls:${urlCount}`)
    }
  }

  async download(): Promise<void> {
    await this.checkDir();
    const downloadPath = await this.createDir()

    for (const [category, files] of DOWNLOADS) {
      const categoryName = WebCategory[category]
      const categoryDir = path.join(downloadPath, categoryName)
      await promiseFs.mkdir(categoryDir, {recursive: true})

      for (const file of files) {
        const fileName = this.hashUrl(file.url) + "-" + this.getFilename(file.url)
        const filePath = path.join(categoryDir, fileName)
        const exists = fs.existsSync(filePath)

        const downloader = new Downloader({
          url: file.url,
          directory: categoryDir,
          fileName: fileName,
          maxAttempts: 2,
          cloneFiles: false
        });

        try {
          if (exists) {
            //logger.debug(`Ignoring file ${categoryDir}/${fileName} ${file.url} since its already downloaded`)
          } else {
            logger.info(`Downloading file ${fileName} ${file.url} to ${categoryDir}`)
            await downloader.download()
          }
        } catch (err) {
          logger.error(`Unable to download ${categoryName} -> ${file.url} due to ${err}`)
        }
      }
    }
    logger.info("Done downloading all files")
  }
}
