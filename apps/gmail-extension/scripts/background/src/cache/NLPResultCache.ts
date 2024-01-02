import {ILogger} from "../../../common/utils/Logger";
import {IChromeStorage} from "./ChromeStorage";
import {NLPResultCacheListenerInterface} from "./NLPResultCacheListener";
import {NLPResultCacheData} from "./NLPResultCacheData";

export class NLPResultCache {
  private nlpVersion: string;
  private _nlpCacheData: NLPResultCacheData = new NLPResultCacheData();
  private maxLength = 5000;
  private unflushedCount = 0;
  private flushInterval: NodeJS.Timer;
  private logger: ILogger;
  private chromeStorage: IChromeStorage;
  private readonly NLP_VERSION_KEY: string = "NLP_VERSION"
  private readonly CLEAN_KEY: string = "SK_GMAIL.CLEAN"
  private readonly TOXIC_KEY: string = "SK_GMAIL.TOXIC"
  private readonly USER_CLEAN_KEY: string = "SK_GMAIL.USER_CLEAN"
  private readonly USER_TOXIC_KEY: string = "SK_GMAIL.USER_TOXIC"
  private readonly listeners?: Array<NLPResultCacheListenerInterface>;

  constructor(logger: ILogger, chromeStorage: IChromeStorage, nlpVersion: string, listeners?: Array<NLPResultCacheListenerInterface>) {
    this.logger = logger;
    this.chromeStorage = chromeStorage;
    this.nlpVersion = nlpVersion;
    this.listeners = listeners;
  }

  get nlpCacheData(): NLPResultCacheData {
    return this._nlpCacheData;
  }


  public stopInterval() {
    clearInterval(this.flushInterval);
  }

  async sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  public async load() {
    this.logger.log("Loading sync cache from google sync storage");
    const startTime = new Date().getTime();

    let syncCleanIDs = undefined;
    let syncToxicIDs = undefined;
    let syncUserCleanIDs = undefined;
    let syncUserToxicIDs = undefined;
    let syncNLPVersion = undefined;

    try {
      syncNLPVersion = await this.chromeStorage.get(this.NLP_VERSION_KEY);
      this.logger.log("Load NLP Version:" + syncNLPVersion);


      //reset NLP
      if (syncNLPVersion && syncNLPVersion.length > 0) {
        if (syncNLPVersion != this.nlpVersion) {
          //reset the keys
          this.logger.log(`Old NLP:${syncNLPVersion} and new version: ${this.nlpVersion}`);
          await this.chromeStorage.set(this.CLEAN_KEY, '');
          await this.chromeStorage.set(this.TOXIC_KEY, '');
          await this.chromeStorage.set(this.NLP_VERSION_KEY, this.nlpVersion);
        }
      } else {
        this.logger.log(`Setting NLP Version: ${this.nlpVersion}`);
        await this.chromeStorage.set(this.NLP_VERSION_KEY, this.nlpVersion);
      }

      syncCleanIDs = await this.chromeStorage.get(this.CLEAN_KEY);
      syncToxicIDs = await this.chromeStorage.get(this.TOXIC_KEY);
      syncUserCleanIDs = await this.chromeStorage.get(this.USER_CLEAN_KEY);
      syncUserToxicIDs = await this.chromeStorage.get(this.USER_TOXIC_KEY);

      this.logger.debug("Load clean:" + syncCleanIDs);
      this.logger.debug("Load toxic:" + syncToxicIDs);
      this.logger.debug("Load user clean:" + syncUserCleanIDs);
      this.logger.debug("Load user toxic:" + syncUserToxicIDs);
      this.logger.debug("*** Time to load:" + (new Date().getTime() - startTime));

      //notify listeners for success
      if (this.listeners) {
        const data = new NLPResultCacheData(
          syncCleanIDs, syncToxicIDs);

        this.listeners.forEach(listener => listener.onCacheLoadSuccess(data));
      }
    } catch (error) {
      //notify listeners for failues
      if (this.listeners) {
        this.listeners.forEach(listener => listener.onCacheLoadFail(error));
      }
    }

    if (this._nlpCacheData.cleanIDs && syncCleanIDs && syncCleanIDs.length > 0) {
      this._nlpCacheData.cleanIDs = this.addAndStrip(this._nlpCacheData.cleanIDs, syncCleanIDs + '');
    } else {
      this._nlpCacheData.cleanIDs = syncCleanIDs + '';
    }

    if (this._nlpCacheData.toxicIDs && syncToxicIDs && syncToxicIDs.length > 0) {
      this._nlpCacheData.toxicIDs = this.addAndStrip(this._nlpCacheData.toxicIDs, syncToxicIDs + '');
    } else {
      this._nlpCacheData.toxicIDs = syncToxicIDs + '';
    }
    if (this._nlpCacheData.userCleanIDs && syncUserCleanIDs && syncUserCleanIDs.length > 0) {
      this._nlpCacheData.userCleanIDs = this.addAndStrip(this._nlpCacheData.userCleanIDs, syncUserCleanIDs + '');
    } else {
      this._nlpCacheData.userCleanIDs = syncUserCleanIDs + '';
    }

    if (this._nlpCacheData.userToxicIDs && syncUserToxicIDs && syncUserToxicIDs.length > 0) {
      this._nlpCacheData.userToxicIDs = this.addAndStrip(this._nlpCacheData.userToxicIDs, syncUserToxicIDs + '');
    } else {
      this._nlpCacheData.userToxicIDs = syncUserToxicIDs + '';
    }

    //start the flush timer
    let myself = this;
    this.flushInterval = setInterval(() => {
      if (myself.unflushedCount > 40) {
        this.flush();
      }
    }, 10000);
  }

