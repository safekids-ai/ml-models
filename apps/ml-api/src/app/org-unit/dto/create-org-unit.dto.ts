import { CreateFilteredCategoryDto } from '../../filtered-category/dto/create-filtered-category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../status/entities/status.entity';
import { OrgUnitAttributes } from '../entities/org-unit.entity';

export class CreateOrgUnitDto implements OrgUnitAttributes {
    id?: string;
    readonly name: string;
    readonly categories?: CreateFilteredCategoryDto[];
    @ApiProperty({ nullable: true })
    statusId?: string;

    @ApiProperty({ nullable: true })
    status?: Status;

    accountId: string;
    googleOrgUnitId: string;
    parentOuId?: string;
    description: string;
    parent: string;
    orgUnitPath: string;
}
