import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class PasswordCodeDto {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(6)
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
