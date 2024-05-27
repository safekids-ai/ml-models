import {Inject, Injectable} from '@nestjs/common';
import type {EmailInterface, EmailServiceInterface} from './email.interfaces';
import {EmailTemplateService} from "./email.template.service";
import {LoggingService} from "../logger/logging.service";

@Injectable()
export class EmailService {
  constructor(
    private readonly log: LoggingService,
    @Inject('EmailServiceImpl')
    private readonly impl: EmailServiceInterface,
    @Inject('EmailTemplateServiceImpl')
    private readonly emailTemplateService: EmailTemplateService
  ) {
  }

  async sendEmail(email: EmailInterface): Promise<void> {
    const templateName = email.content.templateName
    if (templateName) {
      const templates = await this.emailTemplateService.list();
      const template = templates.find(t => t.name === email.content.templateName)
      if (!template) {
        this.log.warn("Unable to find a template", {
          templateName: email.content.templateName,
          availableTemplates: templates.map(t => {
            t.name, t.id
          })
        })
      } else {
        //if an id field is available, we will use that
        if (template.id) {
          email.content.templateId = template.id
        }
      }
    }
    return await this.impl.sendEmail(email);
  }
}
