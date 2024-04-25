import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailEventTypeDto } from './create-email-event-type.dto';

export class UpdateEmailEventTypeDto extends PartialType(CreateEmailEventTypeDto) {}
