/* eslint-disable @typescript-eslint/no-explicit-any */
export type ModelSettings = {
    filterStrictness: number;
};
export type MLModel = {
    predict: (element: ImageData | HTMLImageElement | string, url: string) => Promise<string>;
    setSettings: (settings: ModelSettings) => void;
    init: () => Promise<void>;
};
