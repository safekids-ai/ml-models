import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgUnitDto } from './create-org-unit.dto';

export class UpdateOrgUnitDto extends PartialType(CreateOrgUnitDto) {}
