import { Inject, Injectable } from '@nestjs/common';
import { INFORM_PRR_VISIT_REPOSITORY } from '../constants';
import { LoggingService } from '../logger/logging.service';
import { InformPrrVisit, InformPrrVisitCreationAttributes } from './entities/inform-prr-visit.entity';
import { PrrInformVisitDto, TabVisit } from '../chrome/dto/prr.activity.dto';
import { ActivityService } from '../activity/activity.service';
import { User } from '../user/entities/user.entity';
import { uuid } from 'uuidv4';
import { EmailTemplates } from '../email/email.templates';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import retry from 'async-retry';
import { QueueServiceInterface } from '../email/email.interfaces';
import { PrrActivityRequest } from '../chrome/dto/prr.activity.request';
import Queue from 'bee-queue';
import { RedisClientOptions, createClient as createRedisClient } from 'redis';
import {WebAppConfig} from "apps/ml-api/src/app/config/webapp";
import {QueueConfig} from "apps/ml-api/src/app/config/queue";

@Injectable()
export class InformPrrVisitsService implements QueueServiceInterface {
    private readonly WEB_URL: string;
    private queue: Queue;
    private readonly queueName: string;
    private readonly queueUrl: string;
    private readonly retryOptions;

    constructor(
        @Inject(INFORM_PRR_VISIT_REPOSITORY) private repository: typeof InformPrrVisit,
        private readonly activityService: ActivityService,
        private readonly userService: UserService,
        private readonly log: LoggingService,
        private readonly emailService: EmailService,
        private readonly config: ConfigService
    ) {
        this.log.className(InformPrrVisitsService.name);
        this.WEB_URL = this.config.get<WebAppConfig>('webAppConfig').url;
        const informEventQueueConfig = config.get<QueueConfig>('queueConfig').standardQueueEmail;

        //queue settings
        this.queueName = informEventQueueConfig.name;
        this.queueUrl = informEventQueueConfig.url;
        this.retryOptions = informEventQueueConfig.retryOptions;
    }

    async onModuleInit(): Promise<void> {
        const redisConnectionOptions: RedisClientOptions = {
            url: this.queueUrl, // should be in this format ( redis[s]://[[username][:password]@][host][:port][/db-number] )
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
        this.queue = new Queue(this.queueName, queueSettings);
        await this.listener();
        this.log.info(`A listener called ${this.queueName} setup for queue `, this.queueUrl);
    }

    public async listener() {
        this.queue.process(async (message, done) => {
            this.log.debug(`received inform event`);
            const request = JSON.parse(message.Body);
            if (request.activities) {
                const prrActivityRequest: PrrActivityRequest = request as PrrActivityRequest;
                this.log.debug('Bee queue received inform event', { prrActivityRequest });
                await this.activityService.savePrrActivityInBulk(prrActivityRequest);
            } else {
                const informEvent: PrrInformVisitDto = request as PrrInformVisitDto;
                this.log.debug('Bee queue received inform event', { informEvent });
                await this.saveInformPrrVisits(informEvent);
            }
            return done(null, null);
        });

        this.queue.on('error', (err) => {
            this.log.error('BeeQueue Inform Prr Queue listen error', err);
        });

        this.queue.on('succeeded', (job, result) => {
            this.log.info('BeeQueue Inform Prr Queue success: ', result);
        });
        const success = await this.queue.connect();
        if (success) {
            this.log.info(`A listener called ${this.queueName} setup for queue `, this.queueUrl);
        } else {
            this.log.error(`A listener called ${this.queueName} did not setup for queue `, this.queueUrl);
        }
    }

    async sendMessage(message: PrrInformVisitDto) {
        this.log.debug('InformEventService sending inform event', message);
        try {
            const result = await retry(
                async (bail) => {
                    try {
                        const job = await this.queue.createJob(message);
                        job.save();
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
                        this.log.warn('Inform Event Service OnRetry - retrying queue email due to', error);
                    },
                }
            );
            return result;
        } catch (error) {
            this.log.error('Inform Event Service. Unable to send message to queue', error);
        }
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
            id: uuid(),
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
