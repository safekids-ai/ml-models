export enum CategoryStatus {
    ALLOW = 'ALLOW',
    INFORM = 'INFORM',
    ASK = 'ASK',
    PREVENT = 'PREVENT',
}

export type Categories = {
    id: string;
    name: string;
    enabled: boolean;
    status: CategoryStatus; //need to check
};

export interface IFilteredCategories {
    id: string;
    name: string;
    categories: Categories[];
}

export interface IKid {
    id: string;
    name: string;
}

export type StyleProps = {
    isMobile: boolean;
    disableFutureDates?: boolean;
};
