import {Injectable} from '@nestjs/common';
import {LoggingService} from '../../logger/logging.service';
import {ConfigService} from '@nestjs/config';
import retry from 'async-retry';
import {EmailInterface, EmailServiceInterface} from '../email.interfaces';
import * as postmark from 'postmark';
import {PostmarkConfig} from "apps/ml-api/src/app/config/postmark.email";
import {QueueConfig} from "apps/ml-api/src/app/config/queue";
import {EmailTemplateService} from "../email.template.service";

@Injectable()
export class PostmarkEmailService implements EmailServiceInterface {
  private readonly retryOptions;
  private readonly fromEmail: string;
  private readonly fromSupportEmail: string;
  private readonly replyEmail: string;
  private readonly serverToken: string;

  constructor(
    private readonly config: ConfigService,
    private readonly log: LoggingService
  ) {
    const postmarkEmailConfig = config.get<PostmarkConfig>('postmarkConfig');
    const emailQueueConfig = config.get<QueueConfig>('queueConfig').standardQueueEmail;

    //retry settings
    this.retryOptions = emailQueueConfig.retryOptions;

    //email reply
    this.serverToken = postmarkEmailConfig.serverToken;
    this.fromEmail = postmarkEmailConfig.from;
    this.fromSupportEmail = postmarkEmailConfig.from_support;
    this.replyEmail = postmarkEmailConfig.reply;
    this.log.className(PostmarkEmailService.name);
  }

  async onModuleInit(): Promise<void> {
  }

  /*
   The method is purely to write the email to the queue for processing
   */
  async sendEmail(emailInput: EmailInterface): Promise<void> {
    const email = {...emailInput};
    email.from = emailInput.useSupportEmail ? this.fromSupportEmail : this.fromEmail;
    email.reply = this.replyEmail;

    this.log.debug('PostmarkEmailService sending email', email);

    //we'll run this async
    this.sendPostmarkEmail(email);
  }

  async sendPostmarkEmail(email: EmailInterface): Promise<postmark.Models.MessageSendingResponse> {
    const postmarkClient = new postmark.ServerClient(this.serverToken);
    const params = await this.createParams(email);

    try {
      const result = await retry(
        async (bail) => {
          try {
            let response: postmark.Models.MessageSendingResponse = {
              SubmittedAt: '',
              MessageID: '',
              ErrorCode: 0,
              Message: '',
            };
            if (email.content.templateName) {
              this.log.debug("Sending email (via template) with params:", params)
              response = await postmarkClient.sendEmailWithTemplate(params as postmark.Models.TemplatedMessage);
            } else {
              response = await postmarkClient.sendEmail(params as postmark.Models.Message);
            }
            this.log.debug('Postmark email successfully sent: ', email);
            return response;
          } catch (error) {
            this.log.error('Postmark email delivery failed: ', {email, error});
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
            this.log.warn('Postmark Email Service OnRetry - retrying sending Postmark email due to', error);
          },
        }
      );

      return result;
    } catch (error) {
      this.log.error('Postmark Email Service. Unable to send email message using postmark', error);
    }
  }

  async createParams(email: EmailInterface): Promise<postmark.Models.Message | postmark.Models.TemplatedMessage> {
    const isTemplate = email.content.templateName;

    if (!isTemplate) {
      return {
        From: email.from,
        To: typeof email.to === 'string' ? email.to : email.to.join(', '),
        Subject: email.content.subject,
        HtmlBody: email.content.body,
        ReplyTo: email.reply,
      };
    }

    const emailParams: postmark.Models.TemplatedMessage = {
      TemplateId: +email.content.templateId,
      From: email.from,
      To: typeof email.to === 'string' ? email.to : email.to.join(', '),
      ReplyTo: email.reply,
      TemplateModel: email.meta,
    };
    return emailParams;
  }
}
