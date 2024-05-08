export class ProcessDto {
    readonly id?: string;
    readonly name: string;
    readonly isAllowed: boolean;
}
export class FilteredProcessDto {
    readonly id: string;
    readonly name: string;
    processes: ProcessDto[];
}
