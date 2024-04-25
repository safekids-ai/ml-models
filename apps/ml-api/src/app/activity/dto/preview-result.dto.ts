export class UserInfoDto {
    lastName: string;
    firstName: string;
    email: string;
}

export class PrrInfoDto {
    lastName: string;
    firstName: string;
    email: string;
    interceptionDate: string;
    urlAttempted: string;
    category: string;
    prrLevel: string;
}

export class CountResponse {
    count: number;
}

export class PreviewResultDto {
    totalCount: number;
    data: PrrInfoDto[];
}
