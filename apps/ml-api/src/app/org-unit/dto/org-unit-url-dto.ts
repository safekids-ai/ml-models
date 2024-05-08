import { UrlDto } from '../../filtered-url/dto/filtered-url.dto';

export class OrgUnitUrlDTO {
    readonly id: string;
    readonly name: string;
    urls: UrlDto[];
}
