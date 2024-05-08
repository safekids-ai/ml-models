import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailMLFeedbackDto } from './create-email-feedback.dto';

export class UpdateEmailMLFeedbackDto extends PartialType(CreateEmailMLFeedbackDto) {}
