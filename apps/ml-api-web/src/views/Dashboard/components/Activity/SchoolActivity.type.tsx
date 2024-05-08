export type ActivityResponse = {
    level1: PrrInstanceData;
    level2: PrrInstanceData;
    level3: PrrInstanceData;
    reductionToDate: ReductionToDateObj;
    averageDailyInstances: number;
    level3Events: Level3EventData[];
    topInterceptedEvent: TopInterceptedEvent;
};

type ReductionToDateObj = {
    date: string;
    reduction: number;
};

export type PrrInstanceData = {
    count: number;
    reduced: number;
    increased: number;
};

export type Level3EventData = {
    id: string;
    kidId: string;
    kidName: string;
    schoolName: string;
    date: string;
    time: string;
};

export type TopInterceptedEvent = {
    url: string;
    category: string;
    sentiment: string;
    keyword: string;
};

export type SummaryData = {
    reductionToDate: ReductionToDateObj;
    averageDailyInstances: number;
    topInterceptedCategory: string;
    topInterceptedUrl: string;
};

export type UserAccessLimitedWidgetData = {
    accessLimited: boolean;
    prrCategory: string;
    id: number;
    schoolName: string;
    userEmail: string;
    userId: string;
    userName: string;
    read: number;
};

export type UserCrisisWidgetData = UserAccessLimitedWidgetData & {
    prrLevel: number;
    webUrl: string;
    limitAccess: boolean;
    date: string;
    firstName: string;
    lastName: string;
};

export type NonInterceptDataType = {
    id: string;
    webUrl: string;
    count: number;
    category: string;
    isIntercept: boolean;
};

export type KidWidgetType = {
    items: UserCrisisWidgetData[];
    totalItems: number;
};
