import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountTypeDto } from './create-account-type.dto';

export class UpdateAccountTypeDto extends PartialType(CreateAccountTypeDto) {}
