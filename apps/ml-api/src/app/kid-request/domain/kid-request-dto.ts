import { IsNotEmpty } from 'class-validator';
import { CategoryStatus } from '../../category/category.status';

export enum KidRequestTypes {
    INFORM = 'INFORM',
    INFORM_AI = 'INFORM_AI',
    ASK = 'ASK',
    PREVENT = 'PREVENT',
}

export class KidRequestDto {
    id?: string;
    @IsNotEmpty()
    url: string;
    @IsNotEmpty()
    categoryId?: string;
    kidId?: string;
    userId?: string;
    status?: CategoryStatus;
    ai?: boolean;
    choseToContinue?: boolean;
    type?: KidRequestTypes;
    userDeviceLinkId?: string;
    requestTime?: Date;
}

export class KidAccessRequestsDto {
    kidId: string;
    requests: string[];
}
