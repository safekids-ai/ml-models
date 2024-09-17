export type ActiveWebUsageDto = {
    tabId: number;
    fullUrl: string;
    hostname?: string;
    visitedAt: Date;
    duration: number;
    extensionVersion?: string;
    browserVersion?: string;
    mlVersion?: string;
    nlpVersion?: string;
    browser?: string;
    ip?: string;
    location?: string;
    userDeviceLinkId?: string;
};
