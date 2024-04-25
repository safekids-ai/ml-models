import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class KidDto {
    @ApiProperty()
    id?: string;

    @ApiProperty()
    @IsNotEmpty()
    firstName?: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName?: string;

    @IsNotEmpty()
    yearOfBirth: string;

    email?: string;
}
