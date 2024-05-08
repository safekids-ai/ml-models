import { ApiProperty } from '@nestjs/swagger';

export class LoginTokenResponseDto {
    @ApiProperty()
    jwt_token?: string;
}
