import * as Logger from 'abstract-logging';
import {logger} from "nx/src/utils/logger";
import Downloader from "nodejs-file-downloader"
import * as path from "path";
import * as fs from "fs";
import {promises as promiseFs} from "fs";
import {createHash} from 'crypto';
import gunzip from "gunzip-file"
import { parse as tldts_parse } from 'tldts';
import shorthash from 'short-hash';
import validurl from 'valid-url'

import {DOWNLOADS, SQUID_DOWNLOADS, SquidCategory, WebCategory} from "libs/web-categorize/src/lib/web-category-content";
import * as process from "process";


interface WebCategoryResult {
  category: WebCategory
  categoryStr: string
}


class HostURLCategorizer {
  hostCache = new Map<string, Set<WebCategory>>();
  urlCache = new Map<string, Set<WebCategory>>();

  squidCache = new Map<string, Set<SquidCategory>>();

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
      const categoryStr: string = WebCategory[category]
      res.push({category, categoryStr})
    }
    return res
  }

  combineSets<T>(setA: Set<T> | null, setB: Set<T> | null): Set<T> {
    // Convert null to an empty set using the nullish coalescing operator
    const safeSetA = setA ?? new Set<T>();
    const safeSetB = setB ?? new Set<T>();

    // Combine both sets into a new one
    return new Set([...safeSetA, ...safeSetB]);
  }

  isValidUri(uri: string) : boolean {
    return validurl.isUri(uri);
  }

  getCategory(uri: string): WebCategoryResult[] {
    const {publicSuffix, hostname} = tldts_parse(uri)
    const [,,,parsedUrl] = this.parseURL(uri)

    //check url
    const hash = shorthash(parsedUrl)
    let categories = this.urlCache.get(hash)
    if (categories && categories.size > 0) {
      return this.categoriesToList(categories)
    }

    //check hostname (www and root)
    const hostHash = shorthash(hostname)
    const categoriesHost = this.hostCache.get(hostHash)
    const categoriesWithoutWWW = this.hostCache.get(shorthash(hostname.replace("www.", "")))
    categories = this.combineSets(categoriesHost, categoriesWithoutWWW);
    if (categories && categories.size > 0) {
      return this.categoriesToList(categories)
    }

    //check squid TLD's
    if (publicSuffix) {
      const res = this.squidCache.get(shorthash(publicSuffix))
      if (res) {
        if (res.has(SquidCategory.ALLOWED_TLDS)) {
          const cat = WebCategory.UNKNOWN_BUT_CLEAN;
          return [{category: cat, categoryStr: WebCategory[cat]}]
        }
        if (res.has(SquidCategory.BLOCK_TLDS)) {
          const cat = WebCategory.UNKNOWN_DANGEROUS;
          return [{category: cat, categoryStr: WebCategory[cat]}]
        }
      }
    }

    //check squid domain's
    const hostNameResult = this.squidCache.get(hostHash)
    if (hostNameResult) {
      if (hostNameResult.has(SquidCategory.BLOCK_URL)) {
        const cat = WebCategory.UNKNOWN_DANGEROUS;
        return [{category: cat, categoryStr: WebCategory[cat]}]
      }
      if (hostNameResult.has(SquidCategory.ALLOWED_URL) || hostNameResult.has(SquidCategory.ALLOWED_DOMAINS)) {
        const cat = WebCategory.UNKNOWN_BUT_CLEAN;
        return [{category: cat, categoryStr: WebCategory[cat]}]
      }
      const cat = WebCategory.UNKNOWN_DANGEROUS;
      return [{category: cat, categoryStr: WebCategory[cat]}]
    }

    return null;
  }

  getFilename(url, stripExtension?: boolean): string {
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
      const hash = shorthash(line)
      if (!this.hostCache.has(hash)) {
        //console.log(line)
        this.hostCache.set(hash, new Set<WebCategory>())
      }
      this.hostCache.get(hash).add(category)
    } else {
      const [, , , parsedUrl] = this.parseURL(line)
      const hash = shorthash(parsedUrl)
      if (!this.urlCache.has(hash)) {
        //console.log(parsedUrl)
        this.urlCache.set(hash, new Set<WebCategory>())
      }
      this.urlCache.get(hash).add(category)
    }
  }

  cacheSquid(category: SquidCategory, line: string) {
    if (line.startsWith("#")) {
      return
    }
    if (line.startsWith(".")) {
      line = line.substring(1, line.length)
    }
    const hash = shorthash(line)
    if (!this.squidCache.has(hash)) {
      this.squidCache.set(hash, new Set<SquidCategory>())
    }
    this.squidCache.get(hash).add(category)
  }
  async loadFileToCache(category: WebCategory | SquidCategory, file, callback) {
    const exists = fs.existsSync(file)

    if (exists) {
      logger.info(`Reading file ${file}`)
      const data = fs.readFileSync(file, {encoding: 'utf8', flag: 'r'});
      const lines = data.split('\n');
      lines.forEach((line, index) => {
        callback(category, line)
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
          await this.loadFileToCache(category as WebCategory, decompressedFilePath,
            (category, line) => this.cacheLine(category, line))
        } else {
          await this.loadFileToCache(category as WebCategory, filePath,
            (category, line) => this.cacheLine(category, line))
        }
      }

      const hostNameCount = this.hostCache.size
      const urlCount = this.urlCache.size
      logger.info(`Process all URLs/Hostname in cache hosts:${hostNameCount} urls:${urlCount}`)
    }

    for (const [category, files] of SQUID_DOWNLOADS) {
      const categoryName = SquidCategory[category]
      const categoryDir = path.join(this.getDownloadPath(), categoryName)

      for (const file of files) {
        const fileName = this.hashUrl(file.url) + "-" + this.getFilename(file.url)
        const filePath = path.join(categoryDir, fileName)
        if (file.compressed) {
          const decompressedFileName = this.getFilename(fileName, true)
          const decompressedFilePath = path.join(categoryDir, decompressedFileName)
          logger.info(`Decompressing file ${filePath} to ${decompressedFilePath}`)
          const gz = await gunzip(filePath, decompressedFilePath)
          await this.loadFileToCache(category as SquidCategory, decompressedFilePath,
            (category, line) => this.cacheSquid(category, line))
        } else {
          await this.loadFileToCache(category as SquidCategory, filePath,
            (category, line) => this.cacheSquid(category, line))
        }
      }
    }
    logger.info(`Process all Squid cache hosts:${this.squidCache.size}`)
  }

  async downloadFile(url: string, destPath: string, destFileName: string, overwrite?: boolean): Promise<void> {
    const destFile = path.join(destPath, destFileName)
    const exists = fs.existsSync(destFile)
    const downloader = new Downloader({
      url: url,
      directory: destPath,
      fileName: destFileName,
      maxAttempts: 2,
      cloneFiles: false
    });

    try {
      if (exists && !overwrite) {
        //logger.debug(`Ignoring file ${categoryDir}/${fileName} ${file.url} since its already downloaded`)
      } else {
        logger.info(`Downloading file ${url} ${url} to ${destFile}`)
        await downloader.download()
      }
    } catch (err) {
      logger.error(`Unable to download ${url} -> ${destFile} due to ${err}`)
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
        await this.downloadFile(file.url, categoryDir, fileName)
      }
    }

    for (const [category, files] of SQUID_DOWNLOADS) {
      const categoryName = SquidCategory[category]
      const categoryDir = path.join(downloadPath, categoryName)
      await promiseFs.mkdir(categoryDir, {recursive: true})

      for (const file of files) {
        const fileName = this.hashUrl(file.url) + "-" + this.getFilename(file.url)
        await this.downloadFile(file.url, categoryDir, fileName)
      }
    }

    logger.info("Done downloading all files")
  }
}

export {WebCategory, HostURLCategorizer, WebCategoryResult}
