import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../status/entities/status.entity';
import { AccountType } from '../../account-type/entities/account-type.entity';

export class CreateAccountDto {
    @ApiProperty()
    id?: string;

    @ApiProperty({ nullable: false })
    readonly name: string;

    @ApiProperty({ nullable: true })
    statusId?: string;

    @ApiProperty({ nullable: true })
    status?: Status;

    @ApiProperty({ nullable: true })
    accountTypeId?: string;

    @ApiProperty({ nullable: true })
    accountType?: AccountType;

    @ApiProperty({ nullable: false, example: 'abcd.edu' })
    readonly primaryDomain: string;

    @ApiProperty({ nullable: true })
    contact?: string;

    @ApiProperty({ nullable: true })
    streetAddress?: string;

    @ApiProperty({ nullable: true })
    state?: string;

    @ApiProperty({ nullable: true })
    city?: string;

    @ApiProperty({ nullable: true })
    country?: string;

    @ApiProperty({ nullable: true })
    email?: string;

    @ApiProperty({ nullable: true })
    phone?: string;

    @ApiProperty({ nullable: true })
    emergencyContactName?: string;

    @ApiProperty({ nullable: true })
    emergencyContactPhone?: string;

    interceptionCategories?: string[];
}
