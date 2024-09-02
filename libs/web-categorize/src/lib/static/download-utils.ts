import path from "path";
import fs from "fs";
import Downloader from "nodejs-file-downloader";
import * as Logger from 'abstract-logging';

export class FileDownloader {
  constructor(private readonly logger?: Logger) {
  }
  async downloadFile(url: string, destPath: string, destFileName: string, overwrite?: boolean): Promise<boolean> {
    const destFile = path.join(destPath, destFileName)
    const exists = fs.existsSync(destFile)
    const downloader = new Downloader({
      url: url,
      directory: destPath,
      fileName: destFileName,
      maxAttempts: 2,
      cloneFiles: false
    });

    if (exists && !overwrite) {
      return false;
    }
    await downloader.download()
    return true;
  }
}
