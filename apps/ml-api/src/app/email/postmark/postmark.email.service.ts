import {Injectable} from '@nestjs/common';
import {LoggingService} from '../../logger/logging.service';
import {ConfigService} from '@nestjs/config';
import {RedisClientOptions, createClient as createRedisClient} from 'redis';
import retry from 'async-retry';
import {EmailInterface, QueueServiceInterface} from '../email.interfaces';
import * as postmark from 'postmark';
import {PostmarkConfig} from "apps/ml-api/src/app/config/postmark.email";
import {QueueConfig, QueueConfigItem} from "apps/ml-api/src/app/config/queue";
import {Queue, Worker, Job} from 'bullmq';
import IORedis from 'ioredis';
import Redis from "ioredis";
import {BatchProcessor} from "../../utils/queue";
import {InjectQueue, Processor} from "@nestjs/bullmq";
import {EmailService} from "../email.service";


@Injectable()
export class PostmarkEmailService extends EmailService implements QueueServiceInterface {
  private readonly fromEmail: string;
  private readonly fromSupportEmail: string;
  private readonly replyEmail: string;
  private readonly serverToken: string;
  private queueConfig: QueueConfigItem;

  constructor(
    private readonly config: ConfigService,
    private readonly log: LoggingService,
    @InjectQueue('email-queue') private readonly queue: Queue
  ) {
    super();
    const postmarkEmailConfig = config.get<PostmarkConfig>('postmarkConfig');
    this.fromEmail = postmarkEmailConfig.from
    this.fromSupportEmail = postmarkEmailConfig.from_support

    this.queueConfig = config.get<QueueConfig>('queueConfig').queueEmail;

    //email reply
    this.serverToken = postmarkEmailConfig.serverToken;
    this.fromEmail = postmarkEmailConfig.from;
    this.fromSupportEmail = postmarkEmailConfig.from_support;
    this.replyEmail = postmarkEmailConfig.reply;
    this.log.className(PostmarkEmailService.name);
  }

  async onModuleInit(): Promise<void> {
    await this.wireListener();
  }

  async wireListener(): Promise<void> {
    const batchProcessor = new BatchProcessor<EmailInterface>(this.log,
      {
        queue: this.queue,
        batchSize: this.queueConfig.batchOptions.size,
        batchTimeout: this.queueConfig.batchOptions.timeout,
        processBatch: this.processBatch.bind(this),
        workerCount: this.queueConfig.workers,
        retryOptions: this.queueConfig.retryOptions
      });
  }

  async sendEmail(emailInput: EmailInterface): Promise<void> {
    this.log.debug('Adding email to send queue', emailInput)
    emailInput.from = this.fromEmail
    //emailInput.from = (emailInput.useSupportEmail) ? this.fromSupportEmail : this.fromEmail
    await this.queue.add('email-job', emailInput)
  }

  public processBatch = async (jobs: Job<EmailInterface>[]): Promise<void> => {
    const withTemplate = jobs.filter(email => email.data.content.templateName);
    const withoutTemplate = jobs.filter(email => !email.data.content.templateName);

    if (withTemplate) {
      await this.sendPostmarkTemplateBatch(withTemplate.map(job => job));
    }
    if (withoutTemplate) {
      await this.sendPostmarkBatch(withoutTemplate.map(job => job))
    }
  }

  async sendPostmarkTemplateBatch(emails: Job<EmailInterface>[]): Promise<postmark.Models.MessageSendingResponse[]> {
    const postmarkClient = new postmark.ServerClient(this.serverToken);
    const params = emails.map((email) => this.createTemplateBatchParams(email.data));

    const response = await postmarkClient.sendEmailBatchWithTemplates(params);
    this.log.debug(`Postmark email template batch successfully sent.`, emails);

    for (let i = 0; i < response.length; i++) {
      const res = response[i];
      if (res.ErrorCode === 0) {
        this.log.debug(`Job ${emails[i].id} sent successfully:`, emails[i], res);
      } else {
        this.log.error(`Job ${emails[i].id} failed to send:`, emails[i], res);
      }
    }

    return response;
  }

  async sendPostmarkBatch(emails: Job<EmailInterface>[]): Promise<postmark.Models.MessageSendingResponse[]> {
    if (!emails || emails.length == 0) {
      return
    }

    const postmarkClient = new postmark.ServerClient(this.serverToken);
    const params = emails.map((email) => this.createBatchParams(email.data));
    const response = await postmarkClient.sendEmailBatch(params);
    this.log.debug('Postmark email batch successfully sent:', emails);

    for (let i = 0; i < response.length; i++) {
      const res = response[i];
      if (res.ErrorCode === 0) {
        this.log.debug(`Job ${emails[i].id} with message ${emails[i].data} sent successfully:`, res);
      } else {
        this.log.error(`Job ${emails[i].id} with message ${emails[i].data} failed to send:`, res);
      }
    }
    return response;
  }

  createTemplateBatchParams(email: EmailInterface): postmark.Models.TemplatedMessage {
    const emailParams: postmark.Models.TemplatedMessage = {
      TemplateAlias: email.content.templateName,
      From: email.from,
      To: typeof email.to === 'string' ? email.to : email.to.join(', '),
      ReplyTo: email.reply,
      TemplateModel: email.meta
    };
    return emailParams;
  }

  createBatchParams(email: EmailInterface): postmark.Models.Message {
    const emailParams: postmark.Models.Message = {
      From: email.from,
      To: typeof email.to === 'string' ? email.to : email.to.join(', '),
      Subject: email.content.subject,
      HtmlBody: email.content.body,
      ReplyTo: email.reply,
    };
    return emailParams;
  }
}
