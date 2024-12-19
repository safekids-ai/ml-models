
export interface NLPModelWrapperInterface {
    isToxic(text: string | null, lengthToAnalyze?: number, runToxicWordCheck?: boolean) : Promise<boolean>;
    version() : string;
}
