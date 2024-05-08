import {Injectable} from '@nestjs/common';
import {LoggingService} from '../../logger/logging.service';
import {ConfigService} from '@nestjs/config';
import Queue from 'bee-queue';
import {RedisClientOptions, createClient as createRedisClient} from 'redis';
import retry from 'async-retry';
import {EmailInterface, EmailServiceInterface, QueueServiceInterface} from '../email.interfaces';
import * as postmark from 'postmark';
import {PostmarkConfig} from "apps/ml-api/src/app/config/postmark.email";
import {QueueConfig} from "apps/ml-api/src/app/config/queue";

@Injectable()
export class PostmarkEmailService implements EmailServiceInterface, QueueServiceInterface {
  private emailQueue: Queue;
  private readonly queueName: string;
  private readonly queueUrl: string;
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

    //queue settings
    this.queueName = emailQueueConfig.name;
    this.queueUrl = emailQueueConfig.url;
    this.retryOptions = emailQueueConfig.retryOptions;

    //email reply
    this.serverToken = postmarkEmailConfig.serverToken;
    this.fromEmail = postmarkEmailConfig.from;
    this.fromSupportEmail = postmarkEmailConfig.from_support;
    this.replyEmail = postmarkEmailConfig.reply;
    this.log.className(PostmarkEmailService.name);

    if (!this.queueName) {
      throw new Error('Please define proper name for PostmarkEmailService queue');
    }
  }

  async onModuleInit(): Promise<void> {
    const redisConnectionOptions: RedisClientOptions = {
      url: this.queueUrl // should be in this format ( redis[s]://[[username][:password]@][host][:port][/db-number] )
      // redis://alice:foobared@awesome.redis.server:6380
    };
    const queueSettings: Queue.QueueSettings = {
      prefix: 'safekids',
      autoConnect: true,
      removeOnFailure: false,
      removeOnSuccess: true,
      stallInterval: 5000,
      redis: createRedisClient(redisConnectionOptions),
    };
    this.emailQueue = new Queue(this.queueName, queueSettings);
    await this.listener();
    this.log.info(`A listener called ${this.queueName} is setup for queue `, this.queueUrl);
  }

  async listener(): Promise<void> {
    this.emailQueue.process(async (message, done) => {
      const email = JSON.parse(message.data.Body) as EmailInterface;
      this.log.debug(`Bee Queue ${this.emailQueue.name} received email`, {email});
      const result = await this.sendPostmarkEmail(email);
      return done(null, result);
    });

    this.emailQueue.on('error', (err) => {
      this.log.error('BeeQueue Email Queue listen error', err);
    });

    this.emailQueue.on('succeeded', (job, result) => {
      this.log.info('BeeQueue Email Queue success: ', result);
    });
    const success = await this.emailQueue.connect();
    if (success) {
      this.log.info(`A listener called ${this.queueName} is setup for queue `, this.queueUrl);
    } else {
      this.log.error(`A listener called ${this.queueName} did not setup for queue `, this.queueUrl);
    }
  }

  /*
   The method is purely to write the email to the queue for processing
   */
  async sendEmail(emailInput: EmailInterface): Promise<void> {
    const email = {...emailInput};
    email.from = emailInput.useSupportEmail ? this.fromSupportEmail : this.fromEmail;
    email.reply = this.replyEmail;

    this.log.debug('PostmarkEmailService sending email to queue', email);

    try {
      const result = await retry(
        async (bail) => {
          try {
            const job = await this.emailQueue.createJob(email);
            await job.save();
            this.log.debug('PostmarkEmailService success sending email to queue', email);
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
            this.log.warn('Postmark Email Service OnRetry - retrying queue email due to', error);
          },
        }
      );

      return result;
    } catch (err) {
      this.log.error('Postmark Email Service. Unable to send email message to queue', err);
    }
  }

  async sendPostmarkEmail(email: EmailInterface): Promise<postmark.Models.MessageSendingResponse> {
    const postmarkClient = new postmark.ServerClient(this.serverToken);
    const params = this.createParams(email);

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

  createParams(email: EmailInterface): postmark.Models.Message | postmark.Models.TemplatedMessage {
    if (!email.content.templateName) {
      const emailParams: postmark.Models.Message = {
        From: email.from,
        To: typeof email.to === 'string' ? email.to : email.to.join(', '),
        Subject: email.content.subject,
        HtmlBody: email.content.body,
        ReplyTo: email.reply,
      };
      return emailParams;
    } else {
      const emailParams: postmark.Models.TemplatedMessage = {
        TemplateId: 0, // FIXME: assign some template id after creating the templates
        From: email.from,
        To: typeof email.to === 'string' ? email.to : email.to.join(', '),
        ReplyTo: email.reply,
        TemplateModel: {company: 'test'}, // FIXME: assign template model after creating email template
      };
      return emailParams;
    }
  }
}
