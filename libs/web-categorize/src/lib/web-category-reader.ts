import {promises as promiseFs} from "fs";
import path from "path";
import {createHash} from "crypto";
import {DOWNLOADS, SQUID_DOWNLOADS, SquidCategory, WebCategory} from "libs/web-categorize/src/lib/web-category-content";
import fs from "fs";
import * as readline from 'readline';
import * as Logger from 'abstract-logging';
import {CategoryCacheHash} from "libs/web-categorize/src/lib/category-cache";
import {UriUtils} from "libs/web-categorize/src/lib/web-category-utils";
import gunzip from "gunzip-file"
import {FileDownloader} from "libs/web-categorize/src/lib/download-utils";

export class CategoryFileReader {
  private fileDownloader:FileDownloader = null;
  constructor(private readonly downloadFolder: string,
              private readonly hostCache: CategoryCacheHash,
              private readonly urlCache: CategoryCacheHash,
              private readonly squidCache: CategoryCacheHash,
              private readonly logger: Logger) {
    this.fileDownloader = new FileDownloader(logger)
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

  async performGunzip(source, target) {
    return new Promise<void>((resolve, reject) => {
      try {
        gunzip(source, target, function () {
          resolve()
        })
      } catch (e) {
        reject(e)
      }
    })
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
      this.hostCache.add(line, category)
    } else {
      const [, , , parsedUrl] = UriUtils.parseURL(line)
      this.urlCache.add(parsedUrl, category)
    }
  }

  cacheSquid(category: SquidCategory, line: string) {
    if (line.startsWith("#")) {
      return
    }
    if (line.startsWith(".")) {
      line = line.substring(1, line.length)
    }
    this.squidCache.add(line, category)
  }

  async readFile(category: WebCategory | SquidCategory, file, callback) : Promise<void>{
      const exists = fs.existsSync(file)
      const logger = this.logger;
      let count = 0

      if (exists) {
        logger.info(`Reading file ${file}`)
        const rd = fs.createReadStream(file, {
          highWaterMark: 10 * 1024 * 1024 // 10MB
        });

        const rl = readline.createInterface({
          input: rd,
          crlfDelay: Infinity
        });

        for await (const line of rl) {
          callback(category, line)
          count++;
        }
        logger.info(`Done processing file ${file} with ${count} records`)
      }
  }

  async process(): Promise<void> {
    for (const [category, files] of DOWNLOADS) {
      const categoryName = WebCategory[category]
      const categoryDir = path.join(this.getDownloadPath(), categoryName)

      for (const file of files) {
        const fileName = this.hashUrl(file.url) + "-" + this.getFilename(file.url)
        const filePath = path.join(categoryDir, fileName)
        if (file.compressed) {
          const decompressedFileName = this.getFilename(fileName, true)
          const decompressedFilePath = path.join(categoryDir, decompressedFileName)
          this.logger.info(`Decompressing file ${filePath} to ${decompressedFilePath}`)
          await this.performGunzip(filePath, decompressedFilePath)
          await this.readFile(category as WebCategory, decompressedFilePath,
             (category, line) => this.cacheLine(category, line))
        } else {
          await this.readFile(category as WebCategory, filePath,
             (category, line) => this.cacheLine(category, line))
        }
      }
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
          this.logger.info(`Decompressing file ${filePath} to ${decompressedFilePath}`)
          await this.performGunzip(filePath, decompressedFilePath)
          await this.readFile(category as SquidCategory, decompressedFilePath,
            (category, line) => {
              this.cacheSquid(category, line)
            })
        } else {
          await this.readFile(category as SquidCategory, filePath,
            (category, line) => this.cacheSquid(category, line))
        }
      }
    }

    //print statistics
    const hostNameCount = this.hostCache.size()
    const urlCount = this.urlCache.size()
    const squidSize = this.squidCache.size()
    this.logger.info(`Process all URLs/Hostname in cache hosts:${hostNameCount} urls:${urlCount}`)

    this.logger.info(`Process all Squid cache hosts:${squidSize}`)
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
        this.logger.info(`Downloading file ${file.url} to dir:${categoryDir} name:${fileName}`)
        await this.fileDownloader.downloadFile(file.url, categoryDir, fileName)
      }
    }

    for (const [category, files] of SQUID_DOWNLOADS) {
      const categoryName = SquidCategory[category]
      const categoryDir = path.join(downloadPath, categoryName)
      await promiseFs.mkdir(categoryDir, {recursive: true})

      for (const file of files) {
        const fileName = this.hashUrl(file.url) + "-" + this.getFilename(file.url)
        this.logger.info(`Downloading file ${file.url} to dir:${categoryDir} name:${fileName}`)
        await this.fileDownloader.downloadFile(file.url, categoryDir, fileName)
      }
    }

    this.logger.info("Done downloading all files")
  }
}
