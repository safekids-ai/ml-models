import { ApiProperty } from '@nestjs/swagger';
import { JobStatus } from './job.status';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobType } from './job.type';

export class JobDTO {
    @ApiProperty()
    id?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(JobStatus)
    status: JobStatus;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(JobType)
    type: JobType;

    @ApiProperty()
    userId?: string;

    @ApiProperty()
    accountId?: string;

    @ApiProperty()
    remarks?: string;

    @ApiProperty()
    startDate?: Date;

    @ApiProperty()
    endDate?: Date;
}
