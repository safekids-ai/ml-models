export interface IUrls {
    id?: string;
    name: string;
    enabled: boolean;
    isInvalid?: boolean;
}

export interface IFilteredWebsites {
    id: string;
    name: string;
    urls: IUrls[];
}
