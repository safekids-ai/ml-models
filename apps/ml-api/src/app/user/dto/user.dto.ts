import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    accountId?: string;

    @ApiProperty()
    userFirstName?: string;

    @ApiProperty()
    userLastName?: string;

    @ApiProperty()
    userEmail?: string;

    @ApiProperty()
    schoolName?: string;
}
