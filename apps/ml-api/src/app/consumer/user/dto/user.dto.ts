import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Statuses } from '../../../status/default-status';

export class UserDto {
    @ApiProperty()
    id?: string;

    @ApiProperty()
    @IsNotEmpty()
    firstName?: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName?: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @ApiProperty()
    @IsNotEmpty()
    password?: string;

    statusId?: Statuses;

    accessCode?: string;
    status?: Statuses;
    accessLimited?: boolean;
    topCategories?: any;
    kidRequests?: any;
    activity?: {
        casual: number;
        coached: number;
        crisis: number;
    };
}
