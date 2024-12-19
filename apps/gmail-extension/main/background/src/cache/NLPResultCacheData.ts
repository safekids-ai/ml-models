export class NLPResultCacheData {
    private _cleanIDs: string;
    private _toxicIDs: string;
    private _userCleanIDs: string;
    private _userToxicIDs: string;

    constructor(cleanIDs?: string, toxicIDs?: string, userCleanIDs?: string, userToxicIDs?: string) {
        if (cleanIDs) {
            this._cleanIDs = cleanIDs;
        }
        if (toxicIDs) {
            this._toxicIDs = toxicIDs;
        }
        if (userCleanIDs) {
            this._userCleanIDs = userCleanIDs;
        }
        if (userToxicIDs) {
            this._userToxicIDs = userToxicIDs;
        }
    }

    set cleanIDs(value: string) {
        this._cleanIDs = value;
    }

    set toxicIDs(value: string) {
        this._toxicIDs = value;
    }

    set userCleanIDs(value: string) {
        this._userCleanIDs = value;
    }

    set userToxicIDs(value: string) {
        this._userToxicIDs = value;
    }

    get cleanIDs(): string {
        return this._cleanIDs;
    }

    get toxicIDs(): string {
        return this._toxicIDs;
    }

    get userCleanIDs(): string {
        return this._userCleanIDs;
    }

    get userToxicIDs(): string {
        return this._userToxicIDs;
    }

    public exists(id: string): boolean {
        if (this._cleanIDs && this._cleanIDs.indexOf(id) >= 0) {
            return true;
        }

        if (this._toxicIDs && this._toxicIDs.indexOf(id) >= 0) {
            return true;
        }

        if (this._userCleanIDs && this._userCleanIDs.indexOf(id) >= 0) {
            return true;
        }

        if (this._userToxicIDs && this._userToxicIDs.indexOf(id) >= 0) {
            return true;
        }

        return false;
    }

    public isClean(id: string): boolean {
        if (this._userCleanIDs && this._userCleanIDs.indexOf(id) >= 0) {
            return true;
        }
        if (!this._cleanIDs || this._cleanIDs.length == 0) {
            return false;
        }
        return this._cleanIDs.indexOf(id) >= 0;
    }

    public isToxic(id: string): boolean {
        if (this._userToxicIDs && this._userToxicIDs.indexOf(id) >= 0) {
            return true;
        }
        if (!this._toxicIDs || this._toxicIDs.length == 0) {
            return false;
        }
        return this._toxicIDs.indexOf(id) >= 0;
    }

    public isToxicML(id: string): boolean {
        if (!this._toxicIDs || this._toxicIDs.length == 0) {
            return false;
        }
        return this._toxicIDs.indexOf(id) >= 0;
    }

    public removeAll(id: string) {
        this._cleanIDs = this.stripID(this._cleanIDs, id);
        this._toxicIDs = this.stripID(this._toxicIDs, id);
        this._userCleanIDs = this.stripID(this._userCleanIDs, id);
        this._userToxicIDs = this.stripID(this._userToxicIDs, id);
    }

    stripID(str: string, id: string): string {
        str = str.replace("|" + id + "|", "|");
        str = str.replace(id + "|", "");
        str = str.replace("|" + id, "");

        return str;
    }
}
