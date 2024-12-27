import {Inject, Injectable} from '@nestjs/common';
import {INFORM_PRR_VISIT_REPOSITORY} from '../constants';
import {LoggingService} from '../logger/logging.service';
import {InformPrrVisit, InformPrrVisitCreationAttributes} from './entities/inform-prr-visit.entity';
import {PrrInformVisitDto, TabVisit} from '../chrome/dto/prr.activity.dto';
import {ActivityService} from '../activity/activity.service';
import {User} from '../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import {EmailTemplates} from '../email/email.templates';
import {EmailService} from '../email/email.service';
import {UserService} from '../user/user.service';
import {ConfigService} from '@nestjs/config';
import retry from 'async-retry';
import {QueueServiceInterface} from '../email/email.interfaces';
import {PrrActivityRequest} from '../chrome/dto/prr.activity.request';
import {RedisClientOptions, createClient as createRedisClient} from 'redis';
import {WebAppConfig} from "../config/webapp";
import {QueueConfig, QueueConfigItem} from "../config/queue";
import {Job, Queue} from "bullmq";
import {BatchProcessor} from "../utils/queue";
import {EmailEventDto} from "../email-event/dto/email-event.dto";
import {InjectQueue} from "@nestjs/bullmq";

@Injectable()
export class InformPrrVisitsService implements QueueServiceInterface {
  private readonly WEB_URL: string;
  private queueConfig: QueueConfigItem;

  constructor(
    @Inject(INFORM_PRR_VISIT_REPOSITORY) private repository: typeof InformPrrVisit,
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
    private readonly log: LoggingService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    @InjectQueue('inform-prr-visits-queue') private readonly queue: Queue
  ) {
    this.log.className(InformPrrVisitsService.name);
    this.WEB_URL = this.config.get<WebAppConfig>('webAppConfig').url;
    this.queueConfig = config.get<QueueConfig>('queueConfig').queueInformPRR;
  }

  async onModuleInit(): Promise<void> {
    await this.wireListener();
  }

  async sendMessage(message: PrrInformVisitDto) {
    this.log.debug('InformEventService sending inform event', message);
    await this.queue.add('inform-prr-job', message)
  }

  public async wireListener() {
    const batchProcessor = new BatchProcessor<PrrInformVisitDto>(this.log,
      {
        queue: this.queue,
        batchSize: this.queueConfig.batchOptions.size,
        batchTimeout: this.queueConfig.batchOptions.timeout,
        processBatch: this.processBatch,
        workerCount: this.queueConfig.workers,
        retryOptions: this.queueConfig.retryOptions
      });
  }

  public processBatch = async (jobs: Job<PrrInformVisitDto>[]): Promise<void> => {
    await Promise.all(
      jobs.map(async (job) => {
        await this.saveInformPrrVisits(job.data);
      })
    );
  }

  async bulkCreate(visits: InformPrrVisitCreationAttributes[]) {
    return await this.repository.bulkCreate(visits);
  }

  async saveInformPrrVisits(prrDto: PrrInformVisitDto) {
    const activity = await this.activityService.findOneByEventId(prrDto.eventId, prrDto.userId);
    const visits = prrDto.visits.map((o) => {
      return {
        url: o.url,
        activityId: activity.id,
        visitTime: o.time,
      };
    });

    this.bulkCreate(visits);

    const kid = await this.userService.findOneById(prrDto.userId);
    const user = await this.userService.findParentAccount(prrDto.accountId);
    this.log.debug(`Sending message....email`);

    this.sendInformEventEmail(prrDto.visits, kid, user);
  }

  /**
   * send Email to adult for an event
   * @param userId
   */
  private async sendInformEventEmail(visits: TabVisit[], kid: User, parent: User): Promise<void> {
    this.emailService.sendEmail({
      id: uuidv4(),
      useSupportEmail: true,
      meta: {
        kidName: `${kid.firstName} ${kid.lastName}`,
        settingsUrl: `${this.WEB_URL}/settings`,
        visits: visits,
      },
      to: parent.email,
      content: {
        templateName: EmailTemplates.PRR_INFORM_EVENT_EMAIL,
      },
    });
  }
}
