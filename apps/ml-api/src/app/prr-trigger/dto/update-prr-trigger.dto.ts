import { PartialType } from '@nestjs/mapped-types';
import { CreatePrrTriggerDto } from './create-prr-trigger.dto';

export class UpdatePrrTriggerDto extends PartialType(CreatePrrTriggerDto) {}
