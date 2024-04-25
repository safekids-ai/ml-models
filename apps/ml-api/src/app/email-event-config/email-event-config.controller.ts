import { Controller } from '@nestjs/common';
import { EmailEventConfigService } from './email-event-config.service';

@Controller('email-event-config')
export class EmailEventConfigController {
    constructor(private readonly emailEventConfigService: EmailEventConfigService) {}
}
