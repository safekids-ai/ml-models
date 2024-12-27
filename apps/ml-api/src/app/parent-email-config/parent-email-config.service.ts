import {Injectable, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {LoggingService} from '../logger/logging.service';
import {ParentEmailConfigDto} from './dto/parent-email-config.dto';
import {KidConfigService} from '../kid-config/kid-config.service';
import {ExtensionStatus} from '../kid-config/enum/extension-status';
import {EmailService} from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';
import {EmailTemplates} from '../email/email.templates';

@Injectable()
export class ParentEmailConfigService implements OnModuleInit {

  constructor(
    private readonly config: ConfigService,
    private readonly log: LoggingService,
    private readonly kidConfigService: KidConfigService,
    private readonly emailService: EmailService
  ) {
    // Set the region we will be using
    this.log.className(ParentEmailConfigService.name);
  }

  async onModuleInit(): Promise<void> {
  }

  /**
   * Pushes parent events to queue
   * @param message
   * @return void
   */
  async sendMessage(message: ParentEmailConfigDto): Promise<void> {
    const kidConfig = await this.kidConfigService.fetch(message.id);
    if (kidConfig && kidConfig.extensionStatus === ExtensionStatus.UNINSTALLED) {
      await this.emailService.sendEmail({
        id: uuidv4(),
        useSupportEmail: true,
        meta: {
          kidName: `${message.firstName} ${message.lastName}`,
        },
        to: message.parentEmail,
        content: {
          templateName: EmailTemplates.INFORM_EXTENSION_UNINSTALL_DISABLED,
        },
      });
    }
  }
}
