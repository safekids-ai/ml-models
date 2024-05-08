import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailEventConfigDto } from './create-email-event-config.dto';

export class UpdateEmailEventConfigDto extends PartialType(CreateEmailEventConfigDto) {}
