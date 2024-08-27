import {EmailTemplateInterface} from '../email.interfaces';
import {ConfigService} from '@nestjs/config';
import {LoggingService} from '../../logger/logging.service';
import retry from 'async-retry';
import * as postmark from 'postmark';
import {QueueConfig} from "apps/ml-api/src/app/config/queue";
import {PostmarkConfig} from "apps/ml-api/src/app/config/postmark.email";
import {EmailTemplateService} from "../email.template.service";
import {Injectable} from "@nestjs/common";

@Injectable()
export class PostmarkEmailTemplateService extends EmailTemplateService {
  private readonly retryOptions;
  private readonly serverToken;

  constructor(private readonly config: ConfigService, private readonly log: LoggingService) {
    super()
    const queueConfig = config.get<QueueConfig>("queueConfig").queueEmail
    const postmarkConfig = config.get<PostmarkConfig>("postmarkConfig")
    this.retryOptions = queueConfig.retryOptions;
    this.serverToken = postmarkConfig.serverToken;
    this.log.className(PostmarkEmailTemplateService.name);
  }

  async list(): Promise<EmailTemplateInterface[]> {
    const client = new postmark.ServerClient(this.serverToken);
    try {
      const result = await retry(
        async (bail) => {
          try {
            const postmarkTemplates: postmark.Models.Templates = await client.getTemplates();
            const transformed: EmailTemplateInterface[] = postmarkTemplates.Templates.map((template) => {
              return {
                id: template.TemplateId.toString(),
                name: template.Name,
              } as EmailTemplateInterface;
            });

            this.log.debug('postmarkEmailTemplateService listTemplates', {postmarkTemplates, transformed});
            return transformed;
          } catch (error) {
            if (error.retryable === false) {
              bail(error);
            } else {
              throw error;
            }
          }
        },
        {
          ...this.retryOptions,
          onRetry: (error: Error) => {
            this.log.warn('postmarkEmailTemplateService OnRetry - retrying postmark list templates due to', error);
          },
        }
      );

      return result;
    } catch (error) {
      this.log.error('Postmark Email Service. Unable to do Postmark.listTemplates', error);
      throw error;
    }
  }

  async get(id: string): Promise<EmailTemplateInterface> {
    const client = new postmark.ServerClient(this.serverToken);
    try {
      const result = await retry(
        async (bail) => {
          try {
            const template: postmark.Models.Template = await client.getTemplate(Number(id));

            const ret = {
              id: template.TemplateId.toString(),
              name: template.Name,
              content: {
                html: template.HtmlBody,
                subject: template.Subject,
                text: template.TextBody,
              },
            } as EmailTemplateInterface;

            this.log.debug('postmarkEmailTemplateService getTemplate', {template, ret});
            return ret;
          } catch (error) {
            if (error.retryable === false) {
              bail(error);
            } else {
              throw error;
            }
          }
        },
        {
          ...this.retryOptions,
          onRetry: (error: Error) => {
            this.log.warn('postmarkEmailTemplateService OnRetry - retrying postmark get templates due to', error);
          },
        }
      );
      return result;
    } catch (error) {
      this.log.error('Postmark Email Service. Unable to do Postmark.getTemplates', error);
      throw error;
    }
  }

  async create(template: EmailTemplateInterface): Promise<void> {
    const client = new postmark.ServerClient(this.serverToken);
    const templateParams: postmark.Models.CreateTemplateRequest = {
      Name: template.name,
      Alias: template.name,
      HtmlBody: template.content.html,
      Subject: template.content.subject,
      TextBody: template.content.text,
    };

    try {
      await retry(
        async (bail) => {
          try {
            const result = await client.createTemplate(templateParams);
            const {content, ...logTemplate} = template
            this.log.debug('postmarkEmailTemplateService createdTemplate', {logTemplate, result});
          } catch (error) {
            if (error.retryable === false) {
              bail(error);
            } else {
              throw error;
            }
          }
        },
        {
          ...this.retryOptions,
          onRetry: (error: Error) => {
            const {HtmlBody, ...logTemplate} = templateParams
            const logMessage = JSON.stringify(logTemplate)
            this.log.warn(`postmarkEmailTemplateService OnRetry - retrying postmark createTemplate ${logMessage} due to`, error);
          },
        }
      );
    } catch (error) {
      if (error.code && 'AlreadyExists' == error.code) {
        this.log.warn('Template ' + template.name + ' already exists. Not creating.');
        return;
      }
      this.log.error('postmarkEmailTemplateService Email Service. Unable to do postmark.createTemplate', error);
      throw error;
    }
  }

  async update(template: EmailTemplateInterface): Promise<void> {
    const client = new postmark.ServerClient(this.serverToken);

    const templateParams: postmark.Models.UpdateTemplateRequest = {
      Name: template.name,
      Alias: template.name,
      HtmlBody: template.content.html,
      Subject: template.content.subject,
      TextBody: template.content.text,
    };

    try {
      await retry(
        async (bail) => {
          try {
            const templateResponse: postmark.Models.Template = await client.editTemplate(Number(template.id), templateParams);
            const {content, ...logTemplate} = template
            this.log.debug('postmarkEmailTemplateService updateTemplate {}', {logTemplate, templateResponse});
          } catch (error) {
            if (error.retryable === false) {
              bail(error);
            } else {
              throw error;
            }
          }
        },
        {
          ...this.retryOptions,
          onRetry: (error: Error) => {
            this.log.warn('postmarkEmailTemplateService OnRetry - retrying Postmark updateTemplate due to', error);
          },
        }
      );
    } catch (error) {
      this.log.error('postmarkEmailTemplateService. Unable to do Postmark.updateTemplate', error);
      throw error;
    }
  }

  async deleteAll() : Promise<void> {
      const templates = await this.list();

      for (let i=0; i < templates.length; i++) {
        const id = templates[i].id
        this.log.info("Delete template id: ", id)
        await this.delete(id)
      }
  }

  async delete(id: string): Promise<void> {
    const client = new postmark.ServerClient(this.serverToken);

    try {
      await retry(
        async (bail) => {
          try {
            const deletedTemplate: postmark.Models.DefaultResponse = await client.deleteTemplate(Number(id));
            this.log.debug('postmarkEmailTemplateService deleteTemplate: ', deletedTemplate);
          } catch (error) {
            if (error.retryable === false) {
              bail(error);
            } else {
              throw error;
            }
          }
        },
        {
          ...this.retryOptions,
          onRetry: (error: Error) => {
            this.log.warn('postmarkEmailTemplateService OnRetry - retrying PostMark deleteTemplate due to', error);
          },
        }
      );
    } catch (error) {
      this.log.error('postmarkEmailTemplateService. Unable to do Postmark.deleteTemplate', error);
      throw error;
    }
  }
}
