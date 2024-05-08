export class UrlDto {
    readonly id?: string;
    readonly name: string;
    readonly enabled: boolean;
}

export class FilteredUrlDto {
    readonly orgUnitIds: string[];
    readonly urls: UrlDto[];
}
