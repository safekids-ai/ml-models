import { ApiProperty } from '@nestjs/swagger';
import { RosterOrgAttributes } from '../entities/roster-org.entity';

export class CreateRosterOrgDto implements RosterOrgAttributes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    identifier: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    dateLastModified: Date;

    @ApiProperty()
    rosterStatus: string;

    @ApiProperty()
    accountId: string;
}
