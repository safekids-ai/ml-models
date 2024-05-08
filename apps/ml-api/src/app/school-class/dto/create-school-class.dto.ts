import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolClassDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title?: string;

    @ApiProperty()
    classType?: string;

    @ApiProperty()
    location?: string;

    @ApiProperty()
    grades?: string;

    @ApiProperty()
    schoolId?: string;

    @ApiProperty()
    rosterStatus: string;

    @ApiProperty()
    dateLastModified?: Date;

    @ApiProperty()
    accountId: string;
}
