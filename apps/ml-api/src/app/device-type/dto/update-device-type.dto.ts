import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceTypeDto } from './create-device-type.dto';

export class UpdateDeviceTypeDto extends PartialType(CreateDeviceTypeDto) {}
