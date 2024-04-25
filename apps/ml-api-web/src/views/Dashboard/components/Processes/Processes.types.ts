export interface IProcesses {
    id?: string;
    name: string;
    isAllowed: boolean;
    isInvalid?: boolean;
}

export interface IFilteredProcesses {
    id: string;
    name: string;
    processes: IProcesses[];
}
