import { PartialType } from '@nestjs/mapped-types';
import { CreatePrrManagerDto } from './create-prr-manager.dto';

export class UpdatePrrManagerDto extends PartialType(CreatePrrManagerDto) {}
