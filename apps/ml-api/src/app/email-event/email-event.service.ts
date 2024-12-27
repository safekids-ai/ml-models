import {HttpStatus, Inject, Injectable} from '@nestjs/common';
import {EMAILEVENT_REPOSITORY} from '../constants';
import {EmailEvent, EmailEventCreationAttributes, Flag} from './entities/email-event.entity';
import {EmailMessage} from './email.message';
import {QueryTypes} from 'sequelize';
import {GmailReportDto} from '../insight/dto/gmail-report.dto';
import {EmailEventTypes} from './email-event-types';
import {LoggingService} from '../logger/logging.service';
import {PrrUserAction} from '../prr-action/prr-action.default';
import {QueueServiceInterface} from '../email/email.interfaces';
import {ConfigService} from '@nestjs/config';
import retry from 'async-retry';
import { v4 as uuidv4 } from 'uuid';
import {EmailTemplates} from '../email/email.templates';
import {EmailService} from '../email/email.service';
import {User} from '../user/entities/user.entity';
import {UserService} from '../user/user.service';
import {EmailEventConfigService} from '../email-event-config/email-event-config.service';
import {EmailEventDto} from './dto/email-event.dto';
import {RedisClientOptions, createClient as createRedisClient} from 'redis';
import {QueueConfig, QueueConfigItem} from "../config/queue";
import {Job, Queue} from "bullmq";
import {BatchProcessor} from "../utils/queue";
import {PrrInformVisitDto} from "../chrome/dto/prr.activity.dto";
import {PrrActivityRequest} from "../chrome/dto/prr.activity.request";
import {InjectQueue} from "@nestjs/bullmq";

@Injectable()
export class EmailEventService implements QueueServiceInterface {
  private queueConfig: QueueConfigItem;

  constructor(
    @Inject(EMAILEVENT_REPOSITORY)
    private readonly repository: typeof EmailEvent,
    private readonly config: ConfigService,
    private log: LoggingService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly emailEventConfigService: EmailEventConfigService,
    @InjectQueue('email-event-queue') private readonly queue: Queue

  ) {
    this.log.className(EmailEventService.name);
    this.queueConfig = config.get<QueueConfig>('queueConfig').queueGmailExtension;
  }

  async onModuleInit(): Promise<void> {
    await this.wireListener();
  }

  async sendMessage(message: EmailEventDto) {
    if (message && message.eventTypeId && message.eventTypeId == EmailEventTypes.EMAIL_THREAD_READ_EVENT) {
      if (!message.threadId || message.mlFlag != Flag.UNKIND) {
        return;
      }
    }
    this.log.debug('GmailEventService sending gmail', message);
    await this.queue.add('gmail-ext-email-job', message)
  }

  public async wireListener() {
    const batchProcessor = new BatchProcessor<EmailEventDto>(this.log,
      {
        queue: this.queue,
        batchSize: this.queueConfig.batchOptions.size,
        batchTimeout: this.queueConfig.batchOptions.timeout,
        processBatch: this.processBatch,
        workerCount: this.queueConfig.workers,
        retryOptions: this.queueConfig.retryOptions
      });
  }

  public processBatch = async (jobs: Job<EmailEventDto>[]): Promise<void> => {
    await Promise.all(
      jobs.map(async (job) => {
        await this.create(job.data);
      })
    );
  }

  /**
   * Create a new email event, if event type is EMAIL_THREAD_READ_EVENT then use find or replace to avoid duplicate
   * @param emailEventDto
   */
  async create(emailEventDto: EmailEventDto): Promise<HttpStatus> {
    if (emailEventDto.emailMessage) {
      const email = emailEventDto.emailMessage as EmailMessage;
      emailEventDto.subject = email.subject;
      emailEventDto.body = email.body;
    }

    this.repository.create(emailEventDto);

    //account.domain =='kgcs'
    if (emailEventDto.eventTypeId === EmailEventTypes.EMAIL_MESSAGE_FLAG_EVENT && emailEventDto.prrAction === PrrUserAction.MESSAGE_ACTION_TALK_TO_ADULT) {
      this.sendEmail(emailEventDto.userId, emailEventDto.eventTypeId, emailEventDto.prrAction);
    }
    return HttpStatus.CREATED;
  }

  /**
   * send Email to adult for an event
   * @param userId
   */
  async sendEmail(userId: string, event: EmailEventTypes, prrAction: PrrUserAction): Promise<void> {
    this.log.debug(`Sending email for event [${event}] for user [${userId}].`);
    const user: User = await this.userService.findOneById(userId);
    if (!user) {
      this.log.error(`User not found so not sending email.`);
      return;
    }
    const emailEventConfig = await this.emailEventConfigService.findOneByAccountIdByEvent(user.accountId, event, prrAction);
    if (emailEventConfig && emailEventConfig.enabled) {
      const recipients: string[] = emailEventConfig.emailRecipients.split(',');
      this.log.warn(`Sending email to ${recipients} for event [${event}] for user [${userId}].`);
      this.emailService.sendEmail({
        id: uuidv4(),
        useSupportEmail: true,
        meta: {
          userEmail: `${user.email}`,
        },
        to: recipients,
        content: {
          templateName: EmailTemplates.GMAIL_EXT_TALK_TO_ADULT,
        },
      });
    }
  }

