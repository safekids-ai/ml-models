import { PartialType } from '@nestjs/mapped-types';
import { CreateUserOptInDto } from './create-opt-in.dto';

export class UpdateOptInDto extends PartialType(CreateUserOptInDto) {}
