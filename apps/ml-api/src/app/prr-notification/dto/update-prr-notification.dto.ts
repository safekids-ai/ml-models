import { PartialType } from '@nestjs/mapped-types';
import { CreatePrrNotificationDto } from './create-prr-notification.dto';

export class UpdatePrrNotificationDto extends PartialType(CreatePrrNotificationDto) {}
