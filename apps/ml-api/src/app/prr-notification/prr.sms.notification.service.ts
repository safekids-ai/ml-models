import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService} from '@nestjs/config';
import { LoggingService } from '../logger/logging.service';
import { SmsService } from '../sms/sms.service';
import { PrrNotificationDto } from './dto/create-prr-notification.dto';
import { JwtTokenService } from '../auth/jwtToken/jwt.token.service';
import { PrrMessageErrors } from './prr.message.errors';
import { QueueServiceInterface } from '../email/email.interfaces';
import { RedisClientOptions, createClient as createRedisClient } from 'redis';
import Queue from 'bee-queue';
import {WebAppConfig} from "apps/ml-api/src/app/config/webapp";
import {QueueConfig} from "apps/ml-api/src/app/config/queue";

@Injectable()
export class PrrSmsNotificationService implements OnModuleInit, QueueServiceInterface {
    private QUEUE: Queue;
    private readonly QUEUE_URL: string;
    private readonly QUEUE_NAME: string;
    private readonly WEB_URL: string;

    constructor(
        private readonly config: ConfigService,
        private readonly log: LoggingService,
        private readonly smsService: SmsService,
        private readonly jwtTokenService: JwtTokenService
    ) {

        this.log.className(PrrSmsNotificationService.name);
        this.WEB_URL = this.config.get<WebAppConfig>('webAppConfig').url;
        //queue configurations
        const prrNotificationQueueConfig = config.get<QueueConfig>('queueConfig').priorityQueueEmail;
        this.QUEUE_URL = prrNotificationQueueConfig.url;
        this.QUEUE_NAME = prrNotificationQueueConfig.name;
    }

    async onModuleInit(): Promise<void> {
        const redisConnectionOptions: RedisClientOptions = {
            url: this.QUEUE_URL // should be in this format ( redis[s]://[[username][:password]@][host][:port][/db-number] )
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
        this.QUEUE = new Queue(this.QUEUE_NAME, queueSettings);
        await this.listener();
        this.log.info(`A listener called ${this.QUEUE_NAME} setup for queue `, this.QUEUE_URL);
    }

    async listener(): Promise<void> {
        this.QUEUE.process(async (message, done) => {
                this.log.debug('prr message received', message.data);
                const resultProcess = await this.processMessage(message.data);
                return done(null, resultProcess);
        });

        this.QUEUE.on('error', (err) => {
            this.log.error('BeeQueue Parent Email Queue listen error', err);
        });

        this.QUEUE.on('succeeded', (job, result) => {
            this.log.info('BeeQueue Parent Email Queue success: ', result);
        });
        const success = await this.QUEUE.connect();
        if (success) {
            this.log.info(`A listener called ${this.QUEUE_NAME} setup for queue `, this.QUEUE_URL);
        } else {
            this.log.error(`A listener called ${this.QUEUE_NAME} did not setup for queue `, this.QUEUE_URL);
        }
    }

    /**
     * Pushes prr message to queue
     * @param message
     * @return void
     */
    async pushMessageToQueue(message: PrrNotificationDto): Promise<void> {
        const prrNotificationDto = {
            id: message.id,
            accountId: message.accountId,
            category: message.category,
            kidName: message.kidName,
            phoneNumber: message.phoneNumber,
        } as PrrNotificationDto;

        await this.sendMessageRequest(prrNotificationDto);
    }

    private async processMessage(message: any) {
        if (message && message.Body) {
            const body = JSON.parse(message.Body);
            await this.sendPRRSms(body);
        }
    }

    public async sendPRRSms(body) {
        const token = await this.jwtTokenService.generateRegistrationToken(body);
        const url = `${this.WEB_URL}/crisis-management?token=${token}`;
        const messageBody = SmsService.notificationTemplate(body.kidName, body.category, url);
        await this.smsService.sendMessage(body.phoneNumber, messageBody);
    }

    /**
     * send message request to Queue
     * @param messageBody
     * @private
     */
    private async sendMessageRequest(messageBody: PrrNotificationDto) {
        try {
            const job = await this.QUEUE.createJob(messageBody);
            job.save();
            this.log.debug('prr message sent successful', job.id);
        } catch (error) {
            this.log.debug(PrrMessageErrors.onUpload(), error);
            throw new InternalServerErrorException(PrrMessageErrors.onUpload());
        }
    }
}
