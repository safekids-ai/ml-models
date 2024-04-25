export class OrgUnitDto {
    readonly id: number;
    readonly name: string;
    readonly orgUnitPath: string;
    readonly children: OrgUnitDto[];
}
