export type AutoCompleteOption = {
    email: string;
    lastName: string;
    firstName: string;
};

export type StudentSearchResult = {
    data: StudentSearchData[];
    totalCount: number;
};

export type StudentSearchData = {
    lastName: string;
    firstName: string;
    email: string;
    interceptionDate: string;
    urlAttempted: string;
    category: string;
    prrLevel: string;
};

export type Column = {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'inherit' | 'left' | 'center' | 'justify' | undefined;
    format?: ((value: number | string) => string) | undefined;
};
