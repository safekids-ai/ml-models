import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityTypeDto } from './create-activity-type.dto';

export class UpdateActivityTypeDto extends PartialType(CreateActivityTypeDto) {}
