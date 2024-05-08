export class CreateFilteredCategoryDto {
    id?: string;
    readonly name: string;
    readonly enabled: boolean;
    orgUnitId: string;
}