  /**
   * Generate Report for Gmail events
   * @param accountId
   * @param start
   * @param end
   * @return report json
   */
  async getGmailReport(accountId, start, end): Promise<GmailReportDto> {
    const gmailResponse: GmailReportDto = new GmailReportDto();

    const mlCountResult: object[] = await this.repository.sequelize.query(
      'SELECT count(ml_flag) as total FROM email_event a ' +
      ' where (a.ml_flag = :flag) and a.account_id=:accountId' +
      ' AND DATE(a.event_time) BETWEEN DATE(:start) AND DATE(:end) ',
      {
        replacements: {
          accountId: accountId,
          start: start,
          end: end,
          flag: Flag.UNKIND,
        },
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );
    const userCountResult: object[] = await this.repository.sequelize.query(
      'SELECT count(user_flag) as total FROM email_event a ' +
      ' where (a.user_flag = :flag) ' +
      'and a.account_id=:accountId AND DATE(a.event_time) BETWEEN DATE(:start) AND DATE(:end) ',
      {
        replacements: {
          accountId: accountId,
          start: start,
          end: end,
          flag: Flag.UNKIND,
        },
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );
    const reachedToAdultResult: object[] = await this.repository.sequelize.query(
      'select count(*) as total from email_event a ' +
      ' where prr_action_id = :actionId ' +
      ' and event_type_id = :eventId and a.account_id=:accountId ' +
      ' AND DATE(a.event_time) BETWEEN DATE(:start) AND DATE(:end) ',
      {
        replacements: {
          accountId: accountId,
          start: start,
          end: end,
          actionId: PrrUserAction.MESSAGE_ACTION_TALK_TO_ADULT,
          eventId: EmailEventTypes.EMAIL_MESSAGE_FLAG_EVENT,
        },
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );

    const OutgoingSentResult: object[] = await this.repository.sequelize.query(
      ' select count(prr_action_id) as total' +
      ' from email_event a ' +
      ' where event_type_id = :eventId and prr_action_id = :actionId ' +
      ' and account_id=:accountId ' +
      ' AND DATE(a.event_time) BETWEEN DATE(:start) AND DATE(:end) ',
      {
        replacements: {
          accountId: accountId,
          start: start,
          end: end,
          actionId: PrrUserAction.COMPOSE_ACTION_YES_ITS_FINE,
          eventId: EmailEventTypes.EMAIL_SEND_EVENT,
        },
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );

    const OutgoingChangedResult: object[] = await this.repository.sequelize.query(
      ' select count(prr_action_id) as total' +
      ' from email_event a ' +
      ' where event_type_id = :eventId and prr_action_id = :actionId ' +
      ' and account_id=:accountId ' +
      ' AND DATE(a.event_time) BETWEEN DATE(:start) AND DATE(:end) ',
      {
        replacements: {
          accountId: accountId,
          start: start,
          end: end,
          actionId: PrrUserAction.COMPOSE_ACTION_NO_TRY_AGAIN,
          eventId: EmailEventTypes.EMAIL_SEND_EVENT,
        },
        type: QueryTypes.SELECT,
        mapToModel: true,
      }
    );
    const totalMlFlagged = mlCountResult && mlCountResult.length > 0 && "total" in mlCountResult[0] ? mlCountResult[0].total as number : 0;
    const totalUserFlagged = userCountResult && userCountResult.length > 0 && "total" in userCountResult[0] ? userCountResult[0].total as number : 0;
    const reachedToAdult = reachedToAdultResult && reachedToAdultResult.length > 0 && "total" in reachedToAdultResult[0] ? reachedToAdultResult[0].total as number : 0;
    const outgoingSent = OutgoingSentResult && OutgoingSentResult.length > 0 && "total" in OutgoingSentResult[0] ? OutgoingSentResult[0].total as number : 0;
    const outgoingChanged = OutgoingChangedResult && OutgoingChangedResult.length > 0 && "total" in OutgoingChangedResult[0] ? OutgoingChangedResult[0].total as number : 0;

    gmailResponse.totalOutgoingChanged = outgoingChanged;
    gmailResponse.totalOutgoingSent = outgoingSent;
    gmailResponse.totalOutgoing = outgoingChanged + outgoingSent;

    gmailResponse.totalReachedToAdult = reachedToAdult;

    gmailResponse.totalUnkind = totalMlFlagged + totalUserFlagged;
    gmailResponse.totalUnkindFlagged = totalUserFlagged;

    return gmailResponse;
  }
}
