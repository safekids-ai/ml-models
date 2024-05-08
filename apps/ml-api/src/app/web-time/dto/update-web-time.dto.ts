import { PartialType } from '@nestjs/mapped-types';
import { CreateWebTimeDto } from './create-web-time.dto';

export class UpdateWebTimeDto extends PartialType(CreateWebTimeDto) {}
