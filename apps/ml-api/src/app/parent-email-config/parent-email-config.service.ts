import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingService } from '../logger/logging.service';
import { ParentEmailConfigDto } from './dto/parent-email-config.dto';
import { KidConfigService } from '../kid-config/kid-config.service';
import { ExtensionStatus } from '../kid-config/enum/extension-status';
import { EmailService } from '../email/email.service';
import { uuid } from 'uuidv4';
import { EmailTemplates } from '../email/email.templates';
import { QueryException } from '../error/common.exception';
import { QueueServiceInterface } from '../email/email.interfaces';
import { RedisClientOptions, createClient as createRedisClient } from 'redis';
import Queue from 'bee-queue';
import {QueueConfig} from "apps/ml-api/src/app/config/queue";

@Injectable()
export class ParentEmailConfigService implements OnModuleInit, QueueServiceInterface {
    private PARENT_EMAIL_QUEUE: Queue;
    private readonly QUEUE_URL: string;
    private readonly QUEUE_NAME: string;

    constructor(
        private readonly config: ConfigService,
        private readonly log: LoggingService,
        private readonly kidConfigService: KidConfigService,
        private readonly emailService: EmailService
    ) {
        // Set the region we will be using
        this.log.className(ParentEmailConfigService.name);
        //queue configurations
        const parentEmailQueue = config.get<QueueConfig>('queueConfig').standardQueueEmail;
        this.QUEUE_URL = parentEmailQueue.url;
        this.QUEUE_NAME = parentEmailQueue.name;

        if (!this.QUEUE_NAME) {
            throw new Error('Please define proper name for Parent email config service queue');
        }
    }

    async onModuleInit(): Promise<void> {
        const redisConnectionOptions: RedisClientOptions = {
            url: this.QUEUE_URL, // should be in this format ( redis[s]://[[username][:password]@][host][:port][/db-number] )
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
        this.PARENT_EMAIL_QUEUE = new Queue(this.QUEUE_NAME, queueSettings);
        await this.listener();
        this.log.info(`A listener called ${this.QUEUE_NAME} setup for queue `, this.QUEUE_URL);
    }

    async handleMessage(message): Promise<void> {
        if (message && message.Body) {
            const body = JSON.parse(message.Body);
            const kidConfig = await this.kidConfigService.fetch(body.id);
            if (kidConfig && kidConfig.extensionStatus === ExtensionStatus.UNINSTALLED) {
                await this.emailService.sendEmail({
                    id: uuid(),
                    useSupportEmail: true,
                    meta: {
                        kidName: `${body.firstName} ${body.lastName}`,
                    },
                    to: body.parentEmail,
                    content: {
                        templateName: EmailTemplates.INFORM_EXTENSION_UNINSTALL_DISABLED,
                    },
                });
            }
        }
    }

    async listener(): Promise<void> {
        this.PARENT_EMAIL_QUEUE.process(async (message, done) => {
            this.log.debug(message.data.length + 'parent email configuration received', message.data);
            const result = await this.handleMessage(message.data);
            return done(null, result);
        });

        this.PARENT_EMAIL_QUEUE.on('error', (err) => {
            this.log.error('BeeQueue Parent Email Queue listen error', err);
        });

        this.PARENT_EMAIL_QUEUE.on('succeeded', (job, result) => {
            this.log.info('BeeQueue Parent Email Queue success: ', result);
        });
        const success = await this.PARENT_EMAIL_QUEUE.connect();
        if (success) {
            this.log.info(`A listener called ${this.QUEUE_NAME} setup for queue `, this.QUEUE_URL);
        } else {
            this.log.error(`A listener called ${this.QUEUE_NAME} did not setup for queue `, this.QUEUE_URL);
        }
    }

    /**
     * Pushes parent events to queue
     * @param message
     * @return void
     */
    async pushMessageToQueue(message: ParentEmailConfigDto): Promise<void> {
        try {
            const job = await this.PARENT_EMAIL_QUEUE.createJob(message);
            job.save();
            this.log.debug('Parent email event pushed in queue successful', job.id);
        } catch (error) {
            this.log.error(QueryException.save(error));
            throw new QueryException(QueryException.save());
        }
    }
}
