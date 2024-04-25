import { PartialType } from '@nestjs/mapped-types';
import { CreateRosterOrgDto } from './create-roster-org.dto';

export class UpdateRosterOrgDto extends PartialType(CreateRosterOrgDto) {}