  public flush() {
    this.logger.log("Flushing cache to chrome storage");

    this.chromeStorage.set(this.USER_CLEAN_KEY, this._nlpCacheData.userCleanIDs);
    this.chromeStorage.set(this.USER_TOXIC_KEY, this._nlpCacheData.userToxicIDs);
    this.chromeStorage.set(this.CLEAN_KEY, this._nlpCacheData.cleanIDs);
    this.chromeStorage.set(this.TOXIC_KEY, this._nlpCacheData.toxicIDs);

    this.logger.debug("Storing clean:" + this._nlpCacheData.cleanIDs);
    this.logger.debug("Storing toxic:" + this._nlpCacheData.toxicIDs);
    this.logger.debug("Storing user clean:" + this._nlpCacheData.userCleanIDs);
    this.logger.debug("Storing user toxic:" + this._nlpCacheData.userToxicIDs);
    this.unflushedCount = 0;
  }

  public add(id: string, toxic: boolean, userDefined?: boolean) {
    this.unflushedCount = this.unflushedCount + 1;

    if (userDefined) {
      if (toxic) {
        this.addUserToxic(id);
      } else {
        this.addUserClean(id);
      }
    } else {
      if (toxic) {
        this.addToxic(id);
      } else {
        this.addClean(id);
      }
    }
  }

  public addUserClean(id: string) {
    this._nlpCacheData.userCleanIDs = this.addAndStrip(id, this._nlpCacheData.userCleanIDs);
  }

  public addUserToxic(id: string) {
    this._nlpCacheData.userToxicIDs = this.addAndStrip(id, this._nlpCacheData.userToxicIDs);
  }

  public addClean(id: string) {
    this._nlpCacheData.cleanIDs = this.addAndStrip(id, this._nlpCacheData.cleanIDs);
  }

  public addToxic(id: string) {
    this._nlpCacheData.toxicIDs = this.addAndStrip(id, this._nlpCacheData.toxicIDs);
  }

  addAndStrip(keep: string, strip: string): string {
    let ret = keep + "|" + strip;
    if (ret.length > this.maxLength) {
      const lastPipe = ret.lastIndexOf("|", this.maxLength);
      if (lastPipe && lastPipe > 0) {
        ret = ret.substring(0, lastPipe);
      }
    }
    return ret;
  }

  public isClean(id: string): boolean {
    return this._nlpCacheData.isClean(id);
  }

  public isToxic(id: string): boolean {
    return this._nlpCacheData.isToxic(id);
  }

  public isToxicML(id: string): boolean {
    return this._nlpCacheData.isToxicML(id);
  }

  public removeAll(id: string) {
    this._nlpCacheData.removeAll(id);
  }
}
