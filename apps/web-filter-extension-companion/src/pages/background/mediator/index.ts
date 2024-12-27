import { ConsoleLogger } from "@src/shared/ConsoleLogger";


const logger = ConsoleLogger.getInstance();
export interface Observer {
    update(subject: ExtensionMediator, reason?: string): void;
}

export enum MessageStatus {
    REQUEST_CREDENTIALS = 'REQUEST_CREDENTIALS',
    REQUEST_CREDENTIALS_AFTER_UPDATE = 'REQUEST_CREDENTIALS_AFTER_UPDATE',
}

export abstract class ExtensionMediator {

    private _connected: boolean = false;
    private _accessCode: string = "";
    private _jwtToken: string = "";

    // TODO: utilize the extension ID set by chrome web store
    // you can achieve that by setting the param 'key' in public/manifest.json
    private _extensionID: string = process.env.EXTENSION_ID as string;

    get isConnected(): boolean {
        return this._connected;
    }

    private getFromLocalStorage = async (key: string) => {
        return await new Promise((resolve) => {
            /* istanbul ignore next */
            chrome.storage.local.get([key], function (result) {
                resolve(result[key]);
            });
        });

    }

    get accessCode(): Promise<string> {
        if (this._accessCode === "") {
            return new Promise((resolve) => {
                this.getFromLocalStorage("credentials").then(result => {
                    if (!result) {
                        resolve("")
                    } else {
                        // @ts-ignore
                        this._accessCode = result.accessCode;
                        // @ts-ignore
                        resolve(result.accessCode);
                    }
                });
            })
        }
        return Promise.resolve(this._accessCode);

    }

    get jwtToken(): Promise<string> {
        if (this._jwtToken === "") {
            return new Promise((resolve) => {
                this.getFromLocalStorage("credentials").then(result => {
                    if (!result) {
                        resolve("")
                    } else {
                        // @ts-ignore
                        this._jwtToken = result.jwtToken;
                        // @ts-ignore
                        resolve(result.jwtToken);
                    }
                });
            })
        }
        return Promise.resolve(this._jwtToken);
    }

    get extensionID(): string {
        return this._extensionID;
    }

    /* istanbul ignore next */
    protected modifyJwtToken(jwtToken: string) {
        if (this._jwtToken === jwtToken) {
            return
        }
        chrome.storage.local.set({ credentials: { jwtToken } });
        this._jwtToken = jwtToken;
    }

    /* istanbul ignore next */
    protected modifyAccessCode(accessCode: string) {
        if (this._accessCode === accessCode) {
            return
        }
        chrome.storage.local.set({ credentials: { accessCode } });
        this._accessCode = accessCode;
    }

    public requestCredentials = () => {
        /* istanbul ignore next */
        chrome.runtime.sendMessage(this.extensionID, { status: MessageStatus.REQUEST_CREDENTIALS }, () => {
            if (chrome.runtime.lastError) {
                logger.info(`unable to find main extension: ${chrome.runtime.lastError.message}`)
                setTimeout(this.requestCredentials, 1000);
            }
        })
    }

    public requestCredentialsAfterUpdate = () => {
        /* istanbul ignore next */
        chrome.runtime.sendMessage(this.extensionID, { status: MessageStatus.REQUEST_CREDENTIALS_AFTER_UPDATE }, () => {
            if (chrome.runtime.lastError) {
                logger.info(`unable to find main extension: ${chrome.runtime.lastError.message}`)
                setTimeout(this.requestCredentialsAfterUpdate, 1000);
            }
        })
    }

    /* istanbul ignore next */
    protected clearJwtToken() {
        chrome.storage.local.set({ credentials: { jwtToken: "" } });
        this._jwtToken = "";
    }

    /* istanbul ignore next */
    protected clearAccessCode() {
        chrome.storage.local.set({ credentials: { accessCode: "" } });
        this._accessCode = "";
    }

    /* istanbul ignore next */
    protected modifyExtensionID(id: string) {
        if (this._extensionID === id) {
            return
        }
        this._extensionID = id;
    }

