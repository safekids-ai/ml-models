import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
    @ApiProperty()
    id?: number;

    @ApiProperty()
    userSourcedId!: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    primary?: boolean;

    @ApiProperty()
    beginDate?: Date;

    @ApiProperty()
    endDate?: Date;

    @ApiProperty()
    classId!: number;

    @ApiProperty()
    role: string;

    @ApiProperty()
    schoolId!: string;

    @ApiProperty()
    rosterStatus: string;

    @ApiProperty()
    dateLastModified?: Date;

    @ApiProperty()
    accountId: string;
}
