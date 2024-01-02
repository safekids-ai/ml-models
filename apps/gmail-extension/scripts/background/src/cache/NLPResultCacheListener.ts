import {NLPResultCacheData} from "./NLPResultCacheData";

export interface NLPResultCacheListenerInterface {
    onCacheLoadSuccess (cache: NLPResultCacheData) : void;
    onCacheLoadFail (error: Error) : void;
}