    /* istanbul ignore next */
    protected modifyConnectionStatus(status: boolean, reason?: string) {
        if (reason || status !== this._connected) {
            this._connected = status;
            this.notify(reason)
        }
    }

    abstract attach: (observer: Observer) => void;
    abstract detach: (observer: Observer) => void;
    abstract notify: (reason?: string) => void;
}

export class PrimaryExtensionMediator extends ExtensionMediator {

    static count = 0;
    private _eventListenersInitialized: boolean = false;
    private _observers: Observer[] = [];

    constructor() {
        super()
        PrimaryExtensionMediator.count++;
        if (PrimaryExtensionMediator.count > 1) {
            throw new Error('you only need one instance of this mediator')
        }
    }

    get isInitialized(): boolean {
        return this._eventListenersInitialized;
    }

    // you can attach any instance to get notified about connection status updates
    public attach = (observer: Observer) => {
        const isExist = this._observers.includes(observer);
        if (isExist) {
            throw new Error('PrimaryExtensionMediator: Observer has already been attached')
        }
        logger.info('PrimaryExtensionMediator: Attached an observer');
        this._observers.push(observer);
    };

    public detach = (observer: Observer) => {
        const observerIndex = this._observers.indexOf(observer);
        if (observerIndex === -1) {
            throw new Error('PrimaryExtensionMediator: Nonexistent observer');
        }
        this._observers.splice(observerIndex, 1);
        logger.info('PrimaryExtensionMediator: Detached an observer');
    };

    public notify = (reason?: string) => {
        for (const observer of this._observers) {
            observer.update(this, reason);
        }
        logger.info('notifying all observers');
    };

    public initializeExtensionEventListeners = () => {

        // TODO: create message types
        /* istanbul ignore next */
        chrome.runtime.onMessageExternal.addListener((message: any, sender: chrome.runtime.MessageSender) => {
            if (sender.id === this.extensionID) {
                if (message.status === "UPDATE_CREDENTIALS" || message.status === "UPDATE_CREDENTIALS_AFTER_UPDATE") {
                    this.modifyAccessCode(message.accessCode);
                    this.modifyJwtToken(message.jwtToken);
                    if (message.status === "UPDATE_CREDENTIALS_AFTER_UPDATE") {
                        this.modifyConnectionStatus(true, 'update');
                    } else {
                        this.modifyConnectionStatus(true);
                    }
                }
            }
        });

        // this function runs whenever any extension is updated
        /* istanbul ignore next */
        chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
            if (details.id === this.extensionID || !details.id) {
                if (details.reason === 'update') {
                    this.requestCredentialsAfterUpdate();
                } else {
                    this.requestCredentials();
                }
            }
        })

        // this function runs whenever any extension is installed
        /* istanbul ignore next */
        chrome.management.onInstalled.addListener((info) => {
            if (info.id === this.extensionID) {
                this.requestCredentials();
            }
        })

        // this function runs whenever any extension is enabled
        // and also right after it is installed
        /* istanbul ignore next */
        chrome.management.onEnabled.addListener(async (info) => {
            if (info.id === this.extensionID || info.id === chrome.runtime.id) {
                if (!(await this.accessCode) || !(await this.jwtToken)) {
                    this.requestCredentials();
                } else {
                    this.modifyConnectionStatus(true)
                }
            }
        })

        // this function runs whenever any extension is disabled
        // and also right before uninstall is called
        /* istanbul ignore next */
        chrome.management.onDisabled.addListener(async (info) => {
            if (info.id === this.extensionID && info.enabled === false) {
                this.modifyConnectionStatus(false);
            }
        })

        // this function runs whenever any extension is uninstalled
        /* istanbul ignore next */
        chrome.management.onUninstalled.addListener((id) => {
            if (id === this.extensionID) {
                this.modifyConnectionStatus(false);
                this.clearAccessCode();
                this.clearJwtToken();
            }
        })

        this._eventListenersInitialized = true;
    }
}
