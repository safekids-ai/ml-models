import {Injectable, InternalServerErrorException, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {LoggingService} from '../logger/logging.service';
import {SmsService} from '../sms/sms.service';
import {PrrNotificationDto} from './dto/create-prr-notification.dto';
import {JwtTokenService} from '../auth/jwtToken/jwt.token.service';
import {PrrMessageErrors} from './prr.message.errors';
import {EmailInterface, QueueServiceInterface} from '../email/email.interfaces';
import {RedisClientOptions, createClient as createRedisClient} from 'redis';
import {WebAppConfig} from "apps/ml-api/src/app/config/webapp";
import {QueueConfig, QueueConfigItem} from "apps/ml-api/src/app/config/queue";
import {Job, Queue} from "bullmq";
import IORedis from "ioredis";
import {BatchProcessor} from "../utils/queue";
import {PrrInformVisitDto} from "../chrome/dto/prr.activity.dto";
import {UserDTO} from "../user/dto/user.dto";
import {InjectQueue} from "@nestjs/bullmq";

@Injectable()
export class PrrSmsNotificationService implements OnModuleInit, QueueServiceInterface {
  private queueConfig: QueueConfigItem;
  private readonly WEB_URL: string;

  constructor(
    private readonly config: ConfigService,
    private readonly log: LoggingService,
    private readonly smsService: SmsService,
    private readonly jwtTokenService: JwtTokenService,
    @InjectQueue('prr-notification-queue') private readonly queue: Queue
  ) {

    this.log.className(PrrSmsNotificationService.name);
    this.WEB_URL = this.config.get<WebAppConfig>('webAppConfig').url;
    this.queueConfig = config.get<QueueConfig>('queueConfig').queueSms;
  }

  async onModuleInit(): Promise<void> {
    await this.wireListener();
  }

  async sendMessage(message: PrrNotificationDto): Promise<void> {
    this.log.debug('SmsService sending PRR event', message);
    await this.queue.add('sms-prr-job', message)
  }

  public async wireListener() {
    const batchProcessor = new BatchProcessor<PrrNotificationDto>(this.log,
      {
        queue: this.queue,
        batchSize: this.queueConfig.batchOptions.size,
        batchTimeout: this.queueConfig.batchOptions.timeout,
        processBatch: this.processBatch,
        workerCount: this.queueConfig.workers,
        retryOptions: this.queueConfig.retryOptions
      });
  }

  public processBatch = async (jobs: Job<PrrNotificationDto>[]): Promise<void> => {
    await Promise.all(
      jobs.map(async (job) => {
        await this.sendPRRSms(job.data);
      })
    );
  }

  public async sendPRRSms(dto: PrrNotificationDto) {
    const obj = {
      userId: dto.id,
      accountId: dto.accountId
    } as UserDTO
    const token = await this.jwtTokenService.generateRegistrationToken(obj);
    const url = `${this.WEB_URL}/crisis-management?token=${token}`;
    const messageBody = SmsService.notificationTemplate(dto.kidName, dto.category, url);
    await this.smsService.sendMessage(dto.phoneNumber, messageBody);
  }
}
