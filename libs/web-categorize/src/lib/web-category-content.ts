
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
  UNKNOWN_BUT_CLEAN,
  UNKNOWN_DANGEROUS
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

export enum SquidCategory {
  MAIN,
  ALLOWED_DOMAINS,
  ALLOWED_URL,
  ALLOWED_TLDS,
  BLOCK_TLDS,
  BLOCK_URL
}

const SQUID_MAIN: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/maravento/blackweb/master/blackweb.tar.gz",
    type: FileType.HOSTNAME,
    compressed: true
  },
]

const SQUID_ALLOWED_DOMAIN: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/allowdomains.txt",
    type: FileType.HOSTNAME,
  },
]

const SQUID_ALLOWED_URL: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/allowurls.txt",
    type: FileType.HOSTNAME,
  },
]

const SQUID_ALLOWED_TLDS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/allowtlds.txt",
    type: FileType.HOSTNAME,
  },
]

const SQUID_BLOCK_TLDS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/blocktlds.txt",
    type: FileType.HOSTNAME,
  },
]

const SQUID_BLOCK_URLS: FileDownload[] = [
  {
    url: "https://raw.githubusercontent.com/maravento/blackweb/master/bwupdate/lst/blockurls.txt",
    type: FileType.HOSTNAME,
  },
]

export const SQUID_DOWNLOADS = new Map<SquidCategory, FileDownload[]>([
  [SquidCategory.MAIN, SQUID_MAIN],
  [SquidCategory.ALLOWED_DOMAINS, SQUID_ALLOWED_DOMAIN],
  [SquidCategory.ALLOWED_URL, SQUID_ALLOWED_URL],
  [SquidCategory.ALLOWED_TLDS, SQUID_ALLOWED_TLDS],
  [SquidCategory.BLOCK_TLDS, SQUID_BLOCK_TLDS],
  [SquidCategory.BLOCK_URL, SQUID_BLOCK_URLS],
])

export const DOWNLOADS = new Map<WebCategory, FileDownload[]>([
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
