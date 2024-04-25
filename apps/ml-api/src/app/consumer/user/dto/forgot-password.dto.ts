import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email?: string;
}
