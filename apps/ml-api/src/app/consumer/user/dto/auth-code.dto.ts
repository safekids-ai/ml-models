import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength, MinLength } from 'class-validator';

export class AuthCodeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    @MinLength(6)
    @MaxLength(6)
    code: string;
}
